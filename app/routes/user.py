import asyncio
import logging
from datetime import datetime, timedelta
from enum import Enum

import sqlalchemy
from fastapi import APIRouter
from fastapi import HTTPException, Query
from fastapi_pagination.ext.sqlalchemy import paginate
from fastapi_pagination.links import Page

from app import marznode
from app.db import crud, User
from app.db.models import Service
from app.dependencies import (
    DBDep,
    AdminDep,
    SudoAdminDep,
    UserDep,
    StartDateDep,
    EndDateDep,
    ModifyUsersAccess,
)
from app.models.service import ServiceResponse
from app.models.user import (
    UserCreate,
    UserModify,
    UserResponse,
    UserUsageSeriesResponse,
)
from app.utils import report

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/users", tags=["User"])


class UsersSortingOptions(str, Enum):
    USERNAME = "username"
    USED_TRAFFIC = "used_traffic"
    DATA_LIMIT = "data_limit"
    EXPIRE_DATE = "expire_date"
    CREATED_AT = "created_at"


user_filters = [
    "username",
    "is_active",
    "activated",
    "expired",
    "data_limit_reached",
    "enabled",
    "owner_username",
]


@router.get("", response_model=Page[UserResponse])
def get_users(
    db: DBDep,
    admin: AdminDep,
    username: list[str] = Query(None),
    order_by: UsersSortingOptions = Query(None),
    descending: bool = Query(False),
    is_active: bool | None = Query(None),
    activated: bool | None = Query(None),
    expired: bool | None = Query(None),
    data_limit_reached: bool | None = Query(None),
    enabled: bool | None = Query(None),
    owner_username: str | None = Query(None),
):
    """
    Filters users based on the options
    """
    dbadmin = crud.get_admin(db, admin.username)

    query = db.query(User).filter(User.removed == False)

    admin = dbadmin if not admin.is_sudo else None

    for name in user_filters:
        value = locals().get(name)
        if value is not None:
            if name == "username":
                if len(username) > 1:
                    query = query.filter(User.username.in_(username))
                else:
                    query = query.filter(
                        User.username.ilike(f"%{username[0]}%")
                    )
            elif name == "owner_username":
                if not dbadmin.is_sudo:
                    raise HTTPException(403, "You're not allowed.")
                filter_admin = crud.get_admin(db, value)
                if not filter_admin:
                    raise HTTPException(404, "owner_username not found.")
                query = query.filter(User.admin_id == filter_admin.id)
            else:
                query = query.filter(getattr(User, name) == value)

    if admin:
        query = query.filter(User.admin == admin)

    if order_by:
        order_column = getattr(User, order_by)
        if descending:
            order_column = order_column.desc()
        query = query.order_by(order_column)

    return paginate(db, query)


@router.post("", response_model=UserResponse)
async def add_user(new_user: UserCreate, db: DBDep, admin: AdminDep):
    """
    Add a new user

    - **username** must have 3 to 32 characters and is allowed to contain a-z, 0-9, and underscores in between
    - **expire_date** must be a datetime
    - **data_limit** must be in Bytes, e.g. 1073741824B = 1GB
    - **services** list of service ids
    """

    try:
        db_user = crud.create_user(
            db,
            new_user,
            admin=crud.get_admin(db, admin.username),
            allowed_services=(
                admin.service_ids
                if not admin.is_sudo and not admin.all_services_access
                else None
            ),
        )
    except sqlalchemy.exc.IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="User already exists")

    user = UserResponse.model_validate(db_user)
    marznode.operations.update_user(user=db_user)
    asyncio.ensure_future(
        report.user_created(user=user, user_id=db_user.id, by=admin)
    )
    logger.info("New user `%s` added", db_user.username)
    return user


@router.post("/reset")
async def reset_users_data_usage(db: DBDep, admin: SudoAdminDep):
    """
    Reset all users data usage,
    You will need to restart for this to take effect for now
    """
    dbadmin = crud.get_admin(db, admin.username)
    crud.reset_all_users_data_usage(db=db, admin=dbadmin)
    return {}


@router.delete("/expired")
async def delete_expired(
    passed_time: int,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Delete expired users
    - **passed_time** must be a timestamp
    - This function will delete all expired users that meet the specified number of days passed and can't be undone.
    """

    dbadmin = crud.get_admin(db, admin.username)

    db_users = crud.get_users(
        db=db,
        expired=True,
        admin=dbadmin if not admin.is_sudo else None,
    )

    current_time = datetime.utcnow()
    expiration_threshold = current_time - timedelta(seconds=passed_time)
    expired_users = [
        user
        for user in db_users
        if user.expire_date is not None
        and user.expire_date <= expiration_threshold
    ]
    if not expired_users:
        raise HTTPException(status_code=404, detail="No expired user found.")

    for db_user in expired_users:
        crud.remove_user(db, db_user)

        asyncio.ensure_future(
            report.user_deleted(username=db_user.username, by=admin)
        )

        logger.info("User `%s` removed", db_user.username)

    return {}


@router.get("/{username}", response_model=UserResponse)
def get_user(db_user: UserDep):
    """
    Get users information
    """
    return db_user


@router.put("/{username}", response_model=UserResponse)
async def modify_user(
    db_user: UserDep,
    modifications: UserModify,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Modify a user

    - set **data_limit** to 0 to make the user unlimited in data, null for no change
    """
    active_before = db_user.is_active

    old_inbounds = {(i.node_id, i.protocol, i.tag) for i in db_user.inbounds}
    new_user = crud.update_user(
        db,
        db_user,
        modifications,
        allowed_services=(
            admin.service_ids
            if not admin.is_sudo and not admin.all_services_access
            else None
        ),
    )
    active_after = new_user.is_active
    new_inbounds = {(i.node_id, i.protocol, i.tag) for i in new_user.inbounds}

    inbound_change = old_inbounds != new_inbounds

    if (
        inbound_change and new_user.is_active
    ) or active_before != active_after:
        marznode.operations.update_user(
            new_user, old_inbounds, remove=not db_user.is_active
        )
        db_user.activated = db_user.is_active
        db.commit()

    asyncio.ensure_future(
        report.user_updated(
            user=UserResponse.model_validate(db_user), by=admin
        )
    )

    logger.info("User `%s` modified", db_user.username)

    if active_before != active_after:
        asyncio.ensure_future(
            report.status_change(
                username=db_user.username,
                activation=db_user.activated,
                user=UserResponse.model_validate(db_user),
                by=admin,
            )
        )

        logger.info(
            "User `%s` activation changed from `%s` to `%s`",
            db_user.username,
            active_before,
            active_after,
        )

    return db_user


@router.delete("/{username}")
async def remove_user(
    db_user: UserDep,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Remove a user
    """
    marznode.operations.update_user(db_user, remove=True)

    crud.remove_user(db, db_user)
    db.flush()

    asyncio.ensure_future(
        report.user_deleted(username=db_user.username, by=admin)
    )
    logger.info("User %s deleted", db_user.username)
    return {}


@router.get("/{username}/services", response_model=Page[ServiceResponse])
def get_user_services(user: UserDep, db: DBDep, admin: AdminDep):
    """
    Get user services
    """

    query = (
        db.query(Service)
        .join(Service.users)
        .where(User.username == user.username)
    )

    if not admin.is_sudo and not admin.all_services_access:
        query.filter(Service.id.in_(admin.service_ids))

    return paginate(query)


@router.post("/{username}/reset", response_model=UserResponse)
async def reset_user_data_usage(
    db_user: UserDep,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Reset user data usage
    """
    was_active = db_user.is_active
    db_user = crud.reset_user_data_usage(db, db_user)

    if db_user.is_active and not was_active:
        marznode.operations.update_user(db_user)
        db_user.activated = True
        db.commit()

    user = UserResponse.model_validate(db_user)
    asyncio.ensure_future(report.user_data_usage_reset(user=user, by=admin))

    logger.info("User `%s`'s usage was reset", db_user.username)

    return user


@router.post("/{username}/enable", response_model=UserResponse)
async def enable_user(
    db_user: UserDep,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Enables a user
    """
    if db_user.enabled:
        raise HTTPException(409, "User is already enabled")

    db_user.enabled = True

    if db_user.is_active:
        db_user.activated = True
        marznode.operations.update_user(db_user)

    db.commit()

    user = UserResponse.model_validate(db_user)

    logger.info("User `%s` has been enabled", db_user.username)

    return user


@router.post("/{username}/disable", response_model=UserResponse)
async def disable_user(
    db_user: UserDep,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Disables a user
    """
    if not db_user.enabled:
        raise HTTPException(409, "User is not enabled")
    db_user.enabled = False
    db_user.activated = False
    db.commit()

    marznode.operations.update_user(db_user, remove=True)

    user = UserResponse.model_validate(db_user)

    logger.info("User `%s` has been disabled", db_user.username)

    return user


@router.post("/{username}/revoke_sub", response_model=UserResponse)
async def revoke_user_subscription(
    db_user: UserDep,
    db: DBDep,
    admin: AdminDep,
    modify_access: ModifyUsersAccess,
):
    """
    Revoke users subscription (Subscription link and proxies)
    """
    db_user = crud.revoke_user_sub(db, db_user)

    if db_user.is_active:
        marznode.operations.update_user(db_user, remove=True)
        marznode.operations.update_user(db_user)
    user = UserResponse.model_validate(db_user)
    asyncio.ensure_future(
        report.user_subscription_revoked(user=user, by=admin)
    )

    logger.info("User %s subscription revoked", db_user.username)

    return user


@router.get("/{username}/usage", response_model=UserUsageSeriesResponse)
def get_user_usage(
    db: DBDep, db_user: UserDep, start_date: StartDateDep, end_date: EndDateDep
):
    """
    Get users usage
    """

    return crud.get_user_usages(db, db_user, start_date, end_date)


@router.put("/{username}/set-owner", response_model=UserResponse)
def set_owner(
    username: str, admin_username: str, db: DBDep, admin: SudoAdminDep
):
    db_user = crud.get_user(db, username)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    new_admin = crud.get_admin(db, username=admin_username)
    if not new_admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    db_user = crud.set_owner(db, db_user, new_admin)
    user = UserResponse.model_validate(db_user)

    logger.info(
        "`%s`'s owner successfully set to `%s`", user.username, admin.username
    )

    return user
