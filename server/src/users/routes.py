from fastapi import APIRouter, status, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.auth.services import AuthServices
from src.auth.dependencies import AccessTokenBearer
from src.db.main import session
from .schema import EditProfileSchema, UpdateTransactionPinSchema, TransactionPinSchema, UserSchema, KycUploadSchema
from .services import UserService
from src.auth.utils import verifyHash
from src.db.enums import KycStatus
from src.limiter import limiter


router = APIRouter()
authService = AuthServices()
accessTokenBearer = AccessTokenBearer()
userService =  UserService()


@router.get("/profile",  status_code=status.HTTP_200_OK, response_model=UserSchema)
@limiter.limit("15/minute")
async def profile(request:Request, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
    current_user = await authService.get_user(email=user["user"]["email"], session=session)
    return current_user


@router.post("/edit-profile")
@limiter.limit("3/minute")
async def edit_user_profile(userData:EditProfileSchema, request:Request, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
    try:
        await userService.edit_user_profile(session=session, userData=userData, email=user["user"]["email"])

        return {"status": "success", "msg": "User Profile update successful."}
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Oops!...something went wrong",
            "description": f"An error occured updating your profile."
        })

    


@router.post("/pin/setup")
@limiter.limit("3/minute")
async def transaction_pin_setup(userData:TransactionPinSchema, request:Request, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
  
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
@limiter.limit("3/minute")
async def update_transaction_pin(userData:UpdateTransactionPinSchema, request:Request, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
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

        
@router.post("/kyc/upload")
@limiter.limit("3/minute")
async def kyc_upload(uploadSchema:KycUploadSchema, request:Request, userData=Depends(accessTokenBearer), session:AsyncSession=Depends(session)):

    user = await authService.get_user(session, userData["user"]["email"])
    isLinked = await userService.check_kyc_link(uploadSchema.nin_number, session)

    if(not user.isVerified):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Upload Failed",
            "description": f"Please verify your account"
        })


    if(isLinked):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Verification Failed",
            "description": f"This information has already been added to an account."
    })

    
    if((user.kycStatus == KycStatus.UNVERIFIED and not user.kyc)):
        try:
            uploadStatus = await userService.upload_kyc(session, uploadSchema, user.id)
                
            if (not uploadStatus):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                    "status": "error",
                    "msg": "Upload Failed",
                    "description": f"We could not store your information. Please try again later"
            })
            
            kyc_status = await userService.update_kyc_status(session, user.email, status=KycStatus.PENDING)
        
            if (not kyc_status):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                    "status": "error",
                    "msg": "Updating Status Failed",
                    "description": f"We could not update kyc status"
                })

            return {"status": "success", "msg": "Upload Successful", "description": "Your KYC process is currently under review. Please await verification."}
        
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                        "status": "error",
                        "msg": "Oops!...Something went wrong!",
                        "description": f"{str(e)}"
                    })


    elif((user.kycStatus == KycStatus.UNVERIFIED and user.kyc)):

        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Upload Failed",
                "description": f"KYC documents has already been uploaded"
        })
       
    elif(user.kycStatus == KycStatus.VERIFIED):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Verification Complete",
                "description": f"Your account is already verified. KYC documents cannot be re-submitted"
        })
    
    elif(user.kycStatus == KycStatus.PENDING):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Submission Under Review",
            "description": f"Your KYC process is currently under review. Please await verification."
    })

    elif(user.kycStatus == KycStatus.DECLINED):
        # update kyc

        updated_kyc = await userService.update_kyc(session, uploadSchema, user.id)

        if (not updated_kyc):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Upload Failed",
                "description": f"We could not store your information. Please try again later"
            })

        updated_status =  await userService.update_kyc_status(session, user.email, KycStatus.PENDING)

        if (not updated_status):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Updating Status Failed",
                "description": f"We could not update kyc status"
            })

        return {"status": "success", "msg": "Upload Successful", "description": "Your KYC process is currently under review. Please await verification."}



     
     
       
   

