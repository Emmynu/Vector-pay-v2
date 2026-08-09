from sqlmodel import select, update, or_, desc, func, and_
from fastapi import Query
from src.db.models import Users, Transactions
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.enums import Operators
from decimal import Decimal
from .schema import TransactionCreateSchema, TransactionResponsePaginated, TransactionResponseModel, Reset_daily_spent_schema
from datetime import datetime, timezone



class AccountService():  
  async def resolve_account_number(self, accountNumber:str,session:AsyncSession):
    response =  await session.execute(select(Users).where(Users.accountNumber == accountNumber))

    user_info = response.scalars().first()

    return user_info if user_info is not None else False


  async def update_daily_spent(self, amount:int, userId:str, session:AsyncSession):
    result =  await session.execute(update(Users).where(Users.id == userId).values(dailySpent = Users.dailySpent + amount))

    await session.commit()

    return True if result is not None else False


  async def reset_daily_spent(self, user:Users, session:AsyncSession):
    now = datetime.now(timezone.utc)

    reset_daily_schema = Reset_daily_spent_schema(
      lastSpentDate=now,
      dailySpent=0
    )

    if(now.date() > user.lastSpentDate.date()):
      await session.execute(update(Users).where(Users.id == user.id).values(reset_daily_schema))
      await session.commit()




    
  async def updateBalance(self, session:AsyncSession, userId:str, operator:Operators, amount:Decimal):

    if(operator == Operators.INCREMENT):
      new_balance = Users.balance + amount

    elif(operator == Operators.DECREMENT):
      new_balance = Users.balance - amount

    else:
      raise ValueError("Invalid Operation type")

    print("BALANCE", new_balance)

    result = await session.execute(update(Users).where(Users.id == userId).values(balance = new_balance))

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


  async def get_single_transaction(self, session:AsyncSession, transactionId:str, userId:str):

    filter_condition = or_(
        Transactions.senderId == userId,
        Transactions.recipientId == userId
    )

    transaction_response =  await session.execute(select(Transactions).where(and_(
      Transactions.id == transactionId, filter_condition
    )))

    transaction_data = transaction_response.scalars().first() if transaction_response is not None else False

    return transaction_data

 