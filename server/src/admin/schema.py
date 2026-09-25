from pydantic import BaseModel, Field, model_validator
from typing import List, Optional
import uuid
from src.db.enums import KycStatus, AdminKycStatus, BroadCastTo
from  datetime import datetime, date
from src.account.schema import UserProfileResponse, UserSchema



class Summary(BaseModel):
    verified: int
    unverified: int
    newUsers: int
    totalUsers: int

    class Config:
        from_attributes = True

class UserResponseModel(BaseModel):
    summary:Summary
    users: List[UserProfileResponse]
    skip:int
    limit:int
    hasMore:bool
    total:int



class KycModel(BaseModel):
    id: uuid.UUID 


    full_name: str 
    nin_number: str
    dob: date
    nin_slip: str
    reason: Optional[str] 
    status: KycStatus

    userId: uuid.UUID 
    # user: Optional[UserSchema] 

    date:datetime 

    class Config:
        from_attributes = True



class KycSummary(BaseModel):
    submitted_kycs: List[KycModel]
    pending: int
    verified: int
    declined: int
    total: int


class KycResponseModel(BaseModel):
    kyc: KycSummary
    skip: int
    limit: int
    has_more: bool = Field(..., alias="hasMore")
    total: int




class KycDetailModel(KycModel):
    user: Optional[UserSchema] 


class KycUpdateStatusSchema(BaseModel):
    status:AdminKycStatus
    reason:Optional[str] = Field(default=None, max_length=250)


    @model_validator(mode="after")
    def validate_reason(self):
        if(self.status and self.status == AdminKycStatus.DECLINED):
            if(self.reason is None):
                raise ValueError("A reason is required when declining a KYC submission.")


        if(self.status and self.status == AdminKycStatus.VERIFIED):
            self.reason = None

        return self



class BroadcastPayload(BaseModel):
    title:str = Field(min_length=3, max_length=90)
    content:str = Field(min_length=3, max_length=30000)
    mailTo:BroadCastTo


class AdminDashboardSummaryModel(BaseModel):
    totalUsers:int
    pendingKYC:int
    newUsers:int
    inActiveUsers:int
    inflow:int
    outflow:int
    volume: int
    totalTransactions:int