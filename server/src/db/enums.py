from enum import Enum, IntEnum

class Roles(str, Enum):
    USER = "user"
    ADMIN = "admin"


class Tiers(IntEnum):
    TIER_1 = 1
    TIER_2 = 2
    TIER_3 = 3


class TierLimits(str, Enum):
    TIER_1 = "50/minute"
    TIER_2 = "100/minute"
    TIER_3 = "200/minute"



class KycStatus(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    DECLINED = "declined"
    UNVERIFIED = "unverified"


class AdminKycStatus(str, Enum):
    VERIFIED = "verified"
    DECLINED = "declined"


class AdminKycStatusFilter(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    DECLINED = "declined"
    

class TransactionStatus(str, Enum):
    PENDING = "pending"
    SUCCESSFUL = "successful"
    FAILED = "failed"

class WithdrawTransactionStatus(str, Enum):
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


class BroadCastTo(str, Enum):
    All_USERS = "1"
    NEW_USERS = "2"  
    INACTIVE_USERS = "3"

class Prefrences(str, Enum):
    BIOMETRICS =  "isBiometricsEnabled"
    MARKETING = "isMarketingEnabled"