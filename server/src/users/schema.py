from pydantic import BaseModel, Field
from typing import Optional
import uuid
from datetime import date, datetime
from src.db.enums import KycStatus, DailyLimit



class TransactionPinSchema(BaseModel):
    pin:str = Field(min_length=4, max_length=4, pattern=r"^\d{4}$",examples=["1234"])
    # currentPin: Optional[str] = Field(min_length=4, max_length=4, pattern=r"^\d{4}$",examples=["1234"])

class UpdateTransactionPinSchema(BaseModel):
    pin:str = Field(min_length=4, max_length=4, pattern=r"^\d{4}$",examples=["1234"])
    currentPin: Optional[str] = Field(min_length=4, max_length=4, pattern=r"^\d{4}$",examples=["1234"])

class EditProfileSchema(BaseModel):
    firstName:str = Field(min_length=2, max_length=50, examples=["John"])
    lastName:str = Field(min_length=2, max_length=50, examples=["Doe"])
    photoURL: Optional[str] = Field(min_length=2, examples=["https://example.com/photo.jpg"])


class KycSchema(BaseModel):
    id: uuid.UUID
    full_name: str = Field(min_length=3)
    nin_number:str = Field(min_length=11, max_length=11)
    dob: date
    nin_slip: str

class KycUploadSchema(BaseModel):
    full_name: str = Field(min_length=3)
    nin_number:str = Field(min_length=11, max_length=11)
    dob: date
    nin_slip: str = Field(min_length=2, examples=["https://example.com/photo.jpg"])



class UserSchema(BaseModel):
    id:uuid.UUID

    firstName: str =  Field(min_length=3)
    lastName: str =  Field(min_length=3)
    email:str
    userName: str 
    # password: str = Field(min_length=8, max_length=12, exclude=True)
    balance: Optional[int] = Field(default=0)
    accountNumber: str = Field(default=None)
    isVerified: bool = Field(default=False)
    password_reset_count:int 
    transactionPin: Optional[str]
    tier: int = Field(default=1, ge=1, le=3)
    photoURL: Optional[str] 
    kycStatus: KycStatus
    kyc: Optional[KycSchema]
    dailyLimit: DailyLimit = Field(default=DailyLimit.TIER_ONE)
    dailySpent: int = Field(default=0)
    lastSpentDate:datetime
    # transactions: List[TransactionResponseModel]

    createdAt: datetime 
    updatedAt: datetime 


class ResolveAccountResponseModel(BaseModel):
    status: str
    data: list
    