from sqlmodel import SQLModel, Field, Column, Relationship
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime, date, timezone
from typing import Optional, List
from decimal import Decimal
from .enums import KycStatus, TransactionStatus, TransactionType, DailyLimit



class Users(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(
        sa_column=Column(
            pg.UUID,
            nullable=False,
            primary_key=True,
            default=uuid.uuid4
        )
    )

    firstName: str
    lastName: str
    email: str
    userName: str
    photoURL: Optional[str] = None
    password: str = Field(exclude=True)
    balance: Decimal = Field(default=0)
    password_reset_count: int = Field(default=0)

    accountNumber: str 
    isVerified: bool = Field(sa_column=Column(
        pg.BOOLEAN,
        default=False,
    ))
    
    tier: int = Field(default=1, ge=1, le=3)
    transactionPin: Optional[str] = None

    ip:str = Field(nullable=True, default=None)
    location:str = Field(nullable=True, default=None)

    dailyLimit: DailyLimit = Field(default=DailyLimit.TIER_ONE)
    dailySpent: int = Field(default=0)
    lastSpentDate: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), sa_column=Column(
        pg.TIMESTAMP(timezone=True),
        nullable=False,
    ))

    kycStatus: KycStatus = Field(default=KycStatus.UNVERIFIED, nullable=False)
    kyc: Optional["Kyc"] = Relationship(back_populates="user", sa_relationship_kwargs={"lazy": "selectin"})

    # Transactions where this user is a sender
    transactions_sent: List["Transactions"] = Relationship(
        back_populates="sender", 
        sa_relationship_kwargs={"primaryjoin": "Users.id == Transactions.senderId", "lazy": "selectin"}
    )

    # Transactions where this user is a receiver
    transactions_received: List["Transactions"] = Relationship(
        back_populates="recipient", 
        sa_relationship_kwargs={"primaryjoin": "Users.id == Transactions.recipientId", "lazy": "selectin"}
    )

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

    id: uuid.UUID = Field(
        sa_column=Column(
            pg.UUID,
            default=uuid.uuid4,
            nullable=False,
            primary_key=True
        )
    )

    full_name: str = Field(min_length=3)
    nin_number: str = Field(min_length=11, max_length=11)
    dob: date
    nin_slip: str

    userId: uuid.UUID = Field(default=None, foreign_key="users.id")
    user: Optional["Users"] = Relationship(back_populates="kyc", sa_relationship_kwargs={"lazy": "selectin"})


class Transactions(SQLModel, table=True):
    __tablename__ = "transactions" 

    id: uuid.UUID = Field(sa_column=Column(
        pg.UUID,
        default=uuid.uuid4,
        nullable=False,
        primary_key=True
    ))

    status: TransactionStatus = Field(default=TransactionStatus.PENDING)
    type: TransactionType = Field(default=TransactionType.TRANSFER)
    amount: int
    narration: Optional[str] = Field(default=None, min_length=3)
    reference: str 
    date: datetime = Field(sa_column=Column(
        pg.TIMESTAMP,
        default=datetime.now(),
        nullable=False
    ))

    senderId: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id", index=True)
    recipientId: Optional[uuid.UUID] = Field(default=None, foreign_key="users.id", index=True)

    sender: Optional["Users"] = Relationship(
        back_populates="transactions_sent",
        sa_relationship_kwargs={"foreign_keys": "[Transactions.senderId]", "lazy": "selectin"}
    )

    recipient: Optional["Users"] = Relationship(
        back_populates="transactions_received",
        sa_relationship_kwargs={"foreign_keys": "[Transactions.recipientId]", "lazy": "selectin"}
    )

    withdrawal_info: Optional[dict] = Field(sa_column=Column(pg.JSONB, default=None))