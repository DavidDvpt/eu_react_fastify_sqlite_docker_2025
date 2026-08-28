from __future__ import annotations

import os
import sys
from pathlib import Path

import psycopg
from psycopg import sql

SCRIPT_DIR = Path(__file__).resolve().parent
SQL_DIR = SCRIPT_DIR / "sql"
ROOT_DIR = SCRIPT_DIR.parent

if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from db import connect_database, load_postgres_settings
from definitions import PostgresSettings

FILES: list[str] = ["images-scrap", "item-scrap"]
CREATE_DATABASE_FILE = "create_wiki_images_database.sql"
ADMIN_DB_NAME = "postgres"
ADMIN_DB_USER = os.getenv("PY_TOOLS_ADMIN_DB_USER", "postgres")
ADMIN_DB_PASSWORD = os.getenv("PY_TOOLS_ADMIN_DB_PASSWORD", "postgres")


def quote_literal(value: str) -> str:
    return "'" + value.replace("'", "''") + "'"


def create_database(settings: PostgresSettings) -> None:
    create_database_sql_path = SQL_DIR / CREATE_DATABASE_FILE
    if not create_database_sql_path.is_file():
        raise FileNotFoundError(f"Missing database bootstrap file: {create_database_sql_path}")

    admin_database_url = (
        f"postgresql://{ADMIN_DB_USER}:{ADMIN_DB_PASSWORD}"
        f"@{settings.host}:{settings.port}/{ADMIN_DB_NAME}"
    )

    with psycopg.connect(admin_database_url, autocommit=True) as connection:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1 FROM pg_catalog.pg_roles WHERE rolname = %s", (settings.user,))
            role_exists = cursor.fetchone() is not None
            if role_exists:
                cursor.execute(
                    sql.SQL("ALTER ROLE {} WITH LOGIN PASSWORD {}").format(
                        sql.Identifier(settings.user),
                        sql.SQL(quote_literal(settings.password)),
                    )
                )
            else:
                cursor.execute(
                    sql.SQL("CREATE ROLE {} LOGIN PASSWORD {}").format(
                        sql.Identifier(settings.user),
                        sql.SQL(quote_literal(settings.password)),
                    )
                )

            cursor.execute("SELECT 1 FROM pg_database WHERE datname = %s", (settings.database,))
            if cursor.fetchone() is None:
                cursor.execute(
                    sql.SQL("CREATE DATABASE {} OWNER {}").format(
                        sql.Identifier(settings.database),
                        sql.Identifier(settings.user),
                    )
                )

            cursor.execute(
                sql.SQL("GRANT ALL PRIVILEGES ON DATABASE {} TO {}").format(
                    sql.Identifier(settings.database),
                    sql.Identifier(settings.user),
                )
            )

    print(f"[done] database ensured: {create_database_sql_path.name}")


def create_tables(settings: PostgresSettings) -> None:
    with connect_database(settings) as connection:
        with connection.cursor() as cursor:
            for file_name in FILES:
                schema_sql_path = SQL_DIR / f"{file_name}.init_schema.sql"
                if not schema_sql_path.is_file():
                    raise FileNotFoundError(f"Missing schema file: {schema_sql_path}")
                schema_sql = schema_sql_path.read_text(encoding="utf-8")
                cursor.execute(schema_sql)
        connection.commit()

    print(f"[done] tables ensured: {', '.join(FILES)}")


def main() -> None:
    settings = load_postgres_settings()
    create_database(settings)
    create_tables(settings)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("[fatal]", error, file=sys.stderr)
        raise SystemExit(1) from error
