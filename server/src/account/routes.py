from fastapi import APIRouter, HTTPException, status, Depends, Request, Query, BackgroundTasks
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.auth.dependencies import RoleChecker, AccessTokenBearer
from src.db.main import session
from .services import AccountService, headers
from src.db.enums import Operators, KycStatus, Roles, Prefrences
from .schema import AccountNumberSchema, ResolveAccountResponse, ResolveAccountResponseData, TransferSchema, BankResponse, TransactionType, TransactionStatus, TransactionResponseModel, UserProfileResponse, EditProfileSchema,TransactionPinSchema, UpdateTransactionPinSchema, KycUploadSchema, DepositSchema, ResolveBankAccountSchema, WithdrawalSchema, TransactionResponsePaginated, TransactionChartResponse, PreferencesUpdateValue
from src.auth.services import AuthServices
from src.auth.utils import verifyHash, createIdToken, send_reset_pin_otp_code
from src.limiter import limiter
from src.config import config
from src.redis import redis_get_value, redis_delete_value
import requests
from typing import List, Optional
from datetime import datetime
import hmac 
import hashlib
import json
import csv
import io


router = APIRouter()
accountService = AccountService()
authService = AuthServices()
accessTokenBearer = AccessTokenBearer()

# 
@router.get("/profile",  status_code=status.HTTP_200_OK, response_model=UserProfileResponse)
@limiter.limit("15/minute")
async def profile(request:Request, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):

    email = user["user"]["email"]
    role = user["user"]["role"]

    user = await authService.userExists(session, email, role)
    return user


@router.post("/edit-profile")
@limiter.limit("3/minute")
async def edit_user_profile(editProfileSchema:EditProfileSchema, request:Request, user = Depends(accessTokenBearer), session:AsyncSession = Depends(session)):
    try:
        await accountService.edit_user_profile(session=session, editProfileSchema=editProfileSchema, id=user["user"]["id"])

        return {"status": "success", "msg": "User Profile update successful."}
    
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Oops!...something went wrong",
            "description": f"An error occured updating your profile."
        })

    

@router.post("/pin/setup")
@limiter.limit("3/minute")
async def transaction_pin_setup(transactionPinSchema:TransactionPinSchema, request:Request, user = Depends(RoleChecker(Roles.USER)), session:AsyncSession = Depends(session)):
  

    if(user.transactionPin is not None):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Failed to setup transaction PIN",
            "description": f"Transaction PIN already configured."
        })

    try:
        await accountService.update_transaction_pin(user.id, transactionPinSchema, session)
        await session.commit()

        return {"status": "success", "msg": "Transaction PIN added"}
    except:
        await session.rollback()

        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Failed to setup transaction PIN",
            "description": f"An error occured updating your transaction pin. Please try again later."
        })
    

@router.post("/pin/update")
@limiter.limit("3/minute")
async def update_transaction_pin(updateTransactionPinSchema:UpdateTransactionPinSchema, request:Request, user = Depends(RoleChecker(Roles.USER)), session:AsyncSession = Depends(session)):

   if(user.transactionPin is None):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Failed to update transaction PIN",
            "description": f"No transaction PIN found for this account. Please use the setup endpoint first."
        })
   
   transactionPin = verifyHash(updateTransactionPinSchema.currentPin, user.transactionPin)

   if(not transactionPin):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Incorrect Current Transaction PIN",
            "description": f"Please provide a valid transaction pin."
        })
   
   else:
        try:
            await accountService.update_transaction_pin(user.id, updateTransactionPinSchema, session)
            await session.commit()
            return {"status": "success", "msg": "Transaction PIN updated successfully."}
        except:
            await session.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Failed to update transaction PIN",
                "description": f"An error occured updating your transaction pin. Please try again later."
            })



@router.post("/pin/reset-request")
@limiter.limit("5/minute")
async def request_pin_reset(request:Request, background_tasks:BackgroundTasks, user = Depends(RoleChecker(Roles.USER))):

    if(user.transactionPin is None):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Failed to reset transaction PIN",
            "description": f"No transaction PIN found for this account. Please use the setup endpoint first."
        })

    response = await send_reset_pin_otp_code(user, background_tasks, request)

    if (not response):
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "msg": "OTP Dispatch Failed",
                "description": "Failed to send PIN reset code. Please try again in a few moments."
            }
        )

    return {
        "status": "success",
        "msg": "A 6-digit PIN reset code has been sent to your email.",
        "user": {
            "email": user.email,
            "expires_in_minutes": 5
            }
        }
  

    
@router.post("/pin/reset")
@limiter.limit("5/minute")
async def reset_transaction_pin(request:Request,  code:str,  user = Depends(RoleChecker(Roles.USER)), session:AsyncSession = Depends(session)):
     
   
    if(user.transactionPin is None):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Failed to reset transaction PIN",
            "description": f"No transaction PIN found for this account. Please use the setup endpoint first."
        })

    reset_otp_code = await redis_get_value(f"pin-reset-{user.email}")

    if(reset_otp_code != code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Invalid Code",
            "description": "Please provide a valid otp code",
        })

    pin_reset_response =  await accountService.reset_transaction_pin(user.id, session)

    if(not pin_reset_response):
        raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail={
            "status": "error",
            "msg": "Failed to reset transaction PIN",
            "description": "An unexpected server error occurred while processing your request. Please try again later."
        })

    await redis_delete_value(f"pin-reset-{user.email}")        
    return {
            "status": "success",
            "msg": "Transaction PIN reset successfully",
        }
    
   

@router.post("/kyc/upload", status_code=status.HTTP_201_CREATED)
@limiter.limit("3/minute")
async def kyc_upload(uploadSchema:KycUploadSchema, request:Request, user=Depends(RoleChecker(Roles.USER)), session:AsyncSession=Depends(session)):

    isLinked = await accountService.check_kyc_link(uploadSchema.nin_number, session, str(user.id)) # check if kyc info is already linked to an account

    if(not user.isVerified):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Upload Failed",
            "description": f"Please verify your account"
        })

    # return isLinked
    if(isLinked):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Verification Failed",
            "description": f"This information has already been added to an account."
    })


    if uploadSchema.dob >= datetime.now().date():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "msg": "Invalid Date of Birth",
                "description": "Date of birth must be a past date."
            }
        )
    
    if((user.kycStatus == KycStatus.UNVERIFIED and not user.kyc)):
        try:
            uploadStatus = await accountService.upload_kyc(session, uploadSchema, user.id)
                
            if (not uploadStatus):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                    "status": "error",
                    "msg": "Upload Failed",
                    "description": f"We could not store your information. Please try again later"
            })
            
            kyc_status = await accountService.update_kyc_status(session, user.id, kycstatus=KycStatus.PENDING)
        
            if (not kyc_status):
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                    "status": "error",
                    "msg": "Updating Status Failed",
                    "description": f"We could not update kyc status"
                })


            await session.commit()
            await session.refresh(uploadStatus)

            return {"status": "success", "msg": "Upload Successful", "description": "Your KYC process is currently under review. Please await verification."}
        
        except Exception as e:
            await session.rollback()
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

        updated_status =  await accountService.update_kyc_status(session, user.id, KycStatus.PENDING)

        if (not updated_status):
            await session.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status": "error",
                "msg": "Updating Status Failed",
                "description": f"We could not update kyc status"
            })

        await session.commit()
        return {"status": "success", "msg": "Upload Successful", "description": "Your KYC process is currently under review. Please await verification."}


@router.post("/resolve", response_model=ResolveAccountResponse)
@limiter.limit("10/minute")
async def resolve_account_number(account_data:AccountNumberSchema, request:Request, userData=Depends(RoleChecker(Roles.USER)), session:AsyncSession = Depends(session)):
    user = await accountService.resolve_account_number(account_data.accountNumber, session, userData.id)

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
    


@router.post("/deposit/initialize")
@limiter.limit("2/minute")
async def initialize_transaction(request: Request, depositSchema:DepositSchema, user = Depends(RoleChecker(Roles.USER)), session:AsyncSession = Depends(session)):

    if(depositSchema.amount > 20000):
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_CONTENT, detail={
            "status": "error",
            "msg": "Validation Error",
            "description": "Amount cannot be greater than ₦20,000"
        })

    reference = createIdToken(str(user.id), salt="transaction")

    bodyParams = {
        "amount": depositSchema.amount * 100,
        "email": user.email,
        "channels": ["card", "bank_transfer"],
        "currency": "NGN",
        "reference": reference,
        "callback_url": f"{config.BASE_URL}/dashboard" ,
        "metadata": {
            "user_id": str(user.id),
        }
    }

    paystack_response = await accountService.initialize_deposit(body=bodyParams)

    #save transaction as pending
    transaction_response = await accountService.record_transaction(session,depositSchema.amount, TransactionStatus.PENDING, str(user.id) , "Wallet Deposit", None, reference, TransactionType.DEPOSIT)

    
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

    signature = request.headers.get("x-paystack-signature")

    if(not signature):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status": "error",
            "msg": "Payment Failed",
            "description": "Missing Paystack payment signature"
        })

    raw_body = await request.body()

    secret = config.PAYSTACK_SECRET_KEY.encode("utf-8") if config.PAYSTACK_SECRET_KEY else config.PAYSTACK_SECRET_KEY 

    hash = hmac.new(
        key=secret,
        msg= raw_body,
        digestmod=hashlib.sha512
    ).hexdigest()

    if(not hmac.compare_digest(hash, signature)):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail={
            "status": "error",
            "msg": "Payment Failed",
            "description": "Invalid Paystack payment signature"
        })
    
    body = await json.loads(raw_body.decode("utf-8"))

    if(body.get("event") == "charge.success"):
        try:
            reference = body["data"]["reference"]
            userId =  body["data"]["metadata"]["user_id"]

            transaction = await accountService.get_single_transaction(session, reference=reference, userId=userId)

            if(transaction.status != TransactionStatus.SUCCESSFUL):
                await accountService.updateBalance(session, userId=userId, operator=Operators.INCREMENT, amount=int(body["data"]["amount"]/100))

                # update transaction status to successful
                await accountService.updateTransactionStatus(session, TransactionStatus.SUCCESSFUL, reference)
        
                await session.commit()
            
                return {"status": "success", "msg": f"Successfully deposited ₦{body['data']['amount'] / 100} into your account."}

            if(transaction.status == TransactionStatus.SUCCESSFUL):
                return {"status": "success", "msg": f"Successfully deposited ₦{body['data']['amount'] / 100} into your account."}
        
        except Exception as e: 
            await session.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={"status": "error", "msg": "Webhook processing failed", "description": str(e)}
            )
        
    # return {"status": "ignored", "msg": "Event not handled"}

@router.get("/transaction/verify/{reference}")
async def verify_transaction(reference:str, user = Depends(RoleChecker(Roles.USER)), session:AsyncSession = Depends(session)):

    paystack_resp = await accountService.verify_transaction(reference)

    db_resp = await accountService.get_single_transaction(session, user.id, reference = reference)

    if(not paystack_resp or not db_resp):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={
            "status": "error",
            "msg": "Transaction not found",
            "description": f"Transaction with Reference:{reference} could not be found"
        })

    paystack_status = paystack_resp["data"]["status"] 
    db_status = db_resp.status 

    # try:
    if(paystack_status == "success" and db_status == TransactionStatus.SUCCESSFUL):
        return {"status": "success","msg": "Payment Successful", "description": "Payment confimed and account balance has been updated successfully"}
        
    if(paystack_status == "success" and db_status != TransactionStatus.SUCCESSFUL):
        await accountService.updateBalance(session, email=paystack_resp["data"]["customer"]["email"], operator=Operators.INCREMENT, amount=int(paystack_resp["data"]["amount"]/100))

        await accountService.updateTransactionStatus(session, TransactionStatus.SUCCESSFUL, reference)

        await session.commit()

        return {"status": "success","msg": "Payment Successful", "description": "Payment confimed and account balance has been updated successfully"}
    
    if(paystack_status in["pending", "ongoing"]):
        return {"status": "pending", "msg": "Payment Pending", "description": "Payment is still processing. Please be patient while we confirm payment status"}
            
    
    if(paystack_status in ["failed", "abandoned"]):
        await accountService.updateTransactionStatus(session, TransactionStatus.FAILED, reference)

        await session.commit()

        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                    "status" : "error",
                    "msg": "Payment Failed",
                    "description": "Transaction was declined by the payment provider"
                })
    # except:
    #     await session.rollback()



@router.post("/transfer")
@limiter.limit("10/minute")
async def transfer(transferInfo: TransferSchema, request: Request, user=Depends(RoleChecker(Roles.USER)),
session: AsyncSession = Depends(session)):
    # current_user = await authService.get_user(session, userData["user"]["email"])
    reference = createIdToken(user.email, "transaction")

   
    if user.transactionPin is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "status": "error",
                "msg": "Transaction PIN Required",
                "description": "You need to set up a transaction PIN before making transfers."
            }
        )

    
    recipient_info = await accountService.resolve_account_number(transferInfo.recipient_account_number, session, user.id)

    
    if transferInfo.amount < 10:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "msg": "Invalid Amount",
                "description": "Amount cannot be less than ₦10."
            }
        )

    user_limit = int(user.dailyLimit.value)
    
    if (user.dailySpent + transferInfo.amount) > user_limit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "msg": "Daily Limit Exceeded",
                "description": f"This transfer exceeds your daily limit of ₦{user_limit}."
            }
        )


    if transferInfo.amount > user.balance:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "msg": "Insufficient Balance",
                "description": "Please top up your account to proceed with this transaction."
            }
        )


    pinsMatch = verifyHash(transferInfo.pin, user.transactionPin)
    if not pinsMatch:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "status": "error",
                "msg": "Incorrect PIN",
                "description": "The transaction PIN provided is invalid."
            }
        )
    

    try:
        # Decrement sender balance
        user_response = await accountService.updateBalance(
            session, userId=user.id, operator=Operators.DECREMENT, amount=transferInfo.amount
        )

        if(not user_response):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "status": "error",
                    "msg": "Transaction Failed",
                    "description": "Unable to update sender balance. Please try again or contact support."
                }
            )


        # Increment recipient balance
        recipient_info_response = await accountService.updateBalance(
            session, userId=recipient_info.id, operator=Operators.INCREMENT, amount=transferInfo.amount
        )

        if(not recipient_info_response):
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "status": "error",
                    "msg": "Transaction Failed",
                    "description": "Unable to update recipient balance. Please try again or contact support."
                }
            )

        
               
        updated_daily_spent =  await accountService.update_daily_spent(int(transferInfo.amount), user.id, session)
    
        if(not updated_daily_spent):
           
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "status": "error",
                    "msg": "Transaction Processing Error",
                    "description": "Unable to update daily limit records. Please try again or contact support."
                }
            )
            
    
        transaction_response = await accountService.record_transaction(session,transferInfo.amount, TransactionStatus.SUCCESSFUL, user.id, transferInfo.narration, recipient_info.id, reference)

        if not transaction_response:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail={
                    "status": "error",
                    "msg": "Transaction Failed",
                    "description": "An error occurred saving transaction records."
                }
            )


        await session.commit()
        
        return {
            "status": "success",
            "msg": "Transaction Successful",
            "description": f"₦{transferInfo.amount:,.2f} has been sent to {recipient_info.firstName} {recipient_info.lastName}."
        }

    except HTTPException:
        raise
    except Exception as e:

        await session.rollback()

        transaction_response = await accountService.record_transaction(session,transferInfo.amount, TransactionStatus.FAILED, user.id, transferInfo.narration, recipient_info.id,reference)
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "msg": "Transaction Failed",
                "description": f"An unexpected error occurred: {str(e)}"
            }
        )


@router.get("/banks", response_model=List[BankResponse])
@limiter.limit("20/minute")
async def get_all_banks(request:Request, user = Depends(RoleChecker(Roles.USER))):
    banks = []
    try:
        all_banks =  requests.get(f"{config.PAYSTACK_BASE_URL}/bank", headers=headers).json()

        if(all_banks["data"]):
            for bank in all_banks["data"]:
                banks.append({
                    "id": bank["id"],
                    "bank_name": bank["name"],
                    "code": bank["code"]
                })

        return banks
    except: 
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status" : "error",
            "msg" : "Failed to fetch banks",
            "description": "An error occured while fetching banks. Please try again."
        })


@router.post("/bank-details/resolve")
@limiter.limit("10/minute")
async def resolve_bank_details(request:Request, body:ResolveBankAccountSchema, user = Depends(RoleChecker(Roles.USER))):

    banks = await get_all_banks(request, user)
    bankName = None 
    
    for bank in banks:
        if(bank["code"] == body.bank_code):
            bankName = bank["bank_name"]

    
    if(banks):
            user_bank_info = await accountService.resolve_bank_details(body) 

            if(not user_bank_info):
                
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={
                    "status": "error",
                    "msg": "Account not found",
                    "description": "No account matching this account number"
                })
        
            return {
                "status": "success",
                "account_number": user_bank_info["data"]["account_number"],
                "account_name":  user_bank_info["data"]["account_name"],
                "bank_name": bankName
            }


@router.post("/withdraw")
@limiter.limit("10/minute")
async def withdraw(request:Request, withdrawalBody:WithdrawalSchema, backgroundTasks:BackgroundTasks, user = Depends(RoleChecker(Roles.USER)), session:AsyncSession = Depends(session)):

    # current_user =  await authService.get_user(session, user.email)
    

    await accountService.reset_daily_spent(user, session)

    if user.transactionPin is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={
                "status": "error",
                "msg": "Transaction PIN Required",
                "description": "You need to set up a transaction PIN before making transfers."
            }
        )

    body = ResolveBankAccountSchema(
        account_number=withdrawalBody.account_number,
        bank_code=withdrawalBody.bank_code
    )

    user_bank_info = await resolve_bank_details(request, body, user)

    if(user_bank_info["status"] == "error"):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail={
            "status": "error",
            "msg": "Account not found",
            "description": "No bank account matching this account number"
        })
    

    if withdrawalBody.amount < 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "msg": "Invalid Amount",
                "description": "Amount cannot be less than ₦10."
            }
        )

    user_limit = int(user.dailyLimit.value)
    
    if (user.dailySpent + withdrawalBody.amount) > user_limit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "msg": "Daily Limit Exceeded",
                "description": f"This transfer exceeds your daily limit of ₦{user_limit}."
            }
        )


    if(int(withdrawalBody.amount) > user.balance):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "msg": "Insufficient Balance",
                "description": "Please top up your account to proceed with this transaction."
            }
        )

    isPinValid = verifyHash(withdrawalBody.pin, user.transactionPin)

    if(not isPinValid):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={
                "status": "error",
                "msg": "Incorrect PIN",
                "description": "The transaction PIN provided is invalid."
            }
        )


    withdrawal_info = {
        "account_number":withdrawalBody.account_number,
        "bank_name": user_bank_info["bank_name"],
        "account_name": user_bank_info["account_name"]
    }

    reference = createIdToken(user.email, f"withdraw")


    try:
        new_balance = await accountService.updateBalance(session, Operators.DECREMENT, withdrawalBody.amount, user.id)

        if(not new_balance):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
                "status" : "error",
                "msg": "Withdrawal Failed",
                "description": "Failed to update balance."
            })
        

        await accountService.record_transaction(session, withdrawalBody.amount, TransactionStatus.PENDING, user.id, withdrawalBody.narration, None, reference, TransactionType.WITHDRAW, withdrawal_info)

        # await accountService.update_daily_spent(withdrawalBody.amount, user.id, session)

        message = (
            f"🚨 NEW WITHDRAWAL REQUEST 🚨\n\n"
            f"Amount:₦{withdrawalBody.amount:,.2f}\n"
            f"Bank:{withdrawal_info["bank_name"]}\n"
            f"Account:{withdrawalBody.account_number} ({withdrawal_info["account_name"]})\n"
            f"Ref:`{reference}`\n\n"
            f"Dashboard: {config.BASE_URL}/admin/dashboard" 
        )

        backgroundTasks.add_task(accountService.send_telegram_notification, message)

        await session.commit()

        return {
            "status": "success",
            "msg": "Withdrawal Initiated",
            "description": "Your funds are on the way! Payouts usually arrive in 5–10 minutes. You can track this in your transaction history."
        }
    
    except Exception as e:
        await session.rollback()

        await accountService.record_transaction(session, withdrawalBody.amount, TransactionStatus.FAILED, user.id, withdrawalBody.narration, None, reference, TransactionType.WITHDRAW, withdrawal_info=withdrawal_info)

        await session.commit()


        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail={
            "status":"error",
            "msg": "Withdrawal Failed",
            "description": str(e)
        })
    



@router.get("/transactions", response_model=TransactionResponsePaginated)
@limiter.limit("30/minute")
async def transactions(request:Request, session:AsyncSession = Depends(session), skip:int = Query(0, ge=0), limit: int = Query(10, ge=4, le=100), user=Depends(RoleChecker(Roles.USER)), status: Optional[TransactionStatus] = Query(None, description="Filter transactions by status"), type: Optional[TransactionType] = Query(None, description="Filter transactions by type")):
  
  new_status = None
  new_type = None

  if(status and status != "all"):
        new_status = status

  if(type and type != "all"):
      new_type = type


  transactions =   await accountService.getTransactions(session,user.id, skip, limit, status=new_status, type=new_type)
  
  
  return transactions



@router.get("/transactions/analytics", response_model=TransactionChartResponse)
@limiter.limit("30/minute")
async def get_transaction_analytics(request:Request, session:AsyncSession = Depends(session),  user = Depends(RoleChecker(Roles.USER))):
    analytics = await accountService.getTransactionMonthlyChartData(session=session, userId=user.id)

    return analytics

@router.get("/transactions/export", response_class=StreamingResponse, responses={200: {"content": {"text/csv": {}}}})
@limiter.limit("7/minute")
async def export_transactions(request:Request, session:AsyncSession = Depends(session), user = Depends(RoleChecker(Roles.USER))):
    transactions = await accountService.getExportTransaction(session, str(user.id))

    fieldNames = [
        "Transaction ID",
        "Sender",
        "Recepient",
        "Account Number",    
        "Type",
        "Status",
        "Amount",
        "Reference",
        "Date",
        "Narration",
        "Bank"
    ]
    output = io.StringIO() #In memory text buffer - saving it to d user memory rather than writing to a file


    writer = csv.DictWriter(output, fieldnames=fieldNames, quoting=csv.QUOTE_NONNUMERIC)

    writer.writeheader()
    recipient =  None
    accountNumber = None

    for transaction in transactions:
    

        if(transaction.type == TransactionType.TRANSFER):

            if(transaction.recipient):
                recipient = f"{transaction.recipient.firstName} {transaction.recipient.lastName}"

                if(transaction.recipientId == user.id):
                    accountNumber = f"\t{transaction.sender.accountNumber}"

                elif(transaction.senderId == user.id):
                    accountNumber = f"\t{transaction.recipient.accountNumber}"
          
        elif (transaction.type == TransactionType.DEPOSIT):
              recipient = "N/A"
              accountNumber = "N/A"

        elif (transaction.type == TransactionType.WITHDRAW):

            if(transaction.withdrawal_info):
                recipient = f"{transaction.withdrawal_info["account_name"]}"
                accountNumber= f"{transaction.withdrawal_info["account_number"]}"

        else:
            accountNumber = "N/A"
            recipient = "N/A"

            
        
        writer.writerow({
            "Transaction ID":transaction.id,
            "Sender": f"{transaction.sender.firstName} {transaction.sender.lastName}" if transaction.sender else "N/A",
            "Recepient": recipient,
            "Account Number": accountNumber,
            "Type":transaction.type,
            "Status":transaction.status,
            "Amount":transaction.amount,
            "Reference":transaction.reference,
            "Date":transaction.date.strftime("%Y-%m-%d"),
            "Narration":transaction.narration,
            "Bank": transaction.withdrawal_info["bank_name"] if transaction.withdrawal_info else "Vectorpay Wallet"
        })


    output.seek(0)  # Move the cursor to the beginning of the StringIO buffer
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f'attachment; filename=vectorpay_transactions_log_for_{user.firstName} {user.lastName}.csv'
        },
        
    )
    
   

@router.get("/transactions/{transactionId}", response_model=TransactionResponseModel)
@limiter.limit("15/minute")
async def get_single_transaction(transactionId:str, request:Request, session:AsyncSession = Depends(session), user = Depends(RoleChecker(Roles.USER))):

   transaction_data =  await accountService.get_single_transaction(session, user.id, transactionId= transactionId)

   if(not transaction_data):
       raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail={
           "status": "error",
           "msg": "Transaction not found",
           "description": f"Transaction with ID:{transactionId} could not be found"
       })

   return transaction_data


@router.patch("/preferences/{key}/update", status_code=status.HTTP_200_OK)
@limiter.limit("/5/minute")
async def update_settings_preferences(key:Prefrences, payload:PreferencesUpdateValue, request:Request, session:AsyncSession = Depends(session), user = Depends(RoleChecker(Roles.USER))):

    new_preferences =  await accountService.update_setting_preferences(user.id, key, payload.value, session)

    if(not new_preferences):
        await session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
            "status": "error",
            "msg": "Failed to update settings",
            "description": f"Unable to update preference key '{key}'. Please check input values or try again later"
        })


    await session.commit()
    return {
        "status": "success",
        "msg": f"{key} has been updated successfully",
        "user": new_preferences
    }


@router.post("/biometrics/setup")
@limiter.limit("1/minute")
async def setup_biometrics(request:Request):
    pass