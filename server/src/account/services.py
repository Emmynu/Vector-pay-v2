from sqlmodel import select, update, or_, desc, func, and_
from fastapi import Query
from src.db.models import Users, Transactions, Kyc
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.enums import Operators, KycStatus, TransactionType, TransactionStatus
from decimal import Decimal
from .schema import TransactionCreateSchema, TransactionResponsePaginated, TransactionResponseModel, TransactionPinSchema, EditProfileSchema, KycUploadSchema, UserProfileResponse
from datetime import datetime, timezone
from src.auth.utils import hashPassword, createIdToken
from src.config import config
import requests
from typing import Optional



class AccountService():  

  async def update_transaction_pin(self, email:str, userData:TransactionPinSchema, session:AsyncSession):
    hashedPin =  hashPassword(userData.pin)
    user =  await session.execute(update(Users).where(Users.email == email).values(transactionPin = hashedPin))

    await session.commit()

    return True if user is not None else False


  async def reset_transaction_pin(self, id:str, session:AsyncSession):

    pin_reset_response =  await session.execute(update(Users).where(Users.id == id).values(transactionPin = None))

    await session.commit()

    return True if pin_reset_response is not None else False

  async def edit_user_profile(self, session:AsyncSession, userData:EditProfileSchema,email:str):

    profile_data = userData.model_dump(exclude_unset=True)

    updated_profile = await session.execute(update(Users).where(Users.email == email).values(**profile_data))

    await session.commit()

    return True if updated_profile is not None else False



  async def upload_kyc(self, session:AsyncSession, uploadSchema:KycUploadSchema, userId:str):
    payload = uploadSchema.model_dump(exclude_unset=True)
    payload["userId"] = userId

    kyc_data = Kyc(
      **payload
    )

    session.add(kyc_data)
    await session.commit()
    await session.refresh(kyc_data)

    return kyc_data



  async def update_kyc(self, session:AsyncSession, uploadSchema:KycUploadSchema, userId:str):

    update_data = uploadSchema.model_dump(exclude_unset=True)


    updated_kyc_data = await session.execute(update(Kyc).where(Kyc.userId == userId).values(**update_data))

    await session.commit()
    
    return True if updated_kyc_data is not None else False


    
  async def update_kyc_status(self, session:AsyncSession, email:str, status:KycStatus):
    status = await session.execute(update(Users).where(Users.email == email).values(kycStatus = status))

    await session.commit()

    return True if status is not None else False

  async def check_kyc_link(self, nin_number:str,session:AsyncSession):   # checking if kyc info is already linked to an account
    isLinked = await session.execute(select(Kyc).where(Kyc.nin_number == nin_number))

    result = isLinked.scalars().first()
          
    return True if result is not None  else False



  async def resolve_account_number(self, accountNumber:str,session:AsyncSession):
    response =  await session.execute(select(Users).where(Users.accountNumber == accountNumber))

    user_info = response.scalars().first()

    return user_info if user_info is not None else False


  async def update_daily_spent(self, amount:int, userId:str, session:AsyncSession):
    result =  await session.execute(update(Users).where(Users.id == userId).values(dailySpent = Users.dailySpent + amount))

    await session.commit()

    return True if result is not None else False


  async def reset_daily_spent(self, user:UserProfileResponse, session:AsyncSession):
    now = datetime.now(timezone.utc)

    if(now.date() > user.lastSpentDate.date()):
      await session.execute(update(Users).where(Users.id == user.id).values(
        lastSpentDate=now,
        dailySpent=0
      ))
      await session.commit()


  async def updateBalance(self, session:AsyncSession, operator:Operators, amount:Decimal,  userId:Optional[str] = None, email:Optional[str] = None):

    if(operator == Operators.INCREMENT):
      new_balance = Users.balance + amount

    elif(operator == Operators.DECREMENT):
      new_balance = Users.balance - amount

    else:
      raise ValueError("Invalid Operation type")

    print("BALANCE", new_balance)

    result = await session.execute(update(Users).where(or_(
      Users.id == userId,
      Users.email == email
    )).values(balance = new_balance))

    await session.commit()
    return True if result is not None else False


  async def saveTransaction(self, session:AsyncSession, transactionData:TransactionCreateSchema):
    transaction_data = Transactions(
      **transactionData.model_dump(exclude_unset=True)
    )

    session.add(transaction_data)
    await session.commit()
    await session.refresh(transaction_data)


    return transaction_data if transaction_data is not None else False

  async def record_transaction(self, session:AsyncSession, amount:int, status:TransactionStatus, senderId:str, narration:str, recipientId:str,reference:str, type:TransactionType = TransactionType.TRANSFER):

    transfer_data = TransactionCreateSchema(
      amount=amount,
      status=status,
      senderId=senderId,
      reference=reference,
      narration=narration,
      recipientId= recipientId,
      type=type
    )

    return await self.saveTransaction(session, transfer_data)

  async def updateTransactionStatus(self, session:AsyncSession, status:TransactionStatus, reference:str):
    new_status = await session.execute(update(Transactions).where(Transactions.reference == reference).values(status=status))

    await session.commit()

    return True if new_status is not None else False


  async def getTransactions(self ,session:AsyncSession, id:str, skip:int = Query(0, ge=0), limit: int = Query(10, ge=5, le=100)):

    filter_condition = or_(
        Transactions.senderId == id,
        Transactions.recipientId == id
    )

    count_result  = await session.execute(select(func.count()).select_from(Transactions).where(filter_condition)) # total

    total = count_result.scalar() or 0

    data = await session.execute(select(Transactions).where(filter_condition).order_by(desc(Transactions.date)).offset(skip).limit(limit))

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
    paystack_resp =  requests.post("https://api.paystack.co/transaction/initialize", headers={
        "Authorization": f'Bearer {config.PAYSTACK_SECRET_KEY}',
        "Content-Type": "application/json"
    }, json=body)
    
    return paystack_resp.json()

  async def verify_transaction(self, reference:str):
    paystack_transaction_status = requests.get(f"https://api.paystack.co/transaction/verify/{reference}",headers={
       "Authorization": f'Bearer {config.PAYSTACK_SECRET_KEY}',
        "Content-Type": "application/json"
    }).json()

    return paystack_transaction_status if paystack_transaction_status["status"] is not False else False