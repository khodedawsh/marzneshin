import secrets
from datetime import datetime
from enum import Enum
from typing import Annotated

from pydantic import (
    ConfigDict,
    BaseModel,
    Field,
    StringConstraints,
    model_validator,
)

USERNAME_REGEXP = r"^\w{3,32}$"


class ReminderType(str, Enum):
    expiration_date = "expiration_date"
    data_usage = "data_usage"


class UserStatus(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"


class UserDataUsageResetStrategy(str, Enum):
    no_reset = "no_reset"
    day = "day"
    week = "week"
    month = "month"
    year = "year"


class UserExpireStrategy(str, Enum):
    NEVER = "never"
    FIXED_DATE = "fixed_date"
    START_ON_FIRST_USE = "start_on_first_use"


class User(BaseModel):
    id: int | None = None
    username: Annotated[
        str, StringConstraints(to_lower=True, pattern=USERNAME_REGEXP)
    ]
    expire_strategy: UserExpireStrategy
    expire_date: datetime | None = Field(None)
    usage_duration: int | None = Field(None)
    activation_deadline: datetime | None = Field(None)
    key: str = Field(default_factory=lambda: secrets.token_hex(16))
    data_limit: int | None = Field(
        ge=0, default=None, description="data_limit can be 0 or greater"
    )
    data_limit_reset_strategy: UserDataUsageResetStrategy = (
        UserDataUsageResetStrategy.no_reset
    )
    note: Annotated[str, Field(max_length=500)] | None = None
    sub_updated_at: datetime | None = Field(None)
    sub_last_user_agent: str | None = Field(None)
    online_at: datetime | None = Field(None)

    model_config = ConfigDict(from_attributes=True)


class UserCreate(User):
    service_ids: list[int] = Field([])
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "username": "user1234",
                "services": [1, 2, 3],
                "expire_strategy": "start_on_first_use",
                "usage_duration": 86400 * 14,
                "activation_deadline": "2024-11-03T20:30:00",
                "data_limit": 0,
                "data_limit_reset_strategy": "no_reset",
                "note": "",
            }
        }
    )

    @model_validator(mode="after")
    def validate_expiry(self):
        if self.expire_strategy == UserExpireStrategy.START_ON_FIRST_USE:
            if not self.usage_duration:
                raise ValueError(
                    "User expire_strategy can not be start_on_first_use without a valid usage_duration."
                )
        elif (
            self.expire_strategy == UserExpireStrategy.FIXED_DATE
            and not self.expire_date
        ):
            raise ValueError(
                "User expire_strategy can not be fixed_date without a valid expire date."
            )
        return self


class UserModify(UserCreate):
    service_ids: list[int] | None = Field(None)
    data_limit_reset_strategy: UserDataUsageResetStrategy | None = Field(None)
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "username": "mammad1234",
                "service_ids": [1, 2, 3],
                "expire_strategy": "fixed_date",
                "expire_date": "2023-11-03T20:30:00",
                "data_limit": 0,
                "data_limit_reset_strategy": "no_reset",
                "note": "",
            }
        }
    )


class UserResponse(User):
    id: int
    activated: bool
    is_active: bool
    expired: bool
    data_limit_reached: bool
    enabled: bool
    used_traffic: int
    lifetime_used_traffic: int
    created_at: datetime
    service_ids: list[int]
    subscription_url: str
    owner_username: str
    traffic_reset_at: datetime | None

    model_config = ConfigDict(from_attributes=True)


class UserUsage(BaseModel):
    used_traffic: int
    usage_date: datetime


class UserNodeUsageSeries(BaseModel):
    node_id: int | None = None
    node_name: str
    usages: list[tuple[int, int]]  # list[UserUsage]


class UserUsageSeriesResponse(BaseModel):
    username: str
    node_usages: list[UserNodeUsageSeries]
