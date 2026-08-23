from __future__ import annotations

import argparse
import csv
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

from psycopg import Connection

from db import connect_database, load_postgres_settings
from storage_image_index import format_variant_token


SCRIPT_DIR = Path(__file__).resolve().parent
VARIANTS = ("micro", "normal", "original")
EXTENSIONS = ("jpg", "png")
DEFAULT_DELAY_MS = 1500
DEFAULT_LOG_DIR = SCRIPT_DIR / "log"
DEFAULT_LOG_PATH = DEFAULT_LOG_DIR / "download-log.csv"


@dataclass
class CliOptions:
    start_id: int
    end_id: int
    overwrite: bool
    delay_ms: int
    log_path: Path


@dataclass
class AttemptResult:
    id_image: int
    variant: str
    extension: str
    file_name: str
    status: str
    error_code: str


def get_download_base_url() -> str:
    """Load the download base URL from the local environment configuration."""
    return load_postgres_settings().download_base_url.rstrip("/")


def parse_args(argv: list[str]) -> CliOptions:
    """Parse and validate CLI options for the download range and runtime behavior."""
    parser = argparse.ArgumentParser()
    parser.add_argument("--start-id", type=int, required=True)
    parser.add_argument("--end-id", type=int, required=True)
    parser.add_argument("--overwrite", action="store_true")
    parser.add_argument("--delay-ms", type=int, default=DEFAULT_DELAY_MS)
    parser.add_argument("--log-path", default=str(DEFAULT_LOG_PATH))
    args = parser.parse_args(argv)

    if args.start_id <= 0 or args.end_id <= 0:
        raise ValueError("--start-id and --end-id must be positive integers")
    if args.end_id < args.start_id:
        raise ValueError("--end-id must be greater than or equal to --start-id")

    delay_ms = args.delay_ms if isinstance(args.delay_ms, int) and args.delay_ms > 0 else DEFAULT_DELAY_MS
    return CliOptions(
        start_id=args.start_id,
        end_id=args.end_id,
        overwrite=args.overwrite,
        delay_ms=delay_ms,
        log_path=Path(args.log_path).expanduser().resolve(),
    )


def ensure_directories() -> dict[str, Path]:
    """Create the local variant directories next to the script and return their paths."""
    directories: dict[str, Path] = {}
    for variant in VARIANTS:
        target_dir = SCRIPT_DIR / variant
        target_dir.mkdir(parents=True, exist_ok=True)
        directories[variant] = target_dir
    return directories


def get_extension_order(preferred_extension: str | None) -> tuple[str, ...]:
    """Return the extension order, prioritizing the one that previously succeeded for the current image."""
    if preferred_extension in EXTENSIONS:
        remaining = [extension for extension in EXTENSIONS if extension != preferred_extension]
        return (preferred_extension, *remaining)
    return EXTENSIONS


def download_file(url: str, target_path: Path) -> tuple[bool, str]:
    """Download a remote file to disk and return whether it succeeded plus the HTTP or network status."""
    try:
        with urlopen(url) as response:
            status_code = getattr(response, "status", 200) or 200
            if status_code != 200:
                return False, str(status_code)
            target_path.write_bytes(response.read())
            return True, str(status_code)
    except HTTPError as exc:
        return False, str(exc.code)
    except URLError:
        return False, "network"


def log_attempt(writer: csv.DictWriter, result: AttemptResult) -> None:
    """Append one download attempt to the CSV log, including successes and failures."""
    writer.writerow(
        {
            "id_image": result.id_image,
            "nom_fichier": result.file_name,
            "status": result.status,
            "error_code": result.error_code,
        }
    )
    print(
        f"[{result.status}] id_image={result.id_image} file={result.file_name} error_code={result.error_code}"
    )


def insert_download_attempt(connection: Connection, result: AttemptResult) -> None:
    """Persist one download attempt immediately so progress survives process interruptions."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO download_attempts (id_image, variant, extension, file_name, status, error_code)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                result.id_image,
                result.variant,
                result.extension,
                result.file_name,
                result.status,
                result.error_code,
            ),
        )
    connection.commit()


def get_existing_image_extension(connection: Connection, id_image: int, variant: str) -> str | None:
    """Return the stored extension for one image variant when it is already marked as available in PostgreSQL."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT extension
            FROM images
            WHERE id_image = %s AND variant = %s
            """,
            (id_image, variant),
        )
        row = cursor.fetchone()
    if row is None:
        return None
    return str(row[0])


def insert_image_record_if_missing(
    connection: Connection,
    id_image: int,
    variant: str,
    extension: str,
    file_name: str,
) -> None:
    """Insert the current on-disk image state only when it is not already present in PostgreSQL."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO images (id_image, variant, extension, file_name, file_path)
            VALUES (%s, %s, %s, %s, %s)
            ON CONFLICT (id_image, variant)
            DO NOTHING
            """,
            (
                id_image,
                variant,
                extension,
                file_name,
                f"{variant}/{file_name}",
            ),
        )
    connection.commit()


def process_variant(
    connection: Connection,
    writer: csv.DictWriter,
    id_image: int,
    variant: str,
    target_dir: Path,
    overwrite: bool,
    preferred_extension: str | None,
) -> tuple[bool, str | None]:
    """Try one image variant with its allowed extensions and return the first successful extension if any."""
    variant_token = format_variant_token(variant)
    existing_extension = get_existing_image_extension(connection, id_image, variant)
    if existing_extension and not overwrite:
        result = AttemptResult(
            id_image=id_image,
            variant=variant,
            extension=existing_extension,
            file_name=f"{id_image}{variant_token}.{existing_extension}",
            status="ok",
            error_code="db_exists",
        )
        log_attempt(writer, result)
        return True, existing_extension

    base_url = get_download_base_url()
    file_stem = f"{id_image}{variant_token}"
    extensions = get_extension_order(preferred_extension)

    for extension in extensions:
        file_name = f"{file_stem}.{extension}"
        target_path = target_dir / file_name

        if target_path.exists() and not overwrite:
            result = AttemptResult(
                id_image=id_image,
                variant=variant,
                extension=extension,
                file_name=file_name,
                status="ok",
                error_code="exists",
            )
            log_attempt(writer, result)
            insert_download_attempt(connection, result)
            insert_image_record_if_missing(connection, id_image, variant, extension, file_name)
            return True, extension

        url = f"{base_url}/{file_name}"
        ok, error_code = download_file(url, target_path)
        result = AttemptResult(
            id_image=id_image,
            variant=variant,
            extension=extension,
            file_name=file_name,
            status="ok" if ok else "ko",
            error_code=error_code,
        )
        log_attempt(writer, result)
        insert_download_attempt(connection, result)
        if ok:
            insert_image_record_if_missing(connection, id_image, variant, extension, file_name)
            return True, extension

    return False, None


def sleep(delay_ms: int) -> None:
    """Pause between two image ids to avoid hitting the remote server too aggressively."""
    time.sleep(delay_ms / 1000)


def process_id(
    connection: Connection,
    writer: csv.DictWriter,
    id_image: int,
    directories: dict[str, Path],
    overwrite: bool,
) -> None:
    """Process one image id by resolving micro first, then normal and original using micro's winning extension."""
    micro_ok, preferred_extension = process_variant(
        connection=connection,
        writer=writer,
        id_image=id_image,
        variant="micro",
        target_dir=directories["micro"],
        overwrite=overwrite,
        preferred_extension=None,
    )
    if not micro_ok:
        return

    process_variant(
        connection=connection,
        writer=writer,
        id_image=id_image,
        variant="normal",
        target_dir=directories["normal"],
        overwrite=overwrite,
        preferred_extension=preferred_extension,
    )
    process_variant(
        connection=connection,
        writer=writer,
        id_image=id_image,
        variant="original",
        target_dir=directories["original"],
        overwrite=overwrite,
        preferred_extension=preferred_extension,
    )


def main(argv: list[str] | None = None) -> None:
    """Run the blind downloader on an inclusive id range and write the full attempt log to CSV."""
    options = parse_args(argv if argv is not None else sys.argv[1:])
    directories = ensure_directories()
    settings = load_postgres_settings()
    options.log_path.parent.mkdir(parents=True, exist_ok=True)

    total_ids = options.end_id - options.start_id + 1
    with connect_database(settings) as connection, options.log_path.open("w", newline="", encoding="utf-8") as log_file:
        writer = csv.DictWriter(
            log_file,
            fieldnames=["id_image", "nom_fichier", "status", "error_code"],
        )
        writer.writeheader()

        for offset, id_image in enumerate(range(options.start_id, options.end_id + 1), start=1):
            print(f"[progress] {offset}/{total_ids} id_image={id_image}")
            process_id(
                connection=connection,
                writer=writer,
                id_image=id_image,
                directories=directories,
                overwrite=options.overwrite,
            )
            log_file.flush()

            if offset < total_ids:
                sleep(options.delay_ms)

    print(f"[done] log written: {options.log_path}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("[fatal]", error, file=sys.stderr)
        raise SystemExit(1) from error
