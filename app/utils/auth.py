from datetime import datetime, timedelta
from functools import lru_cache
from typing import Union

import jwt
from jwt import DecodeError

from app.db import GetDB, get_jwt_secret_key
from config import JWT_ACCESS_TOKEN_EXPIRE_MINUTES


@lru_cache(maxsize=None)
def get_secret_key():
    with GetDB() as db:
        return get_jwt_secret_key(db)


def create_admin_token(username: str, is_sudo=False) -> str:
    data = {
        "sub": username,
        "access": "sudo" if is_sudo else "admin",
        "iat": datetime.utcnow(),
    }
    if JWT_ACCESS_TOKEN_EXPIRE_MINUTES > 0:
        expire = datetime.utcnow() + timedelta(minutes=JWT_ACCESS_TOKEN_EXPIRE_MINUTES)
        data["exp"] = expire
    encoded_jwt = jwt.encode(data, get_secret_key(), algorithm="HS256")
    return encoded_jwt


def get_admin_payload(token: str) -> Union[dict, None]:
    try:
        payload = jwt.decode(token, get_secret_key(), algorithms=["HS256"])
    except DecodeError:
        return

    username: str = payload.get("sub")
    access: str = payload.get("access")
    if not username or access not in ("admin", "sudo"):
        return
    try:
        created_at = datetime.utcfromtimestamp(payload["iat"])
    except KeyError:
        created_at = None

    return {
        "username": username,
        "is_sudo": access == "sudo",
        "created_at": created_at,
    }