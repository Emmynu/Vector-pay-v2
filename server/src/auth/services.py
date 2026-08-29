from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.models import Users
from .schema import CreateUserSchema
from .utils import hashPassword
from sqlmodel import select, update
from .utils import generateAccountNumber
from src.db.enums import DailyLimit
from fastapi import Request, HTTPException, status
import requests

class AuthServices():


    async def userExists(self, session: AsyncSession, email:str):
       user =  await session.execute(select(Users).where(Users.email == email))
    
       return True if user.first() is not None else False

    def get_ip(self, request:Request):
        ip = request.headers.get("X-Forwarded-For")

        if(ip):
            return ip.split(",")[0].strip()
        else:
            return request.client.host


    async def resolve_ip_address(self, ip:str):
        location = None

        if(not ip): return 

        if(ip in ["127.0.0.1", "localhost", "::1"]):
            location = "Lagos, Nigeria"

        else:
            try:
                resolved_ip =  requests.get(f"http://ip-api.com/json/{ip}").json()
    
                location = f"{resolved_ip["city"], resolved_ip["country"]}"

            except Exception as e:
                return False



        return location

    async def create_user(self,session: AsyncSession, userData:CreateUserSchema, request:Request):
        hashedPassword =  hashPassword(userData.password)
        ip = self.get_ip(request=request)
        location = await self.resolve_ip_address(ip)

     
        if(not location):
            return False


        newUser  =  Users(
            firstName=userData.firstName,
            lastName=userData.lastName,
            email=userData.email,
            password= hashedPassword,
            userName=userData.userName,
            accountNumber=generateAccountNumber(),
            ip=ip,
            location = location
        )
        session.add(newUser)
        return newUser
    

    async def get_user(self, session:AsyncSession, email:str):
        user =  await session.execute(select(Users).where(Users.email == email))

        result = user.scalars().first()
        
        return result if result is not None else False
    
    
    async def verify_user_account(self, email:str, session:AsyncSession):
        user = await session.execute(update(Users).where(Users.email == email).values(isVerified = True, tier = 2, dailyLimit = DailyLimit.TIER_TWO)
        )
        await session.commit()
       
        return True if user is not None else False


    async def update_password(self, email:str, password:str, session:AsyncSession):
        hashedPassword = hashPassword(password=password)

        user = await session.execute(update(Users).where(Users.email == email).values(password = hashedPassword, password_reset_count = Users.password_reset_count + 1)
        )

        await session.commit()
       
        return True if user is not None else False



