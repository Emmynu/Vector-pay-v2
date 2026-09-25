from fastapi.security import HTTPBearer
from fastapi.encoders import jsonable_encoder
from fastapi.requests import Request
from fastapi import HTTPException, status, Depends
from .utils import verifyIdToken, decodeJWTToken
from sqlalchemy.ext.asyncio.session import AsyncSession
from .services import AuthServices
from src.db.main import session
from src.redis import redis_get_value

authServices = AuthServices()


class OtpBearer(HTTPBearer):
    def __init__(self,  auto_error = True):
        super().__init__(auto_error=auto_error)
    
    async def __call__(self, request: Request, session:AsyncSession = Depends(session)):
        token =  await super().__call__(request)

        if (token):
            code = await redis_get_value(f"otp-code-{token.credentials}")
            
            token_data = verifyIdToken(token.credentials, salt=f"otp-verify-{code}", max=300)

            if (not token_data):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={
                    "status": "error",
                    "msg": "Invalid or expired two-factor auth token",
                    "description": "Please provide a valid two-factor auth token"
            })

            user = await authServices.userExists(session, token_data["email"], role=token_data["role"])

            return {
                "user": jsonable_encoder(user),
                "code": code,
                "token": token.credentials
            }
        else:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail={
                "status": "error",
                "msg": "Invalid two-factor auth token",
                "description": "Please provide a valid two-factor auth token"
            })


class TokenBearer(HTTPBearer):
    def __init__(self, auto_error = True, cookie_name:str = "access"):
        super().__init__(auto_error=auto_error)
        self.cookie_name = cookie_name

    async def __call__(self, request: Request, ):
        token = None

        header = request.headers.get("Authorization")
        

        if(header):
            try:
                credentials = await super().__call__(request)
                if(credentials):
                    token = credentials.credentials    
            except: 
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                    "status" : "error",
                    "title": f"Invalid or expired {self.cookie_name} token",
                    "msg": f"Please provide a valid {self.cookie_name} token"
                })
                
        else:
            token  = request.cookies.get(self.cookie_name)   
        
        if (not token):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status" : "error",
                "title": f"Invalid {self.cookie_name} token",
                "msg": f"Please provide a valid {self.cookie_name} token"
        })

        return token
    

    
    def validateToken(self, token:str):
        user  = decodeJWTToken(token)

        return True if user is not None else False
    

    def verify_token(self, token:str):
        isValid = self.validateToken(token=token)


        if  (isValid):
                user = decodeJWTToken(token)

                if(not user):
                    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                        "status" : "error",
                        "title": f"Expired {self.cookie_name} token",
                        "msg": f"Please provide a valid {self.cookie_name} token"
                })

                return user
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status" : "error",
                "title": f"Invalid or expired {self.cookie_name} token",
                "msg": f"Please provide a valid {self.cookie_name} token"
            })
       

    


class AccessTokenBearer(TokenBearer):

    def __init__(self, auto_error=True, cookie_name = "access"):
        super().__init__(auto_error, cookie_name)
    
    async def __call__(self, request:Request):
        token =  await super().__call__(request)

        user =  self.verify_token(token)
   
        jwtId = user["jti"] 

        isTokenBlackListed = await redis_get_value(jwtId)

        if(isTokenBlackListed):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status" : "error",
                "title": f"Expired {self.cookie_name} token",
                "msg": f"Please provide a valid {self.cookie_name} token"
            })

        if(user["type"] == "refresh"):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status" : "error",
                "title": f"Invalid {self.cookie_name} token",
                "msg": f"Please provide a valid {self.cookie_name} token"
            })
        
        return user
    
       

class RefreshTokenBearer(TokenBearer):
    def __init__(self, auto_error=True, cookie_name = "refresh"):
        super().__init__(auto_error, cookie_name)

    async def __call__(self, request:Request):
        token =  await super().__call__(request)

        user =  self.verify_token(token)

        if(not user):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status" : "error",
                "title": f"Invalid {self.cookie_name} token",
                "msg": f"Please provide a valid {self.cookie_name} token"
            })

        isTokenBlacklisted = await redis_get_value(user["jti"])

        if(isTokenBlacklisted):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status" : "error",
                "title": f"Expired refresh token",
                "msg": f"Please provide a valid refresh token"
            })

        if((user["type"] == "access" )):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status" : "error",
                "title": f"Invalid {self.cookie_name} token",
                "msg": f"Please provide a valid {self.cookie_name} token"
            })
        
        return user



class RoleChecker:
    def __init__(self, role:str):
        self.role = role

    async def __call__(self, session:AsyncSession = Depends(session), token_info =  Depends(AccessTokenBearer())):
        email = token_info["user"]["email"]
        role = token_info["user"]["role"]


        user = await authServices.userExists(session, email, role)

        if(user.role != self.role):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status": "error",
                "title": "Unauthorized",
                "description": "You do not have permission to access this resource."
            })
        return user