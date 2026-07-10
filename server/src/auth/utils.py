from argon2 import PasswordHasher
from argon2.exceptions import Argon2Error
import math
import random
from itsdangerous import URLSafeTimedSerializer
from src.config import config
import jwt
import uuid
import random
from fastapi.responses import Response
from src.utils.messages import resetPasswordMessage, verificationMessage, email_otp_messsage
from .workers import send_mail

ph =  PasswordHasher()
serializer= URLSafeTimedSerializer(secret_key=config.JWT_SECRET_TOKEN)

def hashPassword(password:str):
   try:
      return ph.hash(password=password)
   except Argon2Error as e:
      return str(e) 


def verifyHash(password:str, hash:str):
    try:
      return ph.verify(hash=hash, password=password)
    except Argon2Error as e:
      return False



def generateAccountNumber():
    accountNumber = "" 
    
    for i in range(10):
       accountNumber += str(math.floor(random.randint(0, 9)))
    
    return accountNumber

def createIdToken(data, salt:str):
   return serializer.dumps(data, salt=salt)


def verifyIdToken(token:str, salt: str, max:int):
   try:
      return serializer.loads(token, max_age=max, salt=salt)
   except Exception as e:
      return False
   

def loadUnsafeIdToken(token:str): # to see who's requesting
   return serializer.loads_unsafe(token)[1]


def generateJWTToken(type:str, data:dict):
   payload = {}

   payload["type"] = type
   payload["user"] = data
   payload["id"] = str(uuid.uuid4())


   token = jwt.encode(
      key=config.JWT_SECRET_TOKEN,
      algorithm=config.JWT_ALGORITHMS,
      payload=payload,
   )

   return token


def decodeJWTToken(token:str):
  try:
      data = jwt.decode(
         jwt=token,
         key=config.JWT_SECRET_TOKEN,
         algorithms=[config.JWT_ALGORITHMS])
      
      return data
  
  except Exception as e:
     return str(e)
  

def generateOTP():
   otp = ""

   for i in range(6):
      otp += str(random.randint(0, 9))

   return otp



def saveCookies(response:Response, key:str, val:str, exp:int):
   response.set_cookie(
      key=key,
      value=val,
      httponly=True, 
      samesite="lax", #Todo: set to none before deployment
      path="/",
      secure=False,  #Todo: set True before deployment
      max_age=exp,
   )

def send_verification_link(email:str, name:str):
      token = createIdToken(email, salt="verify-salt")
      message = verificationMessage(f"{config.BASE_URL}/auth/verify/{token}", name=name)

      send_mail(email, "Welcome to VectorPay", msg=message)
      return token
            

def send_otp_code(email:str, data:dict, code:str, name:str) -> str:
   token = createIdToken(data, salt=f"otp-verify-{code}")
   
   msg = email_otp_messsage(code, name)
   send_mail(email, "Verify your identity", msg)

   return token


def send_reset_password_link(userData:dict, user:dict):
      token =  createIdToken(userData.email,  salt=f"reset-salt-{user.password_reset_count}")
      link = f"{config.BASE_URL}/auth/reset-password?token={token}"

      message = resetPasswordMessage(resetLink=link)

      send_mail(to_mail=userData.email, subject="Password Reset Link", msg=message)

      return token
   
