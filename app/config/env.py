from decouple import config
from dotenv import load_dotenv
from enum import Enum

load_dotenv()

DASHBOARD_PATH = config("DASHBOARD_PATH", default="/dashboard/")

SQLALCHEMY_DATABASE_URL = config(
    "SQLALCHEMY_DATABASE_URL", default="sqlite:///db.sqlite3"
)
SQLALCHEMY_CONNECTION_POOL_SIZE = config(
    "SQLALCHEMY_CONNECTION_POOL_SIZE", default=10, cast=int
)
SQLALCHEMY_CONNECTION_MAX_OVERFLOW = config(
    "SQLALCHEMY_CONNECTION_MAX_OVERFLOW", default=-1, cast=int
)

UVICORN_HOST = config("UVICORN_HOST", default="0.0.0.0")
UVICORN_PORT = config("UVICORN_PORT", cast=int, default=8000)
UVICORN_UDS = config("UVICORN_UDS", default=None)
UVICORN_SSL_CERTFILE = config("UVICORN_SSL_CERTFILE", default=None)
UVICORN_SSL_KEYFILE = config("UVICORN_SSL_KEYFILE", default=None)


DEBUG = config("DEBUG", default=False, cast=bool)
DOCS = config("DOCS", default=False, cast=bool)

VITE_BASE_API = (
    f"http://127.0.0.1:{UVICORN_PORT}/api/"
    if DEBUG and config("VITE_BASE_API", default="/api/") == "/api/"
    else config("VITE_BASE_API", default="/api/")
)

SUBSCRIPTION_URL_PREFIX = config("SUBSCRIPTION_URL_PREFIX", default="").strip(
    "/"
)

TELEGRAM_API_TOKEN = config("TELEGRAM_API_TOKEN", default="")
TELEGRAM_ADMIN_ID = config(
    "TELEGRAM_ADMIN_ID",
    default="",
    cast=lambda v: [
        int(i) for i in filter(str.isdigit, (s.strip() for s in v.split(",")))
    ],
)
TELEGRAM_PROXY_URL = config("TELEGRAM_PROXY_URL", default="")
TELEGRAM_LOGGER_CHANNEL_ID = config(
    "TELEGRAM_LOGGER_CHANNEL_ID", cast=int, default=0
)

JWT_ACCESS_TOKEN_EXPIRE_MINUTES = config(
    "JWT_ACCESS_TOKEN_EXPIRE_MINUTES", cast=int, default=1440
)

CUSTOM_TEMPLATES_DIRECTORY = config("CUSTOM_TEMPLATES_DIRECTORY", default=None)

SUBSCRIPTION_PAGE_TEMPLATE = config(
    "SUBSCRIPTION_PAGE_TEMPLATE", default="subscription/index.html"
)
HOME_PAGE_TEMPLATE = config("HOME_PAGE_TEMPLATE", default="home/index.html")

SINGBOX_SUBSCRIPTION_TEMPLATE = config(
    "SINGBOX_SUBSCRIPTION_TEMPLATE", default=None
)
XRAY_SUBSCRIPTION_TEMPLATE = config("XRAY_SUBSCRIPTION_TEMPLATE", default=None)
CLASH_SUBSCRIPTION_TEMPLATE = config(
    "CLASH_SUBSCRIPTION_TEMPLATE", default=None
)

WEBHOOK_ADDRESS = config("WEBHOOK_ADDRESS", default=None)
WEBHOOK_SECRET = config("WEBHOOK_SECRET", default=None)


class AuthAlgorithm(Enum):
    PLAIN = "plain"
    XXH128 = "xxh128"


AUTH_GENERATION_ALGORITHM = config(
    "AUTH_GENERATION_ALGORITHM",
    cast=AuthAlgorithm,
    default=AuthAlgorithm.XXH128,
)

# recurrent notifications

# timeout between each retry of sending a notification in seconds
RECURRENT_NOTIFICATIONS_TIMEOUT = config(
    "RECURRENT_NOTIFICATIONS_TIMEOUT", default=180, cast=int
)
# how many times to try after ok response not received after sending a notifications
NUMBER_OF_RECURRENT_NOTIFICATIONS = config(
    "NUMBER_OF_RECURRENT_NOTIFICATIONS", default=3, cast=int
)

# sends a notification when the user uses this much of their data
NOTIFY_REACHED_USAGE_PERCENT = config(
    "NOTIFY_REACHED_USAGE_PERCENT", default=80, cast=int
)

# sends a notification when there is n days left of their service
NOTIFY_DAYS_LEFT = config("NOTIFY_DAYS_LEFT", default=3, cast=int)

DISABLE_RECORDING_NODE_USAGE = config(
    "DISABLE_RECORDING_NODE_USAGE", cast=bool, default=False
)
