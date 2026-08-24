from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path

from db import connect_database, load_postgres_settings
from storage_image_index import VARIANTS, parse_variant_file_name


SCRIPT_DIR = Path(__file__).resolve().parent
SCHEMA_SQL_PATH = SCRIPT_DIR / "sql" / "init_schema.sql"


@dataclass
class ExistingImageRecord:
    id_image: int
    variant: str
    extension: str
    file_name: str
    file_path: str


def create_tables() -> None:
    """Create the application tables and indexes in the dedicated PostgreSQL database."""
    settings = load_postgres_settings()
    schema_sql = SCHEMA_SQL_PATH.read_text(encoding="utf-8")

    with connect_database(settings) as connection:
        with connection.cursor() as cursor:
            cursor.execute(schema_sql)
        connection.commit()


def collect_existing_images() -> list[ExistingImageRecord]:
    """Scan the local variant folders and return the existing image files ready to hydrate into PostgreSQL."""
    records: list[ExistingImageRecord] = []

    for variant in VARIANTS:
        variant_dir = SCRIPT_DIR / variant
        if not variant_dir.is_dir():
            continue

        for entry in sorted(variant_dir.iterdir(), key=lambda item: item.name.casefold()):
            if not entry.is_file():
                continue

            parsed = parse_variant_file_name(entry.name, variant)
            if not parsed:
                continue

            image_id, extension = parsed
            records.append(
                ExistingImageRecord(
                    id_image=int(image_id),
                    variant=variant,
                    extension=extension,
                    file_name=entry.name,
                    file_path=entry.relative_to(SCRIPT_DIR).as_posix(),
                )
            )

    return records


def hydrate_existing_files() -> int:
    """Upsert already-downloaded files from disk into the images table."""
    settings = load_postgres_settings()
    records = collect_existing_images()
    if not records:
        return 0

    with connect_database(settings) as connection:
        with connection.cursor() as cursor:
            cursor.executemany(
                """
                INSERT INTO images (
                  id_image,
                  variant,
                  extension,
                  file_name,
                  file_path
                )
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (id_image, variant)
                DO UPDATE SET
                  extension = EXCLUDED.extension,
                  file_name = EXCLUDED.file_name,
                  file_path = EXCLUDED.file_path,
                  updated_at = NOW()
                """,
                [
                    (
                        record.id_image,
                        record.variant,
                        record.extension,
                        record.file_name,
                        record.file_path,
                    )
                    for record in records
                ],
            )
        connection.commit()

    return len(records)


def main() -> None:
    """Initialize PostgreSQL for wiki-images by creating the schema and hydrating existing files."""
    settings = load_postgres_settings()
    create_tables()
    hydrated_count = hydrate_existing_files()
    print(
        f"[done] database initialized: db={settings.database} user={settings.user} hydrated_images={hydrated_count}"
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("[fatal]", error, file=sys.stderr)
        raise SystemExit(1) from error
