from enum import Enum, IntEnum

class KycStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    DECLINED = "declined"
    UNVERIFIED = "unverified"


class TransactionStatus(str, Enum):
    PENDING = "pending"
    SUCCESSFUL = "successful"
    FAILED = "failed"


class TransactionType(str, Enum):
    DEPOSIT = "deposit"
    TRANSFER = "transfer"
    WITHDRAW = "withdraw"

class Operators(str, Enum):
   INCREMENT = "+"
   DECREMENT = "-"

class DailyLimit(IntEnum):
    TIER_ONE = 200000
    TIER_TWO = 500000
    TIER_THREE = 1000000