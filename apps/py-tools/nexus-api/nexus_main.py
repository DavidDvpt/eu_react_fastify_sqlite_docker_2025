import sys
from pathlib import Path
from dataclasses import dataclass
from urllib.parse import quote_plus

import psycopg
from psycopg import Connection

CURRENT_DIR = Path(__file__).resolve().parent
PARENT_DIR = CURRENT_DIR.parent
env_path = CURRENT_DIR / ".env"
sys.path.insert(0, str(PARENT_DIR))
sys.path.insert(0, str(CURRENT_DIR))

from py_tools_utils import get_db_connection, SETTINGS

@dataclass
class PostgresEmSettings:
    host: str
    port: int
    database: str
    user: str
    password: str
    db_url: str
    download_base_url: str


def load_dotenv() -> dict[str, str]:
    """Load simple KEY=VALUE pairs from the local Nexus .env file."""
    if not env_path.is_file():
        raise FileNotFoundError(f"Missing env file: {env_path}")

    env: dict[str, str] = {}

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        env[key] = value

    return env


def load_postgres_em_settings() -> PostgresEmSettings:
    """Build Nexus PostgreSQL settings from the local Nexus .env file."""
    env = load_dotenv()

    return PostgresEmSettings(
        host=env["EM_DB_HOST"],
        port=int(env["EM_DB_PORT"]),
        database=env["EM_DB_NAME"],
        user=env["EM_DB_USER"],
        password=env["EM_DB_PASSWORD"],
        db_url=env["EM_DB_URL"],
        download_base_url=env["NEXUS_API_URL"],
    )


def build_em_database_url(settings: PostgresEmSettings) -> str:
    """Build the application PostgreSQL connection URL from the loaded settings."""
    return (
        f"{settings.db_url}{quote_plus(settings.user)}:{quote_plus(settings.password)}"
        f"@{settings.host}:{settings.port}/{settings.database}"
    )


def get_em_db_connection(settings: PostgresEmSettings) -> Connection:
    """Open an application connection to the dedicated image scraper PostgreSQL database."""
    return psycopg.connect(build_em_database_url(settings))


def main():
    scrap_connection = get_db_connection()

    setting_em = load_postgres_em_settings()
    em_connection=get_em_db_connection(setting_em)
    print(em_connection, scrap_connection)


if __name__ == "__main__":
    try:
        main()
    except TimeoutError as error:
        print(f"[fatal] timeout: {error}", file=sys.stderr)
        raise SystemExit(1) from error
    except Exception as error:
        print(f"[fatal] {error}", file=sys.stderr)
        raise SystemExit(1) from error
