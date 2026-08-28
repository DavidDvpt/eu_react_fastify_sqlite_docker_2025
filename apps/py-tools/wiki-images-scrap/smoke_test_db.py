from __future__ import annotations

import sys
from pathlib import Path


CURRENT_DIR = Path(__file__).resolve().parent
PARENT_DIR = CURRENT_DIR.parent
if str(PARENT_DIR) not in sys.path:
    sys.path.insert(0, str(PARENT_DIR))

from db import connect_database, load_postgres_settings


TEST_IMAGE_ID = 999999999


def main() -> None:
    """Run a small database smoke test covering insert, read, exclusion, and cleanup."""
    settings = load_postgres_settings()

    with connect_database(settings) as connection:
        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM images WHERE id_image = %s", (TEST_IMAGE_ID,))
            cursor.execute(
                """
                INSERT INTO images (id_image, variant, extension, file_name, file_path)
                VALUES (%s, %s, %s, %s, %s)
                ON CONFLICT (id_image, variant)
                DO UPDATE SET
                  extension = EXCLUDED.extension,
                  file_name = EXCLUDED.file_name,
                  file_path = EXCLUDED.file_path,
                  updated_at = NOW()
                """,
                (
                    TEST_IMAGE_ID,
                    "micro",
                    "jpg",
                    f"{TEST_IMAGE_ID}micro.jpg",
                    f"micro/{TEST_IMAGE_ID}micro.jpg",
                ),
            )
            cursor.execute(
                "SELECT id_image, variant, extension FROM images WHERE id_image = %s AND variant = %s",
                (TEST_IMAGE_ID, "micro"),
            )
            inserted_row = cursor.fetchone()
            if inserted_row is None:
                raise RuntimeError("Smoke test insert/read failed")

            cursor.execute(
                """
                SELECT EXISTS (
                  SELECT 1
                  FROM images
                  WHERE id_image = %s AND variant = %s
                )
                """,
                (TEST_IMAGE_ID, "micro"),
            )
            exists_row = cursor.fetchone()
            if exists_row is None or exists_row[0] is not True:
                raise RuntimeError("Smoke test exclusion check failed")

            cursor.execute("DELETE FROM images WHERE id_image = %s", (TEST_IMAGE_ID,))
        connection.commit()

    print(f"[done] smoke test passed for id_image={TEST_IMAGE_ID}")


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("[fatal]", error, file=sys.stderr)
        raise SystemExit(1) from error
