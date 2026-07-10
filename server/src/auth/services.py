from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.models import Users
from .schema import CreateUserSchema
from .utils import hashPassword
from sqlmodel import select, update
from .utils import generateAccountNumber


class AuthServices():

    async def userExists(self, session: AsyncSession, email:str):
       user =  await session.execute(select(Users).where(Users.email == email))

       return True if user.first() is not None else False

    async def create_user(self,session: AsyncSession, userData:CreateUserSchema):
        hashedPassword =  hashPassword(userData.password)

        newUser  =  Users(
                firstName=userData.firstName,
                lastName=userData.lastName,
                email=userData.email,
                password= hashedPassword,
                userName=userData.userName,
                accountNumber=generateAccountNumber()
        )
        session.add(newUser)
        await session.commit()
        await session.refresh(newUser)

        return newUser

    async def get_user(self, session:AsyncSession, email:str):
        user =  await session.execute(select(Users).where(Users.email == email))

        result = user.scalars().first()
        
        return result if result is not None else False
    
    
    async def verify_user_account(self, email:str, session:AsyncSession):
        user = await session.execute(update(Users).where(Users.email == email).values(isVerified = True, tier = 2)
        )
        await session.commit()
       
        return True if user is not None else False


    async def update_password(self, email:str, password:str, session:AsyncSession):
        hashedPassword = hashPassword(password=password)

        user = await session.execute(update(Users).where(Users.email == email).values(password = hashedPassword, password_reset_count = Users.password_reset_count + 1)
        )

        await session.commit()
       
        return True if user is not None else False
    
    # async def upgrade_user_tier(self, email:str, session:AsyncSession, tier:int):
    #   new_tier =  await session.execute(update(Users).where(Users.email == email).values(tier = tier))

    #   await session.commit()

    #   return True if new_tier is not None else False
