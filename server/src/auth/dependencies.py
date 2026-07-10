from fastapi.security import HTTPBearer
from fastapi.requests import Request
from fastapi import HTTPException, status
from .utils import verifyIdToken, loadUnsafeIdToken, decodeJWTToken

class OtpBearer(HTTPBearer):
    def __init__(self,  auto_error = True):
        super().__init__(auto_error=auto_error)
    
    async def __call__(self, request: Request):
        token =  await super().__call__(request)

        if (token):
            code = loadUnsafeIdToken(token.credentials)
            
            user = verifyIdToken(token.credentials, salt=f"otp-verify-{code["code"]}", max=300)

            if (not user):
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status": "error",
                "msg": "Invalid or expired two-factor auth token",
                "description": "Please provide a valid two-factor auth token"
            })

            return user
        else:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
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
            try:
                user = decodeJWTToken(token)
                return user
            except:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                        "status" : "error",
                        "title": f"Invalid {self.cookie_name} token",
                        "msg": f"Please provide a valid {self.cookie_name} token"
                })
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
        if(user["type"] == "access"):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
                "status" : "error",
                "title": f"Invalid {self.cookie_name} token",
                "msg": f"Please provide a valid {self.cookie_name} token"
            })
        return user
