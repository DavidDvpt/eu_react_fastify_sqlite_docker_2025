from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Optional
from urllib.parse import quote_plus

import psycopg
from psycopg import Connection


SCRIPT_DIR = Path(__file__).resolve().parent
APP_ROOT_DIR = SCRIPT_DIR.parent
ENV_PATH = APP_ROOT_DIR / ".env"


@dataclass
class PostgresSettings:
    host: str
    port: int
    database: str
    user: str
    password: str
    download_base_url: str
    telegram_bot_token: Optional[str]
    telegram_chat_id: Optional[str]


def load_dotenv(env_path: Path = ENV_PATH) -> None:
    """Load simple KEY=VALUE pairs from the local .env file into the process environment."""
    if not env_path.is_file():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip())


def require_env(name: str) -> str:
    """Read one required environment variable and fail fast when it is missing."""
    value = os.getenv(name)
    if value is None or value == "":
        raise ValueError(f"Missing required environment variable: {name}")
    return value


def load_postgres_settings() -> PostgresSettings:
    """Load the image scraper PostgreSQL settings from the shared root environment."""
    load_dotenv()
    return PostgresSettings(
        host=require_env("PY_IMAGE_DB_HOST"),
        port=int(require_env("PY_IMAGE_DB_PORT")),
        database=require_env("PY_IMAGE_DB_NAME"),
        user=require_env("PY_IMAGE_DB_USER"),
        password=require_env("PY_IMAGE_DB_PASSWORD"),
        download_base_url=require_env("PY_IMAGE_BASE_URL"),
        telegram_bot_token=os.getenv("TELEGRAM_BOT_TOKEN") or None,
        telegram_chat_id=os.getenv("TELEGRAM_CHAT_ID") or None,
    )


def build_database_url(settings: PostgresSettings) -> str:
    """Build the application PostgreSQL connection URL from the loaded settings."""
    return (
        f"postgresql://{quote_plus(settings.user)}:{quote_plus(settings.password)}"
        f"@{settings.host}:{settings.port}/{settings.database}"
    )


def connect_database(settings: PostgresSettings) -> Connection:
    """Open an application connection to the dedicated image scraper PostgreSQL database."""
    return psycopg.connect(build_database_url(settings))
