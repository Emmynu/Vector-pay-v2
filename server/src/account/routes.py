from fastapi import APIRouter, HTTPException, status, Depends, Request,Query
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.auth.dependencies import AccessTokenBearer
from src.db.main import session
from .services import AccountService
from src.db.enums import Operators, KycStatus
from .schema import AccountNumberSchema, ResolveAccountResponse, ResolveAccountResponseData, TransferSchema, TransactionCreateSchema, TransactionType, TransactionStatus, TransactionResponsePaginated, TransactionResponseModel, UserProfileResponse, EditProfileSchema,TransactionPinSchema, UpdateTransactionPinSchema, KycUploadSchema, DepositSchema
from src.auth.services import AuthServices
from src.auth.utils import verifyHash, createIdToken
from src.limiter import limiter
from src.config import config


router = APIRouter()
accessTokenBearer = AccessTokenBearer()
accountService = AccountService()
authService = AuthServices()


@router.get("/profile",  status_code=status.HTTP_200_OK, response_model=UserProfileResponse)
@limiter.limit("15/minute")
async def profile(request:Request, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
    current_user = await authService.get_user(email=user["user"]["email"], session=session)
    return current_user


@router.post("/edit-profile")
@limiter.limit("3/minute")
async def edit_user_profile(userData:EditProfileSchema, request:Request, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
    try:
        await accountService.edit_user_profile(session=session, userData=userData, email=user["user"]["email"])

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
            "msg": "Failed to setup transaction PIN",
            "description": f"Transaction PIN already configured."
        })

    try:
        await accountService.update_transaction_pin(user["user"]["email"], userData, session)
        return {"status": "success", "msg": "Transaction PIN added"}
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Failed to setup transaction PIN",
            "description": f"An error occured updating your transaction pin. Please try again later."
        })
    

@router.post("/pin/update")
@limiter.limit("3/minute")
async def update_transaction_pin(userData:UpdateTransactionPinSchema, request:Request, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
   userInfo = await authService.get_user(session=session, email=user["user"]["email"])

   if(userInfo.transactionPin is None):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Failed to update transaction PIN",
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
            await accountService.update_transaction_pin(user["user"]["email"], userData, session)
            return {"status": "success", "msg": "Transaction PIN updated successfully."}
        except:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Failed to update transaction PIN",
                "description": f"An error occured updating your transaction pin. Please try again later."
            })

@router.post("/pin/reset")
@limiter.limit("5/minute")
async def reset_transaction_pin(request:Request, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
     
    userInfo = await authService.get_user(session=session, email=user["user"]["email"])
   
    if(userInfo.transactionPin is None):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Failed to reset transaction PIN",
            "description": f"No transaction PIN found for this account. Please use the setup endpoint first."
        })
    
    pin_reset_response =  await accountService.reset_transaction_pin(user["user"]["id"], session)

    if(not pin_reset_response):
        raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail={
            "status": "error",
            "msg": "Failed to reset transaction PIN",
            "description": "An unexpected server error occurred while processing your request. Please try again later."
        })

        
    return {
            "status": "success",
            "msg": "Transaction PIN reset successfully",
        }
    
   

@router.post("/kyc/upload")
@limiter.limit("3/minute")
async def kyc_upload(uploadSchema:KycUploadSchema, request:Request, userData=Depends(accessTokenBearer), session:AsyncSession=Depends(session)):

    user = await authService.get_user(session, userData["user"]["email"])
    isLinked = await accountService.check_kyc_link(uploadSchema.nin_number, session)

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
            uploadStatus = await accountService.upload_kyc(session, uploadSchema, user.id)
                
            if (not uploadStatus):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                    "status": "error",
                    "msg": "Upload Failed",
                    "description": f"We could not store your information. Please try again later"
            })
            
            kyc_status = await accountService.update_kyc_status(session, user.email, status=KycStatus.PENDING)
        
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

        updated_kyc = await accountService.update_kyc(session, uploadSchema, user.id)

        if (not updated_kyc):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Upload Failed",
                "description": f"We could not store your information. Please try again later"
            })

        updated_status =  await accountService.update_kyc_status(session, user.email, KycStatus.PENDING)

        if (not updated_status):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Updating Status Failed",
                "description": f"We could not update kyc status"
            })

        return {"status": "success", "msg": "Upload Successful", "description": "Your KYC process is currently under review. Please await verification."}


@router.post("/resolve", response_model=ResolveAccountResponse)
@limiter.limit("10/minute")
async def resolve_account_number(account_data:AccountNumberSchema, request:Request, userData=Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
    user = await accountService.resolve_account_number(account_data.accountNumber, session)

    if(user):
        if(str(user.id) == userData["user"]["id"]):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Invalid Request",
                "description": "You cannot resolve your own account number"
            })   

        return ResolveAccountResponse(
            status="success",
            data=ResolveAccountResponseData(
                userId=str(user.id),
                firstName= user.firstName,
                lastName = user.lastName,
                email= user.email,
                accountNumber = user.accountNumber,
                photoURL= user.photoURL
            )
        )
        
    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={
            "status": "error",
            "msg": "Account not found",
            "description": "No account matching this account number"
        })


@router.post("/deposit/initialize")
@limiter.limit("2/minute")
async def initialize_transaction(request: Request, depositSchema:DepositSchema, userInfo = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
    current_user = await authService.get_user(session, userInfo["user"]["email"])

    if(depositSchema.amount > 20000):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail={
            "status": "error",
            "msg": "Validation Error",
            "description": "Amount cannot be greater than ₦20,000"
        })

    reference = createIdToken(current_user.email, salt="transaction")

    bodyParams = {
        "amount": depositSchema.amount * 100,
        "email": current_user.email,
        "channels": ["card", "bank_transfer"],
        "currency": "NGN",
        "reference": reference,
        "callback_url": f"{config.BASE_URL}/dashboard" 
    }

    paystack_response = await accountService.initialize_deposit(body=bodyParams)

    #save transaction as pending
    transaction_response = await accountService.record_transaction(session,depositSchema.amount, TransactionStatus.PENDING, current_user.id , "Wallet Deposit", None, reference, TransactionType.DEPOSIT)

    
    if not transaction_response:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "msg": "Transaction Failed",
                "description": "An error occurred saving transaction records."
            }
        )

    return {"status": "success", "msg": "Transaction Initialized", "payment_url": paystack_response["data"]["authorization_url"], "reference":reference}

    


@router.post("/transaction/webhook")
async def transaction_webhook(request:Request, session:AsyncSession = Depends(session)):
    raw_body = await request.body()
    body = await request.json()

    signature = request.headers.get("x-paystack-signature")

    if(body["event"] == "charge.success"):
        # update transaction status to successful
        await accountService.updateTransactionStatus(session, TransactionStatus.SUCCESSFUL, body["data"]["reference"])

        await accountService.updateBalance(session, email=body["data"]["customer"]["email"], operator=Operators.INCREMENT, amount=int(body["data"]["amount"]/100))
       

 
    return {"status": "success", "msg": f"Successfully deposited ₦{body['data']['amount'] / 100} into your account."}

@router.get("/transaction/verify/{reference}")
async def verify_transaction(reference:str, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):

    paystack_resp = await accountService.verify_transaction(reference)
    db_resp = await accountService.get_single_transaction(session, user["user"]["id"], reference = reference)

    if(not paystack_resp or not db_resp):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={
            "status": "error",
            "msg": "Transaction not found",
            "description": f"Transaction with Reference:{reference} could not be found"
        })

    paystack_status = paystack_resp["data"]["status"] 
    db_status = db_resp.status 

    if(paystack_status == "success" and db_status == TransactionStatus.SUCCESSFUL):
        return {"status": "success","msg": "Transaction Successful", "description": "Payment confimed and account balance updated successfully"}

    if(paystack_status == "success" and db_status != TransactionStatus.SUCCESSFUL):
        await accountService.updateTransactionStatus(session, TransactionStatus.SUCCESSFUL, reference)
        return {"status": "success","msg": "Transaction Successful", "description": "Payment confimed and account balance updated successfully"}

    if(paystack_status in["pending", "ongoing"]):
        return {"status": "pending", "msg": "Transaction Pending", "description": "Payment is still processing."}
        

    if(paystack_status in ["failed", "abandoned"]):
        await accountService.updateTransactionStatus(session, TransactionStatus.FAILED, reference)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status" : "error",
            "msg": "Transaction Failed",
            "description": "Transaction was declined by the payment provider"
        })


@router.post("/transfer")
@limiter.limit("10/minute")
async def transfer(transferInfo: TransferSchema, request: Request, userData=Depends(accessTokenBearer),
session: AsyncSession = Depends(session)):
    current_user = await authService.get_user(session, userData["user"]["email"])
    reference = createIdToken(current_user.email, "transaction")

    await accountService.reset_daily_spent(current_user, session)
   
    if current_user.transactionPin is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "status": "error",
                "msg": "Transaction PIN Required",
                "description": "You need to set up a transaction PIN before making transfers."
            }
        )

    
    recipient_info = await accountService.resolve_account_number(
        transferInfo.recipient_account_number, session
    )
    if not recipient_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={
                "status": "error",
                "msg": "Account Not Found",
                "description": "No account matching this account number."
            }
        )

   
    if current_user.id == recipient_info.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "msg": "Invalid Request",
                "description": "You cannot transfer funds to your own account."
            }
        )

  
    if transferInfo.amount < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "msg": "Invalid Amount",
                "description": "Amount cannot be less than ₦10."
            }
        )

    user_limit = int(current_user.dailyLimit.value)
    
    if (current_user.dailySpent + transferInfo.amount) > user_limit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "msg": "Daily Limit Exceeded",
                "description": f"This transfer exceeds your daily limit of ₦{user_limit}."
            }
        )


    if transferInfo.amount > current_user.balance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "msg": "Insufficient Balance",
                "description": "Please top up your account to proceed with this transaction."
            }
        )


    pinsMatch = verifyHash(transferInfo.pin, current_user.transactionPin)
    if not pinsMatch:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "status": "error",
                "msg": "Incorrect PIN",
                "description": "The transaction PIN provided is invalid."
            }
        )

    # Decrement sender balance
    current_user_response = await accountService.updateBalance(
        session, userId=current_user.id, operator=Operators.DECREMENT, amount=transferInfo.amount
    )
    if not current_user_response:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "msg": "Transaction Failed",
                "description": "An error occurred while debitting the sender account."
            }
        )

    # Increment recipient balance
    recipient_info_response = await accountService.updateBalance(
        session, userId=recipient_info.id, operator=Operators.INCREMENT, amount=transferInfo.amount
    )
    
    if not recipient_info_response:
        
        await accountService.updateBalance(
            session, userId=current_user.id, operator=Operators.INCREMENT, amount=transferInfo.amount
        )

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "msg": "Transaction Failed",
                "description": "An error occurred while crediting the recipient account."
            }
        )
    

    try:
        updated_daily_spent =  await accountService.update_daily_spent(int(transferInfo.amount), current_user.id, session)
    
        if(not updated_daily_spent):
           
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "status": "error",
                    "msg": "Transaction Processing Error",
                    "description": "Unable to update daily limit records. Please try again or contact support."
                }
            )
            
    
        transaction_response = await accountService.record_transaction(session,transferInfo.amount, TransactionStatus.SUCCESSFUL, current_user.id, transferInfo.narration, recipient_info.id, reference)

        if not transaction_response:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "status": "error",
                    "msg": "Transaction Failed",
                    "description": "An error occurred saving transaction records."
                }
            )

        
        return {
            "status": "success",
            "msg": "Transaction Successful",
            "description": f"₦{transferInfo.amount:,.2f} has been sent to {recipient_info.firstName} {recipient_info.lastName}."
        }

    except HTTPException:
        raise
    except Exception as e:
        await accountService.updateBalance(
            session, operator=Operators.INCREMENT, amount=transferInfo.amount, userId=current_user.id  
        )

        await accountService.updateBalance(
            session, userId=recipient_info.id, operator=Operators.DECREMENT, amount=transferInfo.amount
        )

        transaction_response = await accountService.record_transaction(session,transferInfo.amount, TransactionStatus.FAILED, current_user.id, transferInfo.narration, recipient_info.id,reference)
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "msg": "Transaction Failed",
                "description": f"An unexpected error occurred: {str(e)}"
            }
        )



@router.get("/transactions", response_model=TransactionResponsePaginated)
@limiter.limit("15/minute")
async def transactions(request:Request, session:AsyncSession = Depends(session), skip:int = Query(0, ge=0), limit: int = Query(10, ge=5, le=100), userData=Depends(accessTokenBearer)):
  
  transactions =   await accountService.getTransactions(session, userData["user"]["id"], skip, limit)
  return transactions


@router.get("/transactions/{transactionId}", response_model=TransactionResponseModel)
@limiter.limit("10/minute")
async def get_single_transaction(transactionId:str, request:Request, session:AsyncSession = Depends(session), user = Depends(accessTokenBearer)):

   transaction_data =  await accountService.get_single_transaction(session, user["user"]["id"], transactionId= transactionId)

   if(not transaction_data):
       raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail={
           "status": "error",
           "msg": "Transaction not found",
           "description": f"Transaction with ID:{transactionId} could not be found"
       })

   return transaction_data
