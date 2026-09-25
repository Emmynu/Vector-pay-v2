from sqlmodel import select, update, or_, desc, func, and_,extract,case
from fastapi import Query, status, HTTPException
from src.db.models import Users, Transactions, Kyc
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.enums import Operators, KycStatus, TransactionType, TransactionStatus, Roles, Prefrences
from decimal import Decimal
from .schema import TransactionCreateSchema, TransactionResponsePaginated, TransactionResponseModel, TransactionPinSchema, EditProfileSchema, KycUploadSchema, UserProfileResponse, ResolveBankAccountSchema
from datetime import datetime, timezone
from src.auth.utils import hashPassword
from src.config import config
import requests
import calendar
from typing import Optional


headers = {
   "Authorization": f'Bearer {config.PAYSTACK_SECRET_KEY}',
    "Content-Type": "application/json"
}


class AccountService():  

  async def update_transaction_pin(self, id:str, transactionPinSchema:TransactionPinSchema, session:AsyncSession):
    hashedPin =  hashPassword(transactionPinSchema.pin)
    user =  await session.execute(update(Users).where(Users.id == id).values(transactionPin = hashedPin))

    return True if user is not None else False


  async def reset_transaction_pin(self, id:str, session:AsyncSession):

    pin_reset_response =  await session.execute(update(Users).where(Users.id == id).values(transactionPin = None))

    await session.commit()

    return True if pin_reset_response is not None else False

  async def edit_user_profile(self, session:AsyncSession, editProfileSchema:EditProfileSchema,id:str):

    profile_data = editProfileSchema.model_dump(exclude_unset=True)

    updated_profile = await session.execute(update(Users).where(Users.id == id).values(**profile_data))

    await session.commit()

    return True if updated_profile is not None else False



  async def upload_kyc(self, session:AsyncSession, uploadSchema:KycUploadSchema, userId:str):
    payload = uploadSchema.model_dump(exclude_unset=True)
    payload["userId"] = userId

    kyc_data = Kyc(
      **payload
    )

    session.add(kyc_data)
    # await session.commit()

    return kyc_data



  async def update_kyc(self, session:AsyncSession, uploadSchema:KycUploadSchema, userId:str):

    update_data = uploadSchema.model_dump(exclude_unset=True)

    update_data["date"] = datetime.now()
    update_data["reason"] = None


    updated_kyc_data = await session.execute(update(Kyc).where(Kyc.userId == userId).values(**update_data))

    # await session.commit()
    
    return True if updated_kyc_data is not None else False


    
  async def update_kyc_status(self, session:AsyncSession, id:str, kycstatus:KycStatus):
    user_kyc_result = await session.execute(select(Kyc).where(Kyc.userId == id).with_for_update())

    user_kyc = user_kyc_result.scalars().first()

    if(user_kyc is not None):
      user_kyc.status = kycstatus
    

    return True if (user_kyc is not None) else False

  async def check_kyc_link(self, nin_number:str,session:AsyncSession, userId:str):   # checking if kyc info is already linked to an account
    isLinked = await session.execute(select(Kyc).where(Kyc.nin_number == nin_number))

    result = isLinked.scalars().first()

    if(result is not None and str(result.userId) != str(userId)):
      return True # is Linked

    return False
          



  async def resolve_account_number(self, accountNumber:str,session:AsyncSession,currentUserId:str):
    response =  await session.execute(select(Users).where(and_(
      Users.accountNumber == accountNumber,
      Users.role == Roles.USER
    )))

    user_info = response.scalars().first()

    if(not user_info):
      raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail={
            "status": "error",
            "msg": "Account Not Found",
            "description": "No account matching this account number."
        }
    )

    if(user_info.id == currentUserId):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
          "status": "error",
          "msg": "Invalid Request",
          "description": "You cannot resolve your own account number"
        })   

    return user_info 

  async def update_daily_spent(self, amount:int, userId:str, session:AsyncSession):
    result =  await session.execute(update(Users).where(and_(
      Users.id == userId,
      Users.role == Roles.USER
    )).values(dailySpent = Users.dailySpent + amount))

    # await session.commit()

    return True if result is not None else False


  async def reset_daily_spent(self, user:UserProfileResponse, session:AsyncSession):
    now = datetime.now(timezone.utc)

    if(now.date() > user.lastSpentDate.date()):
      await session.execute(update(Users).where(and_(
        Users.id == user.id,
        Users.role == Roles.USER
      )).values(
        lastSpentDate=now,
        dailySpent=0
      ))
      await session.commit()


  async def updateBalance(self, session:AsyncSession, operator:Operators, amount:Decimal,  userId:Optional[str] = None, email:Optional[str] = None):

    result = await session.execute(select(Users).where(and_(
      or_(
          Users.id == userId,
          Users.email == email,
        ),
      Users.role == Roles.USER
    )
    ).with_for_update()) # row locking....

    user = result.scalars().first()

    if(not user):
      raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={
        "status": "error",
        "msg": "User not Found"
      })
    

    if(operator == Operators.INCREMENT):
      user.balance += amount

    elif(operator == Operators.DECREMENT):
        user.balance -= amount

    else:
      raise ValueError("Invalid Operation type")

    
    # await session.commit()
    return True if result is not None else False 


  async def saveTransaction(self, session:AsyncSession, transactionData:TransactionCreateSchema):
    transaction_data = Transactions(
      **transactionData.model_dump(exclude_unset=True)
    )

    session.add(transaction_data)
    await session.commit()
    await session.refresh(transaction_data)


    return transaction_data if transaction_data is not None else False

  async def record_transaction(self, session:AsyncSession, amount:int, status:TransactionStatus, senderId:str, narration:str, recipientId:str,reference:str, type:TransactionType = TransactionType.TRANSFER, withdrawal_info:dict = None):

    transfer_data = TransactionCreateSchema(
      amount=amount,
      status=status,
      senderId=senderId,
      reference=reference,
      narration=narration,
      recipientId= recipientId,
      type=type,
      withdrawal_info=withdrawal_info
    )

    return await self.saveTransaction(session, transfer_data)

  async def updateTransactionStatus(self, session:AsyncSession, status:TransactionStatus, reference:str):
    new_status = None

    result = await session.execute(select(Transactions).where(Transactions.reference == reference).with_for_update())

    transaction = result.scalars().first()

    if(transaction is not None):
      new_status = transaction.status = status

    return True if new_status is not None else False


  async def getTransactions(self,
    session:AsyncSession, 
    id:str, 
    skip:int = Query(0, ge=0, description="Transactions to skip"), 
    limit: int = Query(10, ge=4, le=100, description="Number of transactions to retrieve per page"), type:Optional[TransactionType] = Query(None, description="Filter transactions by type" ), status:Optional[TransactionStatus] = Query(None, description="Filter transactions by status")
):
   
    filter_condition = [
      or_(
        Transactions.senderId == id,
        Transactions.recipientId == id,
      )
    ]

    if(type and type != "all"):
        filter_condition.append(Transactions.type == type)
    
    if(status and status != "all"):
        filter_condition.append(Transactions.status == status)


    count_result  = await session.execute(select(func.count()).select_from(Transactions).where(and_(
      *filter_condition,
    ))) # total

    total = count_result.scalar() or 0

    data = await session.execute(select(Transactions).where(and_(
      *filter_condition
    )
    ).order_by(desc(Transactions.date)).offset(skip).limit(limit))

    transaction_data = data.scalars().all() 

    has_more = skip + len(transaction_data) < total

    paginated_transactions = TransactionResponsePaginated(
      transactions= [TransactionResponseModel.model_validate(t) for t in transaction_data],
      total=total,
      skip=skip,
      limit=limit,
      has_more=has_more
    )

    return paginated_transactions if paginated_transactions is not None else []

  async def getTransactionMonthlyChartData(self, session:AsyncSession, userId:str):
    now =  datetime.now()

    filter_conditions= or_(
      Transactions.senderId == userId,
      Transactions.recipientId == userId,
    )

    query =  and_(
      filter_conditions,
      extract("month", Transactions.date) == now.month,
      extract("year", Transactions.date) == now.year,
      Transactions.status == TransactionStatus.SUCCESSFUL
    )

    week_of_month = (func.floor((extract("day", Transactions.date) - 1) / 7 ) + 1).label("week_number")
    
    bar_chart = await session.execute(select(
      week_of_month,
      
      func.sum(case((Transactions.type == TransactionType.DEPOSIT, Transactions.amount), else_=0)).label("deposit"), 
        # MEANS: IF (Transactions.type == TransactionType.DEPOSIT) RETURN AMOUNT ELSE 0, ADD ALL AMOUNT TOGETHER
        func.sum(case((Transactions.type == TransactionType.TRANSFER, Transactions.amount), else_=0)).label("transfer"),
        func.sum(case((Transactions.type == TransactionType.WITHDRAW, Transactions.amount), else_=0)).label("withdraw"),

    ).group_by(week_of_month)
    .where(query)
    )

    bar_chart_transactions = bar_chart.mappings().all()

    weekly_data = []
    labels = ["Deposit", "Transfer", "Withdrawal"]
    month_names = [calendar.month_name[month] for month in range(1, 13)]

    for transaction in bar_chart_transactions:
      weekly_data.append({ 
        "deposit": int(transaction.deposit or 0),
        "transfer": int(transaction.transfer or 0),
        "withdraw": int(transaction.withdraw or 0),
        "week":f"Week {transaction.week_number}",
      })

    
    
    doughnut = await session.execute(select(
      func.sum(case((Transactions.type == TransactionType.DEPOSIT, Transactions.amount),else_ = 0)).label("deposit"),

      func.sum(case((Transactions.type == TransactionType.WITHDRAW, Transactions.amount),else_ = 0)).label("withdraw"),

      func.sum(case((Transactions.type == TransactionType.TRANSFER, Transactions.amount),else_ = 0)).label("transfer"),

      func.sum(
        case(
        (
          and_(
            Transactions.type == TransactionType.TRANSFER, 
            Transactions.senderId == userId
            ), Transactions.amount
          ),  
          else_=0
        )
      ).label("totalTransferOut"),

      func.sum(
        case(
        (
          and_(
            Transactions.type == TransactionType.TRANSFER, 
            Transactions.recipientId == userId
            ), Transactions.amount
          ),  
          else_=0
        )
      ).label("totalTransferIn"),

    ).where(query))



    doughnut_transactions = doughnut.mappings().one_or_none()
    total = int((doughnut_transactions.deposit or 0) + (doughnut_transactions.transfer or 0) + (doughnut_transactions.withdraw or 0))


    return {
      "weekly_data": weekly_data,
      "current_month_data": {
        "deposit": doughnut_transactions.deposit,
        "transfer": doughnut_transactions.transfer,
        "withdraw": doughnut_transactions.withdraw,
        "total": total
      },
      "labels": labels,
      "currentMonth": month_names[int(now.month)],
      "totalIn": int((doughnut_transactions.deposit or 0) + (doughnut_transactions.totalTransferIn or 0)),
      "totalOut": int((doughnut_transactions.withdraw or 0)+ (doughnut_transactions.totalTransferOut or 0))
    }


  async def get_single_transaction(self, session:AsyncSession, userId:str, reference:Optional[str] =None, transactionId:Optional[str]= None):

    filter_condition = or_(
        Transactions.senderId == userId,
        Transactions.recipientId == userId,
    )

    get_filter_condition = or_(
      Transactions.id == transactionId,
      Transactions.reference == reference,
    )

    transaction_response =  await session.execute(select(Transactions).where(and_(
       filter_condition, get_filter_condition
    )))

    transaction_data = transaction_response.scalars().first() if transaction_response is not None else False

    return transaction_data

  async def initialize_deposit(self, body:list):
    paystack_resp =  requests.post(f"{config.PAYSTACK_BASE_URL}/transaction/initialize", headers=headers, json=body)
    
    return paystack_resp.json()

  async def verify_transaction(self, reference:str):
    paystack_transaction_status = requests.get(f"{config.PAYSTACK_BASE_URL}/transaction/verify/{reference}",headers=headers).json()

    return paystack_transaction_status if paystack_transaction_status["status"] is not False else False


  async def resolve_bank_details(self, body:ResolveBankAccountSchema):
    try:

      user_bank_info = requests.get(f"{config.PAYSTACK_BASE_URL}/bank/resolve?account_number={body.account_number}&bank_code={body.bank_code}", headers=headers).json()
     
      return user_bank_info if user_bank_info["status"] == True else False
    
    except Exception as e:
      raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status" : "error",
            "msg" : "Failed to resolve bank details",
            "description": f"An error occured while resolve bank details. Please try again."
        })
  

  async def send_telegram_notification(self, msg:str): #using bot

    try:
      telegram_msg_resp =  requests.post(f"https://api.telegram.org/bot8654990948:{config.TELEGRAM_KEY}/sendMessage?chat_id={config.TELEGRAM_CHAT_ID}&text={msg}").json()

      return telegram_msg_resp
    
    except:
      raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
        "status": "error",
        "msg": "Failed to send notification to admin",
        "description": "An error occured while sending notification to admin. Please try again."
      })


  async def getExportTransaction(self, session:AsyncSession, userId:str):
    result = await session.execute(select(Transactions).where(
      or_(
        Transactions.senderId == userId,
        Transactions.recipientId== userId,
      )
    ))

    transactions =  result.scalars().all()

    return [TransactionResponseModel.model_validate(transaction) for transaction in transactions] if transactions is not None else []


  async def update_setting_preferences(self, userId:str, key:Prefrences, value:bool, session:AsyncSession):
    try:
      result = await session.execute(select(Users).where(Users.id == userId).with_for_update())
    
      user =  result.scalars().one_or_none()

      if(user is not None):
        setattr(user, key.value, value)
        return user
      
    except:
       return False