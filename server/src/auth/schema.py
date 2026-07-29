from pydantic import BaseModel, Field


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


class ResendVerificationSchema(BaseModel):
    name:str
    email:str