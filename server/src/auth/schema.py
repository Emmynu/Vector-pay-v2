from pydantic import BaseModel, Field
import uuid
from typing import Optional
from datetime import datetime



class UserSchema(BaseModel):
    id:uuid.UUID

    firstName: str =  Field(min_length=3)
    lastName: str =  Field(min_length=3)
    email:str
    userName: str 
    password: str = Field(min_length=8, max_length=12, exclude=True)
    balance: Optional[int] = Field(default=0)
    accountNumber: str = Field(default=None)
    isVerified: bool = Field(default=False)
    password_reset_count:int 

    createdAt: datetime 
    updatedAt: datetime 


class CreateUserSchema(BaseModel):
    firstName: str =  Field(min_length=3)
    lastName: str =  Field(min_length=3)
    email:str
    userName: str 
    password: str = Field(min_length=8, max_length=12, exclude=True)


class GetUserSchema(BaseModel):
    email:str
    password:str 

class ForgotPasswordSchema(BaseModel):
    email:str


class ResetPasswordSchema(BaseModel):
    password:str
    token:str

class OtpVerifySchema(BaseModel):
    code: str = Field(min_length=6)
