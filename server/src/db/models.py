from sqlmodel import SQLModel, Field, Column
import sqlalchemy.dialects.postgresql as pg
import uuid
from datetime import datetime


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
    password: str = Field(exclude=True)
    balance: int = Field(default=0)
    password_reset_count: int = Field(default=0)
    
    accountNumber: str 
    isVerified: bool = Field(sa_column=Column(
        pg.BOOLEAN,
        default=False,
    ))

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