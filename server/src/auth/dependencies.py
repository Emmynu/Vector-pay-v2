from fastapi.security import HTTPBearer
from fastapi.requests import Request
from fastapi import HTTPException, status
from .utils import verifyIdToken

class OtpBearer(HTTPBearer):
    def __init__(self,  auto_error = True):
        super().__init__(auto_error=auto_error)
    
    async def __call__(self, request: Request):
        token =  await super().__call__(request)

        if (token):
            user = verifyIdToken(token.credentials, salt="otp-verify", max=300)

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
