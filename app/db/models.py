import os
import secrets
from datetime import datetime

import sqlalchemy.sql
from sqlalchemy import (
    BigInteger,
    Boolean,
    Column,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Table,
    UniqueConstraint,
    JSON,
    and_,
    func,
    select,
)
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship, column_property
from sqlalchemy.sql.expression import text

from app.config.env import SUBSCRIPTION_URL_PREFIX
from app.db.base import Base
from app.models.node import NodeStatus
from app.models.proxy import (
    InboundHostFingerprint,
    InboundHostSecurity,
    ProxyTypes,
)
from app.models.user import (
    ReminderType,
    UserDataUsageResetStrategy,
    UserStatus,
    UserExpireStrategy,
)

admins_services = Table(
    "admins_services",
    Base.metadata,
    Column("admin_id", ForeignKey("admins.id"), primary_key=True),
    Column("service_id", ForeignKey("services.id"), primary_key=True),
)

inbounds_services = Table(
    "inbounds_services",
    Base.metadata,
    Column("inbound_id", ForeignKey("inbounds.id"), primary_key=True),
    Column("service_id", ForeignKey("services.id"), primary_key=True),
)

users_services = Table(
    "users_services",
    Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("service_id", ForeignKey("services.id"), primary_key=True),
)


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True)
    username = Column(String(32), unique=True, index=True)
    hashed_password = Column(String(128))
    users = relationship("User", back_populates="admin")
    services = relationship(
        "Service",
        secondary=admins_services,
        back_populates="admins",
        lazy="joined",
    )
    enabled = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default=sqlalchemy.sql.true(),
    )
    all_services_access = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default=sqlalchemy.sql.false(),
    )
    modify_users_access = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default=sqlalchemy.sql.true(),
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    is_sudo = Column(Boolean, default=False)
    password_reset_at = Column(DateTime)
    subscription_url_prefix = Column(
        String(256),
        nullable=False,
        default="",
        server_default=sqlalchemy.sql.text(""),
    )

    @property
    def service_ids(self):
        return [service.id for service in self.services]

    @classmethod
    def __declare_last__(cls):
        cls.users_data_usage = column_property(
            select(func.coalesce(func.sum(User.lifetime_used_traffic), 0))
            .where(User.admin_id == cls.id)
            .correlate_except(User)
            .scalar_subquery()
        )


class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True)
    name = Column(String(64))
    admins = relationship(
        "Admin", secondary=admins_services, back_populates="services"
    )
    users = relationship(
        "User", secondary=users_services, back_populates="services"
    )
    inbounds = relationship(
        "Inbound", secondary=inbounds_services, back_populates="services"
    )

    @property
    def inbound_ids(self):
        return [inbound.id for inbound in self.inbounds]

    @property
    def user_ids(self):
        return [user.id for user in self.users]


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(32), unique=True, index=True)
    key = Column(String(64), unique=True)
    activated = Column(Boolean, nullable=False, default=True)
    enabled = Column(
        Boolean,
        nullable=False,
        default=True,
        server_default=sqlalchemy.sql.true(),
    )
    removed = Column(
        Boolean,
        nullable=False,
        default=False,
        server_default=sqlalchemy.sql.false(),
    )
    services = relationship(
        "Service",
        secondary=users_services,
        back_populates="users",
        lazy="joined",
    )
    inbounds = relationship(
        "Inbound",
        secondary="join(users_services, inbounds_services, inbounds_services.c.service_id == users_services.c.service_id)"
        ".join(Inbound, Inbound.id == inbounds_services.c.inbound_id)",
        viewonly=True,
        distinct_target_key=True,
    )
    used_traffic = Column(BigInteger, default=0)
    lifetime_used_traffic = Column(
        BigInteger, default=0, server_default="0", nullable=False
    )
    traffic_reset_at = Column(DateTime)
    node_usages = relationship(
        "NodeUserUsage",
        back_populates="user",
        cascade="all,delete,delete-orphan",
    )
    notification_reminders = relationship(
        "NotificationReminder",
        back_populates="user",
        cascade="all,delete,delete-orphan",
    )
    data_limit = Column(BigInteger)
    data_limit_reset_strategy = Column(
        Enum(UserDataUsageResetStrategy),
        nullable=False,
        default=UserDataUsageResetStrategy.no_reset,
    )
    ip_limit = Column(Integer, nullable=False, default=-1)
    settings = Column(String(1024))
    expire_strategy = Column(
        Enum(UserExpireStrategy),
        nullable=False,
        default=UserExpireStrategy.NEVER,
    )
    expire_date = Column(DateTime)
    usage_duration = Column(BigInteger)
    activation_deadline = Column(DateTime)
    admin_id = Column(Integer, ForeignKey("admins.id"))
    admin = relationship("Admin", back_populates="users")
    sub_updated_at = Column(DateTime)
    sub_last_user_agent = Column(String(512))
    sub_revoked_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    note = Column(String(500))
    online_at = Column(DateTime)
    edit_at = Column(DateTime)

    @property
    def service_ids(self):
        return [service.id for service in self.services]

    @hybrid_property
    def expired(self):
        if self.expire_strategy == "fixed_date":
            return self.expire_date < datetime.utcnow()
        return False

    @expired.expression
    def expired(cls):
        return and_(
            cls.expire_strategy == "fixed_date", cls.expire_date < func.now()
        )

    @hybrid_property
    def data_limit_reached(self):
        if self.data_limit is not None:
            return self.used_traffic >= self.data_limit
        return False

    @data_limit_reached.expression
    def data_limit_reached(cls):
        return and_(
            cls.data_limit.isnot(None), cls.used_traffic >= cls.data_limit
        )

    @hybrid_property
    def is_active(self):
        return (
            self.enabled
            and not self.expired
            and not self.data_limit_reached
            and not self.removed
        )

    @is_active.expression
    def is_active(cls):
        return and_(
            cls.enabled == True,
            ~cls.expired,
            ~cls.data_limit_reached,
            ~cls.removed,
        )

    @property
    def status(self):
        return UserStatus.ACTIVE if self.is_active else UserStatus.INACTIVE

    @property
    def subscription_url(self):
        prefix = self.admin.subscription_url_prefix or SUBSCRIPTION_URL_PREFIX
        return (
            prefix.replace("*", secrets.token_hex(8))
            + f"/sub/{self.username}/{self.key}"
        )

    @hybrid_property
    def owner_username(self):
        return self.admin.username


class Backend(Base):
    __tablename__ = "backends"

    id = Column(Integer, primary_key=True)
    name = Column(String(64), nullable=False)
    node_id = Column(Integer, ForeignKey("nodes.id"), index=True)
    node = relationship("Node", back_populates="backends")
    backend_type = Column(String(32), nullable=False)
    version = Column(String(32))
    running = Column(Boolean, default=True, nullable=False)


class Inbound(Base):
    __tablename__ = "inbounds"
    __table_args__ = (UniqueConstraint("node_id", "tag"),)

    id = Column(Integer, primary_key=True)
    protocol = Column(Enum(ProxyTypes))
    tag = Column(String(256), nullable=False)
    config = Column(String(512), nullable=False)
    node_id = Column(Integer, ForeignKey("nodes.id"), index=True)
    node = relationship("Node", back_populates="inbounds")
    services = relationship(
        "Service", secondary=inbounds_services, back_populates="inbounds"
    )
    hosts = relationship(
        "InboundHost",
        back_populates="inbound",
        cascade="all, delete, delete-orphan",
    )

    @property
    def service_ids(self):
        return [service.id for service in self.services]


class InboundHost(Base):
    __tablename__ = "hosts"

    id = Column(Integer, primary_key=True)
    remark = Column(String(256), nullable=False)
    address = Column(String(256), nullable=False)
    port = Column(Integer)
    path = Column(String(256))
    sni = Column(String(1024))
    host = Column(String(1024))
    security = Column(
        Enum(InboundHostSecurity),
        nullable=False,
        default=InboundHostSecurity.inbound_default,
    )
    alpn = Column(
        String(32),
        server_default=sqlalchemy.sql.null(),
    )
    fingerprint = Column(
        Enum(InboundHostFingerprint),
        nullable=False,
        default=InboundHostSecurity.none,
        server_default=InboundHostSecurity.none.name,
    )

    mux = Column(
        Boolean,
        default=False,
        nullable=False,
        server_default=sqlalchemy.sql.false(),
    )
    fragment = Column(JSON())

    inbound_id = Column(Integer, ForeignKey("inbounds.id"), nullable=False)
    inbound = relationship("Inbound", back_populates="hosts")
    allowinsecure = Column(Boolean, default=False)
    is_disabled = Column(Boolean, default=False)
    weight = Column(Integer, default=1, nullable=False, server_default="1")


class System(Base):
    __tablename__ = "system"

    id = Column(Integer, primary_key=True)
    uplink = Column(BigInteger, default=0)
    downlink = Column(BigInteger, default=0)


class JWT(Base):
    __tablename__ = "jwt"

    id = Column(Integer, primary_key=True)
    secret_key = Column(
        String(64), nullable=False, default=lambda: os.urandom(32).hex()
    )


class TLS(Base):
    __tablename__ = "tls"

    id = Column(Integer, primary_key=True)
    key = Column(String(4096), nullable=False)
    certificate = Column(String(2048), nullable=False)


class Node(Base):
    __tablename__ = "nodes"
    __table_args__ = (UniqueConstraint("address", "port"),)
    id = Column(Integer, primary_key=True)
    name = Column(String(256), unique=True)
    connection_backend = Column(String(32))
    address = Column(String(256))
    port = Column(Integer)
    xray_version = Column(String(32))
    inbounds = relationship(
        "Inbound", back_populates="node", cascade="all, delete"
    )
    backends = relationship(
        "Backend", back_populates="node", cascade="all, delete"
    )
    status = Column(
        Enum(NodeStatus), nullable=False, default=NodeStatus.unhealthy
    )
    last_status_change = Column(DateTime, default=datetime.utcnow)
    message = Column(String(1024))
    created_at = Column(DateTime, default=datetime.utcnow)
    uplink = Column(BigInteger, default=0)
    downlink = Column(BigInteger, default=0)
    user_usages = relationship(
        "NodeUserUsage",
        back_populates="node",
        cascade="all, delete, delete-orphan",
    )
    usages = relationship(
        "NodeUsage",
        back_populates="node",
        cascade="all, delete, delete-orphan",
    )
    usage_coefficient = Column(
        Float, nullable=False, server_default=text("1.0"), default=1
    )

    @property
    def inbound_ids(self):
        return [inbound.id for inbound in self.inbounds]


class NodeUserUsage(Base):
    __tablename__ = "node_user_usages"
    __table_args__ = (UniqueConstraint("created_at", "user_id", "node_id"),)

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, nullable=False)  # one hour per record
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="node_usages")
    node_id = Column(Integer, ForeignKey("nodes.id"))
    node = relationship("Node", back_populates="user_usages")
    used_traffic = Column(BigInteger, default=0)


class NodeUsage(Base):
    __tablename__ = "node_usages"
    __table_args__ = (UniqueConstraint("created_at", "node_id"),)

    id = Column(Integer, primary_key=True)
    created_at = Column(DateTime, nullable=False)  # one hour per record
    node_id = Column(Integer, ForeignKey("nodes.id"))
    node = relationship("Node", back_populates="usages")
    uplink = Column(BigInteger, default=0)
    downlink = Column(BigInteger, default=0)


class NotificationReminder(Base):
    __tablename__ = "notification_reminders"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="notification_reminders")
    type = Column(Enum(ReminderType), nullable=False)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)


class Settings(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, server_default=text("0"))
    subscription = Column(JSON, nullable=False)
    telegram = Column(JSON)
