from .schema import TransactionPinSchema
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.models import Users
from sqlmodel import update
from src.auth.utils import hashPassword

class UserService():
   async def update_transaction_pin(self, email:str, userData:TransactionPinSchema, session:AsyncSession):
     hashedPin =  hashPassword(userData.pin)
     user =  await session.execute(update(Users).where(Users.email == email).values(transactionPin = hashedPin))

     await session.commit()

     return True if user is not None else False
