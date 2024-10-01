import base64
import json
from collections import defaultdict
from datetime import datetime as dt, timedelta
from importlib import resources
from typing import Literal, Union, List, Type
from uuid import UUID

import exrex
from jdatetime import date as jd
from v2share import (
    V2Data,
    SingBoxConfig,
    ClashConfig,
    ClashMetaConfig,
    XrayConfig,
)
from v2share.base import BaseConfig
from v2share.links import LinksConfig

from app.config.env import (
    XRAY_SUBSCRIPTION_TEMPLATE,
    SINGBOX_SUBSCRIPTION_TEMPLATE,
    CLASH_SUBSCRIPTION_TEMPLATE,
    SUBSCRIPTION_PAGE_TEMPLATE,
)
from app.db import GetDB, crud
from app.models.proxy import (
    InboundHostSecurity,
)
from app.models.settings import SubscriptionSettings
from app.models.user import UserResponse, UserExpireStrategy
from app.templates import render_template
from app.utils.keygen import gen_uuid, gen_password
from app.utils.system import get_public_ip, readable_size

SERVER_IP = get_public_ip()

ACTIVITY_EMOJIS = {
    True: "✅",
    False: "❌",
}

subscription_handlers: dict[str, Type[BaseConfig]] = {
    "links": LinksConfig,
    "xray": XrayConfig,
    "clash-meta": ClashMetaConfig,
    "clash": ClashConfig,
    "sing-box": SingBoxConfig,
}

handlers_templates = {
    LinksConfig: None,
    XrayConfig: XRAY_SUBSCRIPTION_TEMPLATE
    or resources.files("app.templates") / "xray.json",
    ClashConfig: CLASH_SUBSCRIPTION_TEMPLATE,
    ClashMetaConfig: CLASH_SUBSCRIPTION_TEMPLATE,
    SingBoxConfig: SINGBOX_SUBSCRIPTION_TEMPLATE
    or resources.files("app.templates") / "sing-box.json",
}


def generate_subscription_template(
    db_user, subscription_settings: SubscriptionSettings
):
    links = generate_subscription(
        user=db_user,
        config_format="links",
        use_placeholder=not db_user.is_active
        and subscription_settings.placeholder_if_disabled,
        placeholder_remark=subscription_settings.placeholder_remark,
        shuffle=subscription_settings.shuffle_configs,
    ).split()
    return render_template(
        SUBSCRIPTION_PAGE_TEMPLATE,
        {"user": UserResponse.model_validate(db_user), "links": links},
    )


def generate_subscription(
    user: "UserResponse",
    config_format: Literal["links", "xray", "clash-meta", "clash", "sing-box"],
    as_base64: bool = False,
    use_placeholder: bool = False,
    placeholder_remark: str = "disabled",
    shuffle: bool = False,
) -> str:
    extra_data = UserResponse.model_validate(user).model_dump(
        exclude={"subscription_url", "services", "inbounds"}
    )
    format_variables = setup_format_variables(extra_data)

    if config_format not in subscription_handlers.keys():
        raise ValueError(f'Unsupported format "{config_format}"')

    subscription_handler_class = subscription_handlers[config_format]
    if template_path := handlers_templates[subscription_handler_class]:
        subscription_handler = subscription_handler_class(
            template_path=template_path
        )
    else:
        subscription_handler = subscription_handler_class()

    if use_placeholder:
        placeholder_config = V2Data(
            "vmess",
            placeholder_remark.format_map(format_variables),
            "127.0.0.1",
            80,
        )
        configs = [placeholder_config]

    else:
        configs = generate_user_configs(
            user.inbounds,
            user.key,
            format_variables,
        )

    subscription_handler.add_proxies(configs)
    config = subscription_handler.render(sort=True, shuffle=shuffle)

    return (
        config if not as_base64 else base64.b64encode(config.encode()).decode()
    )


def format_time_left(seconds_left: int) -> str:
    if not seconds_left or seconds_left <= 0:
        return "∞"

    minutes, seconds = divmod(seconds_left, 60)
    hours, minutes = divmod(minutes, 60)
    days, hours = divmod(hours, 24)
    months, days = divmod(days, 30)

    result = []
    if months:
        result.append(f"{months}m")
    if days:
        result.append(f"{days}d")
    if hours and (days < 7):
        result.append(f"{hours}h")
    if minutes and not (months or days):
        result.append(f"{minutes}m")
    if seconds and not (months or days):
        result.append(f"{seconds}s")
    return " ".join(result)


def setup_format_variables(extra_data: dict) -> dict:
    expire_strategy = extra_data.get("expire_strategy")
    expire_datetime = extra_data.get("expire_date")
    usage_duration = extra_data.get("usage_duration")

    if expire_strategy != UserExpireStrategy.START_ON_FIRST_USE:
        if expire_datetime is not None:
            seconds_left = (expire_datetime - dt.utcnow()).total_seconds()
            expire_date = expire_datetime.date()
            jalali_expire_date = jd.fromgregorian(
                year=expire_date.year,
                month=expire_date.month,
                day=expire_date.day,
            ).strftime("%Y-%m-%d")
            days_left = (expire_datetime - dt.utcnow()).days + 1
            time_left = format_time_left(seconds_left)
        else:
            days_left, time_left, expire_date, jalali_expire_date = "∞" * 4
    else:
        if usage_duration is not None and usage_duration >= 0:
            days_left = timedelta(seconds=usage_duration).days
            time_left = format_time_left(usage_duration)
            expire_date = "-"
            jalali_expire_date = "-"
        else:
            days_left, time_left, expire_date, jalali_expire_date = "∞" * 4

    if extra_data.get("data_limit"):
        data_limit = readable_size(extra_data["data_limit"])
        data_left = extra_data["data_limit"] - extra_data["used_traffic"]
        if data_left < 0:
            data_left = 0
        data_left = readable_size(data_left)
    else:
        data_limit, data_left = "∞" * 2

    status_emoji = ACTIVITY_EMOJIS.get(extra_data.get("is_active")) or ""

    format_variables = defaultdict(
        lambda: "<missing>",
        {
            "SERVER_IP": SERVER_IP,
            "USERNAME": extra_data.get("username", "{USERNAME}"),
            "DATA_USAGE": readable_size(extra_data.get("used_traffic")),
            "DATA_LIMIT": data_limit,
            "DATA_LEFT": data_left,
            "DAYS_LEFT": days_left,
            "EXPIRE_DATE": expire_date,
            "JALALI_EXPIRE_DATE": jalali_expire_date,
            "TIME_LEFT": time_left,
            "STATUS_EMOJI": status_emoji,
        },
    )

    return format_variables


def generate_user_configs(
    inbounds: list,
    key: str,
    format_variables: dict,
) -> Union[List, str]:

    configs = []

    for inb in inbounds:
        inb_id, inbound, protocol, tag = (
            inb.id,
            json.loads(inb.config),
            inb.protocol,
            inb.tag,
        )

        format_variables.update({"PROTOCOL": protocol.name})
        if not inbound:
            continue

        format_variables.update(
            {"TRANSPORT": inbound.get("network", "<missing>")}
        )
        with GetDB() as db:
            hosts = crud.get_inbound_hosts(db, inb_id)

        for host in hosts:
            if host.is_disabled:
                continue

            data = V2Data(
                protocol.value,
                host.remark.format_map(format_variables),
                exrex.getone(host.address).format_map(format_variables),
                host.port or inbound["port"],
                transport_type=inbound.get("network"),
                sni=(
                    exrex.getone(host.sni)
                    if host.sni
                    else inbound.get("sni", "")
                ),
                host=(
                    exrex.getone(host.host)
                    if host.host
                    else inbound.get("host", "")
                ),
                tls=(
                    None
                    if host.security == InboundHostSecurity.inbound_default
                    else host.security.value
                )
                or inbound.get("tls"),
                header_type=inbound.get("header_type"),
                alpn=host.alpn if host.alpn != "none" else None,
                path=(
                    host.path.format_map(format_variables)
                    if host.path
                    else inbound.get("path")
                ),
                fingerprint=host.fingerprint.value or inbound.get("fp"),
                reality_pbk=inbound.get("pbk"),
                reality_sid=inbound.get("sid"),
                flow=inbound.get("flow"),
                allow_insecure=host.allowinsecure,
                uuid=UUID(gen_uuid(key)),
                password=gen_password(key),
                enable_mux=host.mux,
                http_headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.3"
                },
                shadowsocks_method="chacha20-ietf-poly1305",
                weight=host.weight,
            )
            if host.fragment:
                data.fragment = True
                data.fragment_packets = host.fragment["packets"]
                data.fragment_length = host.fragment["length"]
                data.fragment_interval = host.fragment["interval"]
            configs.append(data)

    return configs


def encode_title(text: str) -> str:
    return f"base64:{base64.b64encode(text.encode()).decode()}"
