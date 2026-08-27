from __future__ import annotations

from psycopg import Connection


def upsert_items_page(
    connection: Connection, items: list[dict[str, int | str | None]]
) -> tuple[int, int]:
    """Upsert one scraped page into PostgreSQL and return insert/update counters."""
    if not items:
        return 0, 0

    inserted_count = 0
    updated_count = 0

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
                VALUES (%s, %s, %s, %s, %s, NOW())
                ON CONFLICT (item_id)
                DO UPDATE SET
                  item_name = EXCLUDED.item_name,
                  image_id = EXCLUDED.image_id,
                  item_type = EXCLUDED.item_type,
                  item_class = EXCLUDED.item_class,
                  updated_at = NOW()
                RETURNING (xmax = 0) AS inserted
                """,
                (
                    item["item_id"],
                    item["item_name"],
                    item["image_id"],
                    item["item_type"],
                    item["item_class"],
                ),
            )
            inserted = cursor.fetchone()
            if inserted and inserted[0]:
                inserted_count += 1
            else:
                updated_count += 1

    connection.commit()
    return inserted_count, updated_count


def should_skip_chart(connection: Connection, chart: str) -> tuple[bool, int | None]:
    """Return whether the chart should be skipped and the last stored item count when known."""
    with connection.cursor() as cursor:
        cursor.execute(
            """
            SELECT item_count
            FROM wiki_scraped_pages
            WHERE page_name = %s
              AND scraped_at >= NOW() - INTERVAL '1 month'
            """,
            (chart,),
        )
        row = cursor.fetchone()

    if row is None:
        return False, None

    return True, row[0]


def upsert_scraped_page(connection: Connection, chart: str, item_count: int) -> None:
    """Persist the latest successful chart scrape metadata."""
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
