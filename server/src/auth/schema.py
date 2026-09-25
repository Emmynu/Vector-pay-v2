from pydantic import BaseModel, Field
from src.db.enums import Roles


class CreateUserSchema(BaseModel):
    firstName: str =  Field(min_length=3)
    lastName: str =  Field(min_length=3)
    email:str
    role: Roles 
    password: str = Field(min_length=8, max_length=12, exclude=True)


class LoginSchema(BaseModel):
    email:str
    password:str 
    role:Roles

class ForgotPasswordSchema(BaseModel):
    email:str
    role:Roles


class ResetPasswordSchema(BaseModel):
    password:str
    token:str
    role:Roles

class OtpVerifySchema(BaseModel):
    code: str = Field(min_length=6, max_length=6)


class ResendVerificationSchema(BaseModel):
    email:str