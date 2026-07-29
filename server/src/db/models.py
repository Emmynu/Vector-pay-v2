from sqlmodel import SQLModel, Field, Column, Relationship
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime, date
from typing import Optional
from enum import Enum


class KycStatus(str, Enum):
    PENDING = "pending",
    VERIFIED = "verified",
    DECLINED = "declined",
    UNVERIFIED = "unverified",


class Users(SQLModel, table=True):
    __tablename__= "users"

    id:uuid.UUID = Field(
        sa_column=Column(
            pg.UUID,
            nullable=False,
            primary_key=True,
            default=uuid.uuid4
        )
    )

    firstName: str
    lastName: str
    email:str
    userName: str
    photoURL: Optional[str]
    password: str = Field(exclude=True)
    balance: int = Field(default=0)
    password_reset_count: int = Field(default=0)
    
    accountNumber: str 
    isVerified: bool = Field(sa_column=Column(
        pg.BOOLEAN,
        default=False,
    ))
    tier: int = Field(default= 1, ge=1, le=3)
    transactionPin: Optional[str]

    kycStatus: KycStatus = Field(default=KycStatus.UNVERIFIED, nullable=False)
    kyc: Optional["Kyc"] = Relationship(back_populates="user", sa_relationship_kwargs={"lazy": "selectin"})

    createdAt: datetime = Field(
        sa_column=Column(
            pg.TIMESTAMP,
            nullable=False,
            default=datetime.now()
        )
    )
    updatedAt: datetime = Field(
        sa_column=Column(
            pg.TIMESTAMP,
            nullable=False,
            default=datetime.now()
        )
    )

class Kyc(SQLModel, table=True):
    __tablename__ = "kyc"

    id:uuid.UUID = Field(
        sa_column=Column(
            pg.UUID,
            default=uuid.uuid4,
            nullable=False,
            primary_key=True
        )
    )

    full_name: str = Field(min_length=3)
    nin_number:str = Field(min_length=11, max_length=11)
    dob: date
    nin_slip: str

    userId: uuid.UUID = Field(default=None, foreign_key="users.id")
    user: Optional["Users"] = Relationship(back_populates="kyc", sa_relationship_kwargs={"lazy": "selectin"})
