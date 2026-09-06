from __future__ import annotations

from psycopg import Connection


def create_items_page(
    connection: Connection, items: list[dict[str, int | str | None]]
) -> int:
    """Insert items whose names are absent, skip ID conflicts, and return the insert count."""
    if not items:
        return 0

    inserted_count = 0

    with connection.cursor() as cursor:
        for item in items:
            cursor.execute(
                """
                INSERT INTO wiki_items (
                  item_id,
                  item_name,
                  image_id,
                  item_type,
                  item_class,
                  updated_at
                )
                SELECT %s, %s, %s, %s, %s, NOW()
                WHERE NOT EXISTS (
                    SELECT 1 FROM wiki_items WHERE item_name = %s
                )
                ON CONFLICT (item_id) DO NOTHING
                """,
                (
                    item["item_id"],
                    item["item_name"],
                    item["image_id"],
                    item["item_type"],
                    item["item_class"],
                    item["item_name"],
                ),
            )
            inserted_count += cursor.rowcount

    connection.commit()
    return inserted_count


def should_skip_chart(connection: Connection, chart: str) -> tuple[bool, int | None]:
    """Return whether the chart should be skipped and the last stored item count when known."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT item_count
            FROM wiki_scraped_pages
            WHERE page_name = %s
              AND scraped_at >= NOW() - INTERVAL '1 month'
              AND (last_failed_at IS NULL OR scraped_at > last_failed_at)
            """,
            (chart,),
        )
        row = cursor.fetchone()

    if row is None:
        return False, None

    return True, row[0]


def start_scrape_run(connection: Connection, chart: str) -> int:
    """Ensure the chart exists and persist a running attempt before scraping."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO wiki_scraped_pages (page_name, item_count)
            VALUES (%s, 0)
            ON CONFLICT (page_name) DO NOTHING
            """,
            (chart,),
        )
        cursor.execute(
            """
            INSERT INTO wiki_scrape_runs (page_id)
            SELECT id FROM wiki_scraped_pages WHERE page_name = %s
            RETURNING id
            """,
            (chart,),
        )
        run_id = cursor.fetchone()[0]
    connection.commit()
    return run_id


def finish_scrape_run(
    connection: Connection,
    run_id: int,
    status: str,
    add_count: int,
    update_count: int,
    error_message: str | None = None,
) -> None:
    """Finish an attempt in the caller's page-metadata transaction."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            UPDATE wiki_scrape_runs
            SET finished_at = NOW(), status = %s, add_count = %s,
                update_count = %s, error_message = %s
            WHERE id = %s
            """,
            (status, add_count, update_count, error_message, run_id),
        )


def upsert_scraped_page(
    connection: Connection, chart: str, item_count: int,
    run_id: int, add_count: int, update_count: int = 0,
) -> None:
    """Persist successful chart metadata and finish its run atomically."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO wiki_scraped_pages (
              page_name,
              scraped_at,
              item_count
            )
            VALUES (%s, NOW(), %s)
            ON CONFLICT (page_name)
            DO UPDATE SET
              scraped_at = EXCLUDED.scraped_at,
              item_count = EXCLUDED.item_count
            """,
            (chart, item_count),
        )

    finish_scrape_run(connection, run_id, "success", add_count, update_count)
    connection.commit()


def upsert_failed_page(
    connection: Connection, chart: str, run_id: int | None = None,
    add_count: int = 0, update_count: int = 0,
    error_message: str | None = None,
) -> None:
    """Record a failed attempt without changing the last successful scrape."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO wiki_scraped_pages (page_name, last_failed_at, item_count)
            VALUES (%s, NOW(), 0)
            ON CONFLICT (page_name)
            DO UPDATE SET last_failed_at = EXCLUDED.last_failed_at
            """,
            (chart,),
        )
    if run_id is not None:
        finish_scrape_run(connection, run_id, "failed", add_count, update_count, error_message)
    connection.commit()


def load_all_items(connection: Connection) -> list[dict[str, int | str | None]]:
    """Read the full wiki_items table and return it in the same shape as the scraper output."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT item_id, item_name, image_id, item_type, item_class
            FROM wiki_items
            ORDER BY item_id
            """
        )
        rows = cursor.fetchall()

    return [
        {
            "item_id": row[0],
            "item_name": row[1],
            "image_id": row[2],
            "item_type": row[3],
            "item_class": row[4],
        }
        for row in rows
    ]
