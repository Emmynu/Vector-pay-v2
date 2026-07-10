from fastapi import APIRouter, status, Depends, HTTPException
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.auth.services import AuthServices
from src.auth.dependencies import AccessTokenBearer
from src.db.main import session
from .schema import TransactionPinSchema, UpdateTransactionPinSchema
from .services import UserService
from src.auth.utils import verifyHash

router = APIRouter()
authService = AuthServices()
accessTokenBearer = AccessTokenBearer()
userService =  UserService()


@router.get("/profile",  status_code=status.HTTP_200_OK)
async def profile(user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
    current_user = await authService.get_user(email=user["user"]["email"], session=session)
    return current_user

@router.post("/edit-profile")
async def edit_user_profile():
    pass


@router.post("/pin/setup")
async def transaction_pin_setup(userData:TransactionPinSchema, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
  
    userInfo = await authService.get_user(session=session, email=user["user"]["email"])

    if(userInfo.transactionPin is not None):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Oops!...something went wrong",
            "description": f"Transaction PIN already configured."
        })

    try:
        await userService.update_transaction_pin(user["user"]["email"], userData, session)
        return {"status": "success", "msg": "Transaction PIN added"}
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Oops!...something went wrong",
            "description": f"An error occured updating your transaction pin."
        })
    

@router.post("/pin/update")
async def update_transaction_pin(userData:UpdateTransactionPinSchema, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
   userInfo = await authService.get_user(session=session, email=user["user"]["email"])

   if(userInfo.transactionPin is None):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Oops!...something went wrong",
            "description": f"No transaction PIN found for this account. Please use the setup endpoint first."
        })
   
   transactionPin = verifyHash(userData.currentPin, userInfo.transactionPin)

   if(not transactionPin):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Incorrect Transaction PIN",
            "description": f"Please provide a valid transaction pin."
        })
   
   else:
        try:
            await userService.update_transaction_pin(user["user"]["email"], userData, session)
            return {"status": "success", "msg": "Transaction PIN updated successfully."}
        except:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Oops!...something went wrong",
                "description": f"An error occured updating your transaction pin."
            })

     
     
     
       
   

