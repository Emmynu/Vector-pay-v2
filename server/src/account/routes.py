from fastapi import APIRouter, HTTPException, status, Depends, Request,Query
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.auth.dependencies import AccessTokenBearer
from src.db.main import session
from .services import AccountService
from src.db.enums import Operators
from .schema import AccountNumberSchema, ResolveAccountResponse, ResolveAccountResponseData, TransferSchema, TransactionCreateSchema, TransactionType, TransactionStatus, TransactionResponsePaginated, TransactionResponseModel
from src.auth.services import AuthServices
from src.auth.utils import verifyHash
from src.limiter import limiter

router = APIRouter()
accessTokenBearer = AccessTokenBearer()
accountService = AccountService()
authServices = AuthServices()


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



@router.post("/transfer")
@limiter.limit("10/minute")
async def transfer(transferInfo: TransferSchema, request: Request, userData=Depends(accessTokenBearer),
session: AsyncSession = Depends(session)):
    current_user = await authServices.get_user(session, userData["user"]["email"])

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
        session, current_user.id, Operators.DECREMENT, transferInfo.amount
    )
    if not current_user_response:
        raise Exception("Failed to update sender balance")

    # Increment recipient balance
    recipient_info_response = await accountService.updateBalance(
        session, recipient_info.id, Operators.INCREMENT, transferInfo.amount
    )
    
    if not recipient_info_response:
        
        await accountService.updateBalance(
            session, current_user.id, Operators.INCREMENT, transferInfo.amount
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
                

       
        transaction_data = TransactionCreateSchema(
            type=TransactionType.TRANSFER,
            amount=transferInfo.amount,
            narration=transferInfo.narration,
            senderId=current_user.id,
            recipientId=recipient_info.id,
            status=TransactionStatus.SUCCESSFUL
        )
        transaction_response = await accountService.saveTransaction(session, transaction_data)

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
            session, current_user.id, Operators.INCREMENT, transferInfo.amount
        )

        await accountService.updateBalance(
            session, recipient_info.id, Operators.DECREMENT, transferInfo.amount
        )

        await accountService.saveTransaction(
            session,
            TransactionCreateSchema(
                type=TransactionType.TRANSFER,
                amount=transferInfo.amount,
                narration=transferInfo.narration,
                senderId=current_user.id,
                recipientId=recipient_info.id,
                status=TransactionStatus.FAILED
            )
        )
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

   transaction_data =  await accountService.get_single_transaction(session, transactionId, user["user"]["id"])

   if(not transaction_data):
       raise HTTPException(status_code = status.HTTP_404_NOT_FOUND, detail={
           "status": "error",
           "msg": "Transaction not found",
           "description": f"Transaction with ID:{transactionId} could not be found"
       })

   return transaction_data
