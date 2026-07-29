from .schema import TransactionPinSchema, EditProfileSchema, KycUploadSchema
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.models import Users, Kyc, KycStatus
from sqlmodel import update
from src.auth.utils import hashPassword

class UserService():

  async def update_transaction_pin(self, email:str, userData:TransactionPinSchema, session:AsyncSession):
     hashedPin =  hashPassword(userData.pin)
     user =  await session.execute(update(Users).where(Users.email == email).values(transactionPin = hashedPin))

     await session.commit()

     return True if user is not None else False
  

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