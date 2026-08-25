from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
SQL_DIR = SCRIPT_DIR / "sql"

if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from db import connect_database, load_postgres_settings


ITEM_APP_NAME = "item-scrap"
IMAGE_APP_NAME = "images-scrap"


@dataclass(frozen=True)
class InitDbContext:
    app_name: str
    schema_sql_path: Path


@dataclass
class ExistingImageRecord:
    id_image: int
    variant: str
    extension: str
    file_name: str
    file_path: str


def parse_args(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--app", choices=(ITEM_APP_NAME, IMAGE_APP_NAME))
    return parser.parse_args(argv)


def detect_app_name(runtime_dir: Path) -> str:
    if (runtime_dir / "storage_image_index.py").is_file():
        return IMAGE_APP_NAME
    if (runtime_dir / "scrape_chart_metadata.py").is_file():
        return ITEM_APP_NAME
    raise RuntimeError("Unable to detect scraper app. Use --app item-scrap or --app images-scrap.")


def resolve_context(args: argparse.Namespace) -> InitDbContext:
    app_name = args.app or detect_app_name(SCRIPT_DIR)
    schema_file_name = f"{app_name}.init_schema.sql"
    schema_sql_path = SQL_DIR / schema_file_name
    if not schema_sql_path.is_file():
        raise FileNotFoundError(f"Missing schema file: {schema_sql_path}")
    return InitDbContext(app_name=app_name, schema_sql_path=schema_sql_path)


def create_tables(schema_sql_path: Path) -> None:
    settings = load_postgres_settings()
    schema_sql = schema_sql_path.read_text(encoding="utf-8")

    with connect_database(settings) as connection:
        with connection.cursor() as cursor:
            cursor.execute(schema_sql)
        connection.commit()


def collect_existing_images(runtime_dir: Path) -> list[ExistingImageRecord]:
    from storage_image_index import VARIANTS, parse_variant_file_name

    records: list[ExistingImageRecord] = []
    for variant in VARIANTS:
        variant_dir = runtime_dir / variant
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
                    file_path=entry.relative_to(runtime_dir).as_posix(),
                )
            )

    return records


def hydrate_existing_files(runtime_dir: Path) -> int:
    settings = load_postgres_settings()
    records = collect_existing_images(runtime_dir)
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


def main(argv: list[str] | None = None) -> None:
    settings = load_postgres_settings()
    args = parse_args(argv or sys.argv[1:])
    context = resolve_context(args)
    create_tables(context.schema_sql_path)

    hydrated_count = 0
    if context.app_name == IMAGE_APP_NAME:
        hydrated_count = hydrate_existing_files(SCRIPT_DIR)

    print(
        f"[done] database initialized: app={context.app_name} "
        f"db={settings.database} user={settings.user} hydrated_images={hydrated_count}"
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("[fatal]", error, file=sys.stderr)
        raise SystemExit(1) from error
