from datetime import datetime,timezone, date
import uuid
from pydantic import BaseModel, Field
from typing import Optional
from src.db.enums import TransactionStatus, TransactionType, KycStatus, DailyLimit
from typing import Optional, List


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



class UserProfileResponse(BaseModel):
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
    


class AccountNumberSchema(BaseModel):
    accountNumber:str = Field(max_length=10, min_length=10)


class ResolveAccountResponseData(BaseModel):
    userId:str
    firstName:str
    lastName:str
    email:str
    accountNumber:str
    photoURL:Optional[str]

    class Config:
        from_attributes = True



class ResolveAccountResponse(BaseModel):
    status:str
    data:ResolveAccountResponseData


class TransferSchema(BaseModel):
    recipient_account_number:str = Field(min_length=10, max_length=10, description="Account Number must be 10 digits")
    amount:int = Field(ge=10, le=50000, description="Amount must be greater than 10")
    narration:Optional[str] = Field(min_length=3)
    pin:str = Field(min_length=4, max_length=4, examples=["1234"], pattern=r"^\d{4}$")



class TransactionCreateSchema(BaseModel):
    # id: Optional[uuid.UUID]
    status: TransactionStatus = Field(default=TransactionStatus.PENDING)
    type: TransactionType = Field(default=TransactionType.TRANSFER)
    amount: int
    narration:Optional[str] = Field(min_length=3)
    reference: str
    senderId:Optional[uuid.UUID]
    recipientId:Optional[uuid.UUID]


class UserSchema(BaseModel):
    id:uuid.UUID
    firstName: str =  Field(min_length=3)
    lastName: str =  Field(min_length=3)
    email:str
    userName: str 
    accountNumber: str = Field(default=None)
    isVerified: bool = Field(default=False)
    tier: int = Field(default=1, ge=1, le=3)
    photoURL: Optional[str] 
    
    class Config:
        from_attributes = True


class TransactionResponseModel(BaseModel):
    id:uuid.UUID
    status: TransactionStatus 
    amount: int
    narration:Optional[str] 
    type: TransactionType = Field(default=TransactionType.TRANSFER)
    date: datetime 
    senderId:Optional[uuid.UUID] 
    sender: Optional[UserSchema]
    recipientId:Optional[uuid.UUID] 
    recipient:Optional[UserSchema] 

    class Config:
        from_attributes = True

class TransactionResponsePaginated(BaseModel):
    transactions: List[TransactionResponseModel]
    total:int
    skip: int
    limit: int
    has_more: bool

    
class Reset_daily_spent_schema(BaseModel):
    dailySpent:int
    lastSpentDate:datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class DepositSchema(BaseModel):
    amount:int = Field(ge=10, description="Amount must be greater than 10")

