from sqlmodel import SQLModel, Field, Column, Relationship
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime, date, timezone
from typing import Optional, List
from decimal import Decimal
from .enums import KycStatus, TransactionStatus, TransactionType, DailyLimit, Roles


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Users(SQLModel, table=True):
    __tablename__ = "users"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(
            pg.UUID,
            nullable=False,
            primary_key=True,
        ),
    )

    firstName: str
    lastName: str
    email: str
    userName: str
    photoURL: Optional[str] = None
    password: str = Field(exclude=True)
    balance: Decimal = Field(default=Decimal("0"))
    password_reset_count: int = Field(default=0)

    accountNumber: str

    isVerified: bool = Field(default=False)
    tier: int = Field(default=1, ge=1, le=3)
    transactionPin: Optional[str] = None

    ip: Optional[str] = Field(default=None)
    location: Optional[str] = Field(default=None)

    role: Roles = Field(default=Roles.USER)
    dailyLimit: DailyLimit = Field(default=DailyLimit.TIER_ONE)
    dailySpent: int = Field(default=0)

    lastSpentDate: datetime = Field(default_factory=utc_now)

    isMarketingEnabled: bool = Field(default=False)
    isBiometricsEnabled: bool = Field(default=False)

    # Relationship to Kyc
    kyc: Optional["Kyc"] = Relationship(
        back_populates="user",
        sa_relationship_kwargs={"lazy": "selectin"},
    )

    @property
    def kycStatus(self) -> KycStatus:
        if self.kyc is not None:
            return self.kyc.status
        return KycStatus.UNVERIFIED

    # Transactions where this user is a sender
    transactions_sent: List["Transactions"] = Relationship(
        back_populates="sender",
        sa_relationship_kwargs={
            "primaryjoin": "Users.id == Transactions.senderId",
            "lazy": "selectin",
        },
    )

    # Transactions where this user is a receiver
    transactions_received: List["Transactions"] = Relationship(
        back_populates="recipient",
        sa_relationship_kwargs={
            "primaryjoin": "Users.id == Transactions.recipientId",
            "lazy": "selectin",
        },
    )

    loginAt: Optional[datetime] = Field(default=None)
    createdAt: datetime = Field(default_factory=utc_now)


class Kyc(SQLModel, table=True):
    __tablename__ = "kyc"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(
            pg.UUID,
            nullable=False,
            primary_key=True,
        ),
    )

    full_name: str = Field(min_length=3)
    nin_number: str = Field(min_length=11, max_length=11)
    dob: date
    nin_slip: str
    status: KycStatus = Field(default=KycStatus.UNVERIFIED, nullable=False)

    reason: Optional[str] = Field(default=None, nullable=True)

    userId: Optional[uuid.UUID] = Field(
        default=None, foreign_key="users.id"
    )
    user: Optional["Users"] = Relationship(
        back_populates="kyc",
        sa_relationship_kwargs={"lazy": "selectin"},
    )

    date: datetime = Field(default_factory=utc_now)


class Transactions(SQLModel, table=True):
    __tablename__ = "transactions"

    id: uuid.UUID = Field(
        default_factory=uuid.uuid4,
        sa_column=Column(
            pg.UUID,
            nullable=False,
            primary_key=True,
        ),
    )

    status: TransactionStatus = Field(default=TransactionStatus.PENDING)
    type: TransactionType = Field(default=TransactionType.TRANSFER)
    amount: int
    narration: Optional[str] = Field(default=None, min_length=3)
    reference: str = Field(unique=True)

    date: datetime = Field(default_factory=utc_now)

    senderId: Optional[uuid.UUID] = Field(
        default=None, foreign_key="users.id", index=True
    )
    recipientId: Optional[uuid.UUID] = Field(
        default=None, foreign_key="users.id", index=True
    )

    sender: Optional["Users"] = Relationship(
        back_populates="transactions_sent",
        sa_relationship_kwargs={
            "foreign_keys": "[Transactions.senderId]",
            "lazy": "selectin",
        },
    )

    recipient: Optional["Users"] = Relationship(
        back_populates="transactions_received",
        sa_relationship_kwargs={
            "foreign_keys": "[Transactions.recipientId]",
            "lazy": "selectin",
        },
    )

    withdrawal_info: Optional[dict] = Field(
        default=None, sa_column=Column(pg.JSONB, nullable=True, default=None)
    )