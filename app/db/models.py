import os
from datetime import datetime

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
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql.expression import text

from app.db.base import Base
from app.models.node import NodeStatus
from app.models.proxy import (
    InboundHostALPN,
    InboundHostFingerprint,
    InboundHostSecurity,
    ProxyTypes,
)
from app.models.user import ReminderType, UserDataLimitResetStrategy, UserStatus


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

admins_services = Table(
    "admins_services",
    Base.metadata,
    Column("admin_id", ForeignKey("admins.id"), primary_key=True),
    Column("service_id", ForeignKey("services.id"), primary_key=True),
)


class Admin(Base):
    __tablename__ = "admins"

    id = Column(Integer, primary_key=True)
    username = Column(String(32), unique=True, index=True)
    hashed_password = Column(String(128))
    users = relationship("User", back_populates="admin")
    services = relationship(
        "Service", secondary=admins_services, back_populates="admins"
    )
    created_at = Column(DateTime, default=datetime.utcnow)
    is_sudo = Column(Boolean, default=False)
    password_reset_at = Column(DateTime)
    subscription_url_prefix = Column(String(256))


class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True)
    name = Column(String(64))
    users = relationship("User", secondary=users_services, back_populates="services")
    admins = relationship("Admin", secondary=admins_services, back_populates="services")
    inbounds = relationship(
        "Inbound", secondary=inbounds_services, back_populates="services"
    )


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    username = Column(String(32), unique=True, index=True)
    key = Column(String(64), unique=True)
    services = relationship(
        "Service", secondary=users_services, back_populates="users", lazy="joined"
    )
    inbounds = relationship(
        "Inbound",
        secondary="join(users_services, inbounds_services, inbounds_services.c.service_id == users_services.c.service_id)"
        ".join(Inbound, Inbound.id == inbounds_services.c.inbound_id)",
        viewonly=True,
        distinct_target_key=True,
        lazy="joined",
    )
    # proxies = relationship("Proxy", back_populates="user", cascade="all, delete-orphan")
    status = Column(Enum(UserStatus), nullable=False, default=UserStatus.active)
    used_traffic = Column(BigInteger, default=0)
    node_usages = relationship(
        "NodeUserUsage",
        back_populates="user",
        cascade="all,delete,delete-orphan",
        lazy="joined",
    )
    notification_reminders = relationship(
        "NotificationReminder",
        back_populates="user",
        cascade="all,delete,delete-orphan",
    )
    data_limit = Column(BigInteger)
    data_limit_reset_strategy = Column(
        Enum(UserDataLimitResetStrategy),
        nullable=False,
        default=UserDataLimitResetStrategy.no_reset,
    )
    ip_limit = Column(Integer, nullable=False, default=-1)
    settings = Column(String)
    usage_logs = relationship(
        "UserUsageResetLogs", back_populates="user", lazy="joined"
    )
    expire = Column(Integer)
    admin_id = Column(Integer, ForeignKey("admins.id"))
    admin = relationship("Admin", back_populates="users")
    sub_updated_at = Column(DateTime)
    sub_last_user_agent = Column(String(512))
    created_at = Column(DateTime, default=datetime.utcnow)
    note = Column(String(500))
    online_at = Column(DateTime)
    on_hold_expire_duration = Column(BigInteger)
    on_hold_timeout = Column(DateTime)
    edit_at = Column(DateTime)

    @property
    def lifetime_used_traffic(self):
        return (
            sum([log.used_traffic_at_reset for log in self.usage_logs])
            + self.used_traffic
        )

    @property
    def last_traffic_reset_time(self):
        return self.usage_logs[-1].reset_at if self.usage_logs else self.created_at


class UserUsageResetLogs(Base):
    __tablename__ = "user_usage_logs"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    user = relationship("User", back_populates="usage_logs")
    used_traffic_at_reset = Column(BigInteger, nullable=False)
    reset_at = Column(DateTime, default=datetime.utcnow)


class Inbound(Base):
    __tablename__ = "inbounds"
    __table_args__ = (UniqueConstraint("node_id", "tag"),)

    id = Column(Integer, primary_key=True)
    protocol = Column(Enum(ProxyTypes))
    tag = Column(String(256), nullable=False)
    config = Column(String(), nullable=False)
    node_id = Column(Integer, ForeignKey("nodes.id"), index=True)
    node = relationship("Node", back_populates="inbounds")
    services = relationship(
        "Service", secondary=inbounds_services, back_populates="inbounds"
    )
    hosts = relationship(
        "InboundHost", back_populates="inbound", cascade="all, delete, delete-orphan"
    )


class InboundHost(Base):
    __tablename__ = "hosts"

    id = Column(Integer, primary_key=True)
    remark = Column(String(256), nullable=False)
    address = Column(String(256), nullable=False)
    port = Column(Integer)
    path = Column(String(256))
    sni = Column(String(256))
    host = Column(String(256))
    service_id = Column(Integer, ForeignKey("services.id"), index=True)
    service = relationship("Service")
    security = Column(
        Enum(InboundHostSecurity),
        nullable=False,
        default=InboundHostSecurity.inbound_default,
    )
    alpn = Column(
        Enum(InboundHostALPN),
        nullable=False,
        default=InboundHostSecurity.none,
        server_default=InboundHostSecurity.none.name,
    )
    fingerprint = Column(
        Enum(InboundHostFingerprint),
        nullable=False,
        default=InboundHostSecurity.none,
        server_default=InboundHostSecurity.none.name,
    )

    inbound_id = Column(Integer, ForeignKey("inbounds.id"), nullable=False)
    inbound = relationship("Inbound", back_populates="hosts")
    allowinsecure = Column(Boolean, default=False)
    is_disabled = Column(Boolean, default=False)


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
    connection_backend = Column(String())
    address = Column(String(256))
    port = Column(Integer)
    xray_version = Column(String(32))
    inbounds = relationship("Inbound", back_populates="node", cascade="all, delete")
    status = Column(Enum(NodeStatus), nullable=False, default=NodeStatus.unhealthy)
    last_status_change = Column(DateTime, default=datetime.utcnow)
    message = Column(String(1024))
    created_at = Column(DateTime, default=datetime.utcnow)
    uplink = Column(BigInteger, default=0)
    downlink = Column(BigInteger, default=0)
    user_usages = relationship(
        "NodeUserUsage", back_populates="node", cascade="all, delete, delete-orphan"
    )
    usages = relationship(
        "NodeUsage", back_populates="node", cascade="all, delete, delete-orphan"
    )
    usage_coefficient = Column(
        Float, nullable=False, server_default=text("1.0"), default=1
    )


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
