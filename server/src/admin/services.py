from typing import Optional
from fastapi import Query, HTTPException, status as http_status, BackgroundTasks
from sqlmodel import func, select, desc, and_, update, extract, case, or_
from fastapi.requests import Request
from sqlalchemy.ext.asyncio.session import AsyncSession
from src.db.models import Users, Transactions, Kyc
from src.db.enums import Roles, TransactionType, WithdrawTransactionStatus, AdminKycStatus, TransactionStatus, Operators, KycStatus, Tiers, DailyLimit, BroadCastTo
import uuid
from src.account.services import AccountService
from datetime import datetime, timedelta, timezone
import calendar
from .schema import BroadcastPayload
from src.auth.workers import send_mail
from src.messages import broadcast_message

accountService = AccountService()
now = datetime.now()
utcnow = datetime.utcnow()

thirty_days_ago = utcnow - timedelta(days=30)

class AdminService():

    async def get_all_users(self,session:AsyncSession, skip:int = Query(0, ge=0), limit:int = Query(10, le=100, ge=10), tier:Tiers = Query(None, description="Filter users by tier")):
        

        month = extract("month", Users.createdAt) == now.month
        year = extract("year", Users.createdAt) == now.year

        filter_condition = [Users.role != Roles.ADMIN]

        if(tier and tier != "all"):
            filter_condition.append(Users.tier == tier)


        select_users_count = select(func.count()).select_from(Users)
        select_users = select(Users)

        if(filter_condition):
            select_users_count = select_users_count.where(and_(*filter_condition))
            select_users = select_users.where(and_(*filter_condition)).order_by(desc(Users.createdAt)).offset(skip).limit(limit)


        result = await session.execute(select_users_count)

        pagination_total = result.scalar() or 0

        user_result = await session.execute(select_users)
        all_users = user_result.scalars().all()

        has_more = (skip + len(all_users)) < pagination_total

        raw_summary = await session.execute(select(
            func.count().filter(Users.isVerified).label("verified"),
            func.count().filter(Users.isVerified == False).label("unverified"),
            func.count().filter(and_(month, year)).label("newUsers"),
            func.count().label("totalUsers")
        ).select_from(Users).where(Users.role != Roles.ADMIN))

        summary = raw_summary.mappings().one()
        

        return {
            "summary": summary,
            "users": all_users,
            "skip": skip,
            "limit": limit,
           "hasMore": has_more,
           "total": pagination_total
        }


    async def get_single_user(self, session:AsyncSession, userId:uuid.UUID):
        result = await session.execute(select(Users).where(and_(
            Users.id == userId,
            Users.role == Roles.USER
        )))
    
        user = result.scalars().first()
    
        return user if user is not None else False
      

    async def get_all_transactions(self, session:AsyncSession, skip:int = Query(0, ge=0), limit:int = Query(10, le=100, ge=10), type:TransactionType = Query(None, description="Filter transactions by type"), status:TransactionStatus = Query(None, description="Filter transactions by status")):

        filter_condition = []

        if(status and status != "all"):
            filter_condition.append(Transactions.status == status)
        

        if(type and type != "all"):
            filter_condition.append(Transactions.type == type)

        
        selected_transaction = select(Transactions)
        select_transaction_count = select(func.count()).select_from(Transactions)

        if(filter_condition):
            selected_transaction = selected_transaction.where(and_(*filter_condition))
            select_transaction_count = select_transaction_count.where(and_(*filter_condition))

        transaction_result = await session.execute((selected_transaction).offset(skip).limit(limit).order_by(desc(Transactions.date)))
        
        result = await session.execute(select_transaction_count)

        all_transactions = transaction_result.scalars().all()

        total_transaction_in_db = result.scalar() or 0

        has_more = skip + len(all_transactions) < total_transaction_in_db

        return{
            "transactions" : all_transactions,
            "skip": skip,
            "limit": limit,
            "has_more": has_more,
            "total": total_transaction_in_db
        }

    async def get_transaction_analytics(self, session:AsyncSession):
        
        month = extract("month", Transactions.date).label("month") 
        year = extract("year", Transactions.date) 

    
        try:
            result = await session.execute( select(
                        month,
                        func.sum(case((Transactions.type == TransactionType.DEPOSIT, Transactions.amount), else_=0)).label("deposit"),
            
                        func.sum(case((Transactions.type == TransactionType.WITHDRAW, Transactions.amount),else_=0)).label("withdraw"),
                    ).group_by(month).where(
                        and_(
                            year == now.year,
                            Transactions.status == TransactionStatus.SUCCESSFUL
                        )
                    ))
    
            analytics  = result.mappings().all() or []
            month_names =  [calendar.month_abbr[month] for month in range(1, 13)]
    
            formattedAnalytics = []
    
            for data in analytics:
                newAnalyics = {
                    "month":  month_names[int(data["month"])],
                    "deposit": data["deposit"] or 0,
                    "withdraw": data["withdraw"] or 0
                }
    
                formattedAnalytics.append(newAnalyics)
    
    
            return formattedAnalytics
        except:
            raise HTTPException(status_code=http_status.HTTP_500_INTERNAL_SERVER_ERROR, detail={
                "status": "error",
                "msg": "Unable to fetch analytics data",
                "description": "An internal error occurred while processing your request. Please try again later."
            })



       
        
        

    async def get_single_transaction(self, session:AsyncSession, transactionId:uuid.UUID):
        result = await session.execute(select(Transactions).where(Transactions.id == transactionId))

        transaction = result.scalars().first()

        return transaction if transaction is not None else None


    async def update_withdrawal_status(self,session:AsyncSession, status:WithdrawTransactionStatus, transactionId:uuid.UUID):

        result = await session.execute(select(Transactions).where(and_(
            Transactions.id == transactionId,
            Transactions.type == TransactionType.WITHDRAW
        )).with_for_update())

        transaction = result.scalars().first() if result else False

        if(not transaction):
            raise HTTPException(status_code=http_status.HTTP_404_NOT_FOUND, detail={
                "status": "error",
                "msg": "Transaction not found.",
                "description": f"No transaction found with the provided ID: {transactionId}"
            })

        if(transaction.status != TransactionStatus.PENDING):
            raise HTTPException(status_code=http_status.HTTP_400_BAD_REQUEST,
                    detail={
                        "status": "error",
                        "msg": "Invalid transaction state",
                        "description": f"Transaction is currently '{transaction.status}'. Only 'PENDING' transactions can be updated."
                    }
                )
        

        try:
            if(status and transaction):
                if(transaction.status == TransactionStatus.PENDING):
                    if(status == WithdrawTransactionStatus.SUCCESSFUL):
                        
                        await accountService.update_daily_spent(transaction.amount, transaction.senderId, session)
        
                    
                    elif(status == WithdrawTransactionStatus.FAILED):
                        await accountService.updateBalance(session, Operators.INCREMENT, int(transaction.amount), transaction.senderId)
        
        
                    transaction.status = status
        
                    return transaction
        except:   
            return False


    async def get_all_kyc(self, session:AsyncSession, skip:int = Query(0 , ge=0), limit:int = Query(0, le=100, ge=5), status:AdminKycStatus = Query(None, description="Filter Kyc by status")):

        filter_condition = []

        if(status and status != "all"):
            filter_condition.append(Kyc.status == status)

        select_kyc_count = select(func.count()).select_from(Kyc)
        select_kyc = select(Kyc).offset(skip).limit(10).order_by(desc(Kyc.date))
        
        status_count_query = select(
            func.count().filter(Kyc.status == KycStatus.PENDING).label("pending"),
            func.count().filter(Kyc.status == KycStatus.VERIFIED).label("verified"),
            func.count().filter(Kyc.status == KycStatus.DECLINED).label("declined"),
        )

        if(filter_condition):
            select_kyc_count = select_kyc_count.where(*filter_condition)
            select_kyc = select_kyc.where(*filter_condition)


        kyc_count_result = await session.execute(select_kyc_count)
        status_count_result = await session.execute(status_count_query)

        total_kyc = kyc_count_result.scalar() or 0

        status_count = status_count_result.mappings().one()

        kyc_result = await session.execute(select_kyc)


        all_kycs =  kyc_result.scalars().all() if kyc_result is not None else []

        has_more = skip + len(all_kycs) < total_kyc


        pending = status_count["pending"] or 0
        verified = status_count["verified"] or 0
        declined = status_count["declined"] or 0

        return{
            "kyc": {
                "submitted_kycs": all_kycs,
                "pending": pending,
                "verified": verified,
                "declined": declined,
                "total": (pending) + (verified) + (declined)
            },
            "skip":skip,
            "limit": limit,
            "hasMore": has_more,
            "total": total_kyc,

        }

    
    async def get_user_kyc(self, session:AsyncSession, userId:uuid.UUID):
       result = await session.execute(select(Kyc).where(Kyc.userId == userId))

       user_kyc = result.scalars().first()

       return user_kyc if user_kyc is not None else False


    async def update_user_kyc_status(self, session:AsyncSession, userId:str, status:AdminKycStatus,reason:Optional[str]):

        try:
            result = await session.execute(select(Kyc).where(Kyc.userId == userId).with_for_update())
            user_kyc = result.scalars().first()
        
            if(user_kyc): 
                user_kyc.status = status
                if((user_kyc.status) == AdminKycStatus.DECLINED):
                    user_kyc.reason = reason.strip()

                
                if(user_kyc.status == AdminKycStatus.VERIFIED):
                    await session.execute(update(Users).where(Users.id == userId).values(tier = Tiers.TIER_3, dailyLimit = DailyLimit.TIER_THREE))
                    
            return user_kyc
        except Exception as e:
            print(e)
            return False

    async def get_dashboard_summary(self, session:AsyncSession):

        month = extract("month", Users.createdAt) == now.month
        year = extract("year", Users.createdAt) == now.year
        inActive = or_(
            Users.createdAt < thirty_days_ago,
            Users.createdAt == None
        )
        # inActiveYear = extract("year", Users.createdAt) <= now.year

        raw_user_summary = await session.execute(select(
            func.count().label("totalUsers"),
            func.count().filter(Kyc.status == KycStatus.PENDING).label("pendingKYC"),
            func.count().filter(and_(month, year)).label("newUsers"),
            func.count().filter(inActive).label("inActiveUsers"),
        ).select_from(Users).outerjoin(Kyc, Users.id==Kyc.userId).where(Users.role != Roles.ADMIN))

        raw_transaction_summary = await session.execute(select(
            func.count().label("totalTransactions"),
            func.sum(
                case(
                    (and_(
                        Transactions.type == TransactionType.DEPOSIT,
                        Transactions.status == TransactionStatus.SUCCESSFUL
                    ), Transactions.amount),else_=0
                ),
            ).label("inflow"),
              func.sum(
                case(
                    (and_(
                        Transactions.type == TransactionType.WITHDRAW,
                        Transactions.status == TransactionStatus.SUCCESSFUL
                    ), Transactions.amount),else_=0
                ),
            ).label("outflow"),
        ).select_from(Transactions))

        user_summary = raw_user_summary.mappings().one()
        transaction_summary = raw_transaction_summary.mappings().one()

        return {
            "totalUsers": user_summary["totalUsers"] or 0,
            "pendingKYC": user_summary["pendingKYC"] or 0,
            "newUsers": user_summary["newUsers"] or 0,
            "inActiveUsers": user_summary["inActiveUsers"] or 0,
            "inflow": transaction_summary["inflow"] or 0,
            "outflow": transaction_summary["outflow"] or 0,
            "volume": int((transaction_summary["inflow"] or 0) +( transaction_summary["outflow"] or 0)) ,
            "totalTransactions": transaction_summary["totalTransactions"] or 0
        }


    async def get_all_users_emails(self, session:AsyncSession):
        raw_mails = await session.execute(
            select(Users.email).where(and_(
                Users.role != Roles.ADMIN,
                Users.isMarketingEnabled == True
            ))
        )

        all_emails = raw_mails.scalars().all()

        return all_emails

    async def get_new_users_emails(self, session:AsyncSession):
      
        month = extract("month", Users.createdAt) == now.month
        year = extract("year", Users.createdAt) == now.year

        new_user_emails  = await session.execute(
            select(Users.email).where(and_(
               month,
               year,
                Users.role != Roles.ADMIN,
                Users.isMarketingEnabled == True,
            )))

        return new_user_emails.scalars().all()

    async def get_inactive_users_emails(self, session:AsyncSession):
        inActive = or_(
            Users.createdAt < thirty_days_ago,
            Users.createdAt == None
        )

        in_active_mails = await session.execute(select(Users.email).where(and_(inActive, Users.role != Roles.ADMIN)))

        return in_active_mails.scalars().all()


    async def send_broadcasts_mail(self, backgroundTasks:BackgroundTasks, session:AsyncSession, payload:BroadcastPayload, request:Request):
        emails = []

        if(payload.mailTo == BroadCastTo.All_USERS):
            emails = await self.get_all_users_emails(session)

        if(payload.mailTo == BroadCastTo.NEW_USERS):
            emails = await self.get_new_users_emails(session)

        if(payload.mailTo == BroadCastTo.INACTIVE_USERS):
            emails = await self.get_inactive_users_emails(session)

        message = broadcast_message(request, payload.title, payload.content)

        for email in emails:
            backgroundTasks.add_task(send_mail, email, payload.title, message)
            
        return emails
