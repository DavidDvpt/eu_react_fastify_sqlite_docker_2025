from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path


SCRIPT_DIR = Path(__file__).resolve().parent
APP_DIR = SCRIPT_DIR.parent
if str(APP_DIR) not in sys.path:
    sys.path.insert(0, str(APP_DIR))

from db import connect_database, load_postgres_settings


TEST_RANGE_START = 910001
TEST_RANGE_END = 910003


@dataclass(frozen=True)
class SimulatedAttempt:
    id_image: int
    variant: str
    extension: str
    status: str
    error_code: str

    @property
    def file_name(self) -> str:
        """Return the canonical file name for the simulated download attempt."""
        return f"{self.id_image}{self.variant}.{self.extension}"

    @property
    def file_path(self) -> str:
        """Return the canonical relative file path for a successful simulated download."""
        return f"{self.variant}/{self.file_name}"


def cleanup_test_data() -> None:
    """Remove the dedicated test ids from images and download_attempts before and after the test run."""
    settings = load_postgres_settings()

    with connect_database(settings) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                "DELETE FROM download_attempts WHERE id_image BETWEEN %s AND %s",
                (TEST_RANGE_START, TEST_RANGE_END),
            )
            cursor.execute(
                "DELETE FROM images WHERE id_image BETWEEN %s AND %s",
                (TEST_RANGE_START, TEST_RANGE_END),
            )
        connection.commit()


def seed_existing_and_404_cases() -> None:
    """Seed one already-indexed image and one known 404 id to validate exclusion behavior."""
    settings = load_postgres_settings()

    with connect_database(settings) as connection:
        with connection.cursor() as cursor:
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
                    TEST_RANGE_START,
                    "micro",
                    "jpg",
                    f"{TEST_RANGE_START}micro.jpg",
                    f"micro/{TEST_RANGE_START}micro.jpg",
                ),
            )
            cursor.executemany(
                """
                INSERT INTO download_attempts (id_image, variant, extension, file_name, status, error_code)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                [
                    (
                        TEST_RANGE_START + 1,
                        "micro",
                        "jpg",
                        f"{TEST_RANGE_START + 1}micro.jpg",
                        "ko",
                        "404",
                    ),
                    (
                        TEST_RANGE_START + 1,
                        "micro",
                        "png",
                        f"{TEST_RANGE_START + 1}micro.png",
                        "ko",
                        "404",
                    ),
                ],
            )
        connection.commit()


def get_candidate_ids(start_id: int, end_id: int) -> list[int]:
    """Return the ids in range that are neither already stored nor previously marked as 404."""
    settings = load_postgres_settings()

    with connect_database(settings) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT candidate.id_image
                FROM generate_series(%s, %s) AS candidate(id_image)
                WHERE NOT EXISTS (
                  SELECT 1
                  FROM images image
                  WHERE image.id_image = candidate.id_image
                )
                AND NOT EXISTS (
                  SELECT 1
                  FROM download_attempts attempt
                  WHERE attempt.id_image = candidate.id_image
                    AND attempt.error_code = '404'
                )
                ORDER BY candidate.id_image
                """,
                (start_id, end_id),
            )
            return [row[0] for row in cursor.fetchall()]


def insert_simulated_results(attempts: list[SimulatedAttempt]) -> None:
    """Insert simulated download attempts and upsert successful files into the images table."""
    settings = load_postgres_settings()

    with connect_database(settings) as connection:
        with connection.cursor() as cursor:
            cursor.executemany(
                """
                INSERT INTO download_attempts (id_image, variant, extension, file_name, status, error_code)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                [
                    (
                        attempt.id_image,
                        attempt.variant,
                        attempt.extension,
                        attempt.file_name,
                        attempt.status,
                        attempt.error_code,
                    )
                    for attempt in attempts
                ],
            )

            successful_attempts = [attempt for attempt in attempts if attempt.status == "ok"]
            if successful_attempts:
                cursor.executemany(
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
                    [
                        (
                            attempt.id_image,
                            attempt.variant,
                            attempt.extension,
                            attempt.file_name,
                            attempt.file_path,
                        )
                        for attempt in successful_attempts
                    ],
                )
        connection.commit()


def assert_flow_results() -> None:
    """Validate exclusion logic and the simulated inserts written into PostgreSQL."""
    settings = load_postgres_settings()

    candidates = get_candidate_ids(TEST_RANGE_START, TEST_RANGE_END)
    expected_candidates = [TEST_RANGE_END]
    if candidates != expected_candidates:
        raise RuntimeError(f"Unexpected candidate ids: expected={expected_candidates} actual={candidates}")

    simulated_attempts = [
        SimulatedAttempt(TEST_RANGE_END, "micro", "jpg", "ok", "200"),
        SimulatedAttempt(TEST_RANGE_END, "normal", "jpg", "ko", "404"),
        SimulatedAttempt(TEST_RANGE_END, "normal", "png", "ok", "200"),
        SimulatedAttempt(TEST_RANGE_END, "original", "jpg", "ko", "404"),
        SimulatedAttempt(TEST_RANGE_END, "original", "png", "ko", "404"),
    ]
    insert_simulated_results(simulated_attempts)

    with connect_database(settings) as connection:
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id_image, variant, extension
                FROM images
                WHERE id_image = %s
                ORDER BY variant
                """,
                (TEST_RANGE_END,),
            )
            image_rows = cursor.fetchall()
            expected_images = [
                (TEST_RANGE_END, "micro", "jpg"),
                (TEST_RANGE_END, "normal", "png"),
            ]
            if image_rows != expected_images:
                raise RuntimeError(f"Unexpected images rows: expected={expected_images} actual={image_rows}")

            cursor.execute(
                """
                SELECT id_image, variant, extension, status, error_code
                FROM download_attempts
                WHERE id_image = %s
                ORDER BY id
                """,
                (TEST_RANGE_END,),
            )
            attempt_rows = cursor.fetchall()
            expected_attempts = [
                (attempt.id_image, attempt.variant, attempt.extension, attempt.status, attempt.error_code)
                for attempt in simulated_attempts
            ]
            if attempt_rows != expected_attempts:
                raise RuntimeError(f"Unexpected attempt rows: expected={expected_attempts} actual={attempt_rows}")


def main() -> None:
    """Test the range filtering and simulated download persistence workflow against PostgreSQL."""
    cleanup_test_data()
    try:
        seed_existing_and_404_cases()
        assert_flow_results()
        print(
            "[done] range flow test passed: existing images skipped, known 404 ids skipped, "
            "simulated results inserted"
        )
    finally:
        cleanup_test_data()


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("[fatal]", error, file=sys.stderr)
        raise SystemExit(1) from error
