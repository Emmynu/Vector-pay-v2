from pydantic import BaseModel, Field
from typing import Optional

class TransactionPinSchema(BaseModel):
    pin:str = Field(min_length=4, max_length=4, pattern=r"^\d{4}$",examples=["1234"])
    # currentPin: Optional[str] = Field(min_length=4, max_length=4, pattern=r"^\d{4}$",examples=["1234"])

class UpdateTransactionPinSchema(BaseModel):
    pin:str = Field(min_length=4, max_length=4, pattern=r"^\d{4}$",examples=["1234"])
    currentPin: Optional[str] = Field(min_length=4, max_length=4, pattern=r"^\d{4}$",examples=["1234"])