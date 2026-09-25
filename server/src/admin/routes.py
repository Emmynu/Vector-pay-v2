from fastapi import APIRouter, Depends, HTTPException, Query, status as http_status, BackgroundTasks
from fastapi.requests import Request
from src.limiter import limiter
from src.auth.dependencies import RoleChecker
from src.db.enums import Roles, TransactionStatus, TransactionType, AdminKycStatusFilter, WithdrawTransactionStatus, KycStatus, Tiers
from .services import AdminService
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.main import session
from .schema import UserResponseModel, KycResponseModel, KycDetailModel, KycUpdateStatusSchema, BroadcastPayload, AdminDashboardSummaryModel
from src.account.schema import TransactionResponsePaginated, TransactionResponseModel, UserProfileResponse
import uuid
from src.account.services import AccountService



router = APIRouter()
adminService = AdminService()
accountService = AccountService()


@router.get("/users", response_model=UserResponseModel)
@limiter.limit("20/minute")
async def get_all_users(request:Request, admin = Depends(RoleChecker(Roles.ADMIN)), skip:int = Query(0, ge=0), limit:int = Query(10, le=100, ge=10), tier:Tiers = Query(None, description="Filter users by tier"), session:AsyncSession = Depends(session)):

    try:
        all_users = await adminService.get_all_users(session, skip, limit, tier)
       
        return all_users
    except Exception as e:
        raise HTTPException(status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
            "status": "error",
            "msg": "Unable to fetch users.",
            "description": "An internal error occurred while processing your request. Please try again later."
        })


@router.get("/user/{userId}", response_model=UserProfileResponse)
@limiter.limit("20/minute")
async def get_single_user(
    request:Request,
    userId:uuid.UUID,
    admin = Depends(RoleChecker(Roles.ADMIN)),
    session:AsyncSession = Depends(session),
):
    user = await adminService.get_single_user(session, userId)

    if(not user):
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail={
            "status": "error",
            "msg": "User not found.",
            "description": f"No user found with the provided ID: {userId}"
        })


    return user



@router.get("/kyc", response_model=KycResponseModel)
@limiter.limit("20/minute")
async def get_all_submitted_kyc(request:Request, admin = Depends(RoleChecker(Roles.ADMIN)), skip:int = Query(0, ge=0), limit:int = Query(5, le=100, ge=5), status:AdminKycStatusFilter = Query(None, description="Filter Kyc by status") , session:AsyncSession = Depends(session)):

    try:
        
        all_kyc = await adminService.get_all_kyc(session, skip, limit, status)

        return all_kyc
    except:
        raise HTTPException(status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR, detail = {
            "status": "error",
            "msg": "Unable to fetch kycs.",
            "description": "An internal error occurred while processing your request. Please try again later."
        })



@router.get("/kyc/{userId}", response_model=KycDetailModel)
@limiter.limit("20/minute")
async def get_user_kyc(
 request:Request,
 userId:uuid.UUID,
 admin = Depends(RoleChecker(Roles.ADMIN)),
 session:AsyncSession = Depends(session),
):
    user_kyc = await adminService.get_user_kyc(session, userId)

    if(not user_kyc):
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail={
            "status": "error",
            "msg": "Kyc not found.",
            "description": f"No kyc found for the provided user ID: {userId}"
        })  

    return user_kyc


@router.patch("/kyc/{userId}/status")
async def update_kyc_status(
 request:Request,
 userId:uuid.UUID,
 body: KycUpdateStatusSchema,
 admin = Depends(RoleChecker(Roles.ADMIN)),
 session:AsyncSession = Depends(session),
 
):
    user_kyc = await get_user_kyc(request, userId, admin, session)

    if(user_kyc):   

        if(user_kyc.status != KycStatus.PENDING):
            raise HTTPException(
            status_code=http_status.HTTP_400_BAD_REQUEST,
            detail={
                "status": "error",
                "msg": "KYC Status Conflict",
                "description": "This KYC application has already been reviewed and cannot be modified or re-evaluated."
            })
        
        new_status =  await adminService.update_user_kyc_status(session, userId, body.status, body.reason)      

        await session.commit()

        if(not new_status):
            await session.rollback()
                        
            raise HTTPException(http_status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
                "status": "error",
                "msg": "Unable to update user kyc status",
                "description": "An internal error occurred while processing your request. Please try again later."
            })
          
        return new_status




@router.get("/transactions", response_model=TransactionResponsePaginated)
@limiter.limit("20/minute")
async def get_all_transactions(
    request:Request, 
    admin = Depends(RoleChecker(Roles.ADMIN)), 
    skip:int = Query(0, ge=0), 
    limit:int = Query(10, le=100, ge=10), 
    session:AsyncSession = Depends(session), 
    type:TransactionType = Query(None, description="Filter transactions by type"), 
    status:TransactionStatus = Query(None, description="Filter transactions by status"
)):
    
    try:
        transactions = await adminService.get_all_transactions(session, skip, limit, type, status)
        
        return transactions
    except Exception as e:
        raise HTTPException(status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
            "status": "error",
            "msg": "Unable to fetch transactions.",
            "description": "An internal error occurred while processing your request. Please try again later."
        })



@router.get("/transactions/analytics")
@limiter.limit("20/minute")
async def get_transactions_analytics(
    request:Request,
    admin = Depends(RoleChecker(Roles.ADMIN)), 
    session:AsyncSession = Depends(session)
):
    analytics =  await adminService.get_transaction_analytics(session)

    return analytics
    

@router.get("/transactions/{transactionId}", response_model=TransactionResponseModel)
@limiter.limit("20/minute")
async def get_single_transaction(
    request:Request, 
    transactionId:uuid.UUID,
    admin = Depends(RoleChecker(Roles.ADMIN)), 
    session:AsyncSession = Depends(session)
):
    transaction = await adminService.get_single_transaction(session, transactionId)

    if(not transaction):
        raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail={
            "status": "error",
            "msg": "Transaction not found.",
            "description": f"No transaction found with the provided ID: {transactionId}"
        })


    return transaction

@router.patch("/transactions/{transactionId}/withdraw", response_model=TransactionResponseModel)
@limiter.limit("20/minute")
async def update_withdrawal_status(
    request:Request, 
    status:WithdrawTransactionStatus,
    transactionId:uuid.UUID,
    admin = Depends(RoleChecker(Roles.ADMIN)), 
    session:AsyncSession = Depends(session)
):
    new_transaction = await adminService.update_withdrawal_status(session, status, transactionId)

    if(not new_transaction):
            await session.rollback()
            raise HTTPException(
            status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={
                "status": "error",
                "msg": "Failed to update transaction status",
                "description": "An error occurred while persisting the updated status to the database. Please try again."
            }
        )


    await session.commit()
    return new_transaction

    
@router.post("/broadcasts")
@limiter.limit("5/minute")
async def send_broadcast_email(request:Request, payload:BroadcastPayload, backgroundTasks:BackgroundTasks, admin = Depends(RoleChecker(Roles.ADMIN)), session:AsyncSession = Depends(session)):
    try:
        mails = await adminService.send_broadcasts_mail(backgroundTasks, session, payload, request)
        
        return {
            "status": "success",
            "msg": "Broadcast message sent successfully"
        }
    
    except:
        raise HTTPException(status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
            "status": "error",
            "msg": "Failed to send ",
            "description": "An error occurred while sending a broadcast message. Please try again."
        })


@router.get("/dashboard/summary", response_model=AdminDashboardSummaryModel) 
@limiter.limit("20/minute")
async def dashboard_summary(request:Request, session:AsyncSession = Depends(session), admin = Depends(RoleChecker(Roles.ADMIN))):
    try:
        summary =  await adminService.get_dashboard_summary(session)

        return summary
    except:
        raise HTTPException(status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
            "status": "error",
            "msg": "Failed to fetch summary",
            "description": "An error occurred while fetching dashboard. Please try again."
        })