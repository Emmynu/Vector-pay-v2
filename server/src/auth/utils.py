from argon2 import PasswordHasher
from argon2.exceptions import Argon2Error
from itsdangerous import URLSafeTimedSerializer
from src.config import config
import jwt
import uuid
import secrets
import string
from fastapi.responses import Response
from fastapi.requests import Request
from fastapi import BackgroundTasks
from src.messages import verification_message, otp_message, reset_password_message,resend_verification_message, pin_reset_message
from .workers import send_mail
from datetime import datetime,timezone, timedelta
from src.redis import redis_set_value
from src.db.enums import Roles


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
       accountNumber += str(secrets.choice(string.digits))
    
    return accountNumber



def generateUsername(firstName:str, lastName:str):
   username = ""

   generateUsernameFrom = firstName + lastName + (string.digits)

   for i in range(5):
      username += str(secrets.choice(generateUsernameFrom))

   return f"{username}@vectorpay.io"

def createIdToken(data, salt:str):
   return serializer.dumps(data, salt=salt)


def verifyIdToken(token:str, salt: str, max:int):
   try:
      return serializer.loads(token, max_age=max, salt=salt)
   except Exception as e:
      return False
   

def loadUnsafeIdToken(token:str): # to see who's requesting
   return serializer.loads_unsafe(token)[1]


def generateJWTToken(type:str, data:dict, exp:int = 1200):
   payload = {}

   expiry = datetime.now(timezone.utc) + timedelta(seconds=exp)

   payload["type"] = type
   payload["user"] = data
   payload["jti"] = str(uuid.uuid4())
   payload["exp"] = expiry

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
     return False
  

def generateOTP():
   otp = ""

   for i in range(6):
      otp += str(secrets.choice(string.digits))

   return otp



def saveCookies(response:Response, key:str, val:str, exp:int):
   response.set_cookie(
      key=key,
      value=val,
      httponly=True, 
      samesite="none", #Todo: set to none before deployment
      path="/",
      secure=True,  #Todo: set True before deployment
      max_age=exp,
   )


async def send_verification_link(data:dict, request:Request, background_tasks:BackgroundTasks):
      token = createIdToken(data["email"], salt="verify-salt")

      link = f"{config.BASE_URL}/auth/verify/{token}"
      name = data["name"]
      email = data["email"]

      if(data["type"] != "resend"):
         message = verification_message(link=link, name=name, request=request)

         background_tasks.add_task(send_mail, email, "Welcome to VectorPay", msg=message)

   
      if(data["type"] == "resend"):
         msg = resend_verification_message(request, name, link)
         background_tasks.add_task(send_mail, email, "Verify Your Account - VectorPay", msg=msg)


      return token


async def send_otp_code(user_info:dict, request:Request, background_tasks:BackgroundTasks) -> str:
   
   token = createIdToken({
      "email": user_info["email"],
      "role": user_info["role"]
   }, salt=f"otp-verify-{user_info["code"]}")


   await redis_set_value(f"otp-code-{token}", user_info["code"], ex=300)

   msg = otp_message(code=user_info["code"], name=user_info["name"], request=request)
   background_tasks.add_task(send_mail, user_info["email"], "Verify your identity - VectorPay", msg)


   return token

async def  send_reset_pin_otp_code(user:dict, background_tasks:BackgroundTasks, request:Request = Request):
   try:
      code = generateOTP()

      await redis_set_value(f"pin-reset-{user.email}", code, 300)

      messge = pin_reset_message(request, f"{user.firstName} {user.lastName}", code)


      background_tasks.add_task(send_mail, user.email, "Transaction Pin Reset Request - VectorPay" , messge)
      
      return True
   except: return False


async def send_reset_password_link(user:dict, request, background_tasks:BackgroundTasks):
      token =  createIdToken(user.email,  salt=f"reset-salt-{user.password_reset_count}")
      url = "/auth/reset-password" if user.role == Roles.USER else "/admin/reset-password"
      link = f"{config.BASE_URL}/{url}/?token={token}"

      message = reset_password_message(resetLink=link, request=request, name=f"{user.firstName} {user.lastName}")

      background_tasks.add_task(send_mail, to_mail=user.email, subject="Password Reset Link - VectorPay", msg=message)
   
      return token
   
