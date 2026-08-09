from datetime import datetime,timezone
import uuid
from pydantic import BaseModel, Field
from typing import Optional
from src.db.enums import TransactionStatus, TransactionType
from typing import List



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
    status: TransactionStatus 
    type: TransactionType = Field(default=TransactionType.TRANSFER)
    amount: int
    narration:Optional[str] = Field(min_length=3)
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
