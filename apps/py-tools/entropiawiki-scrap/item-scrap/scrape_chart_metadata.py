from __future__ import annotations

import json
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlparse
from urllib.request import urlopen

from bs4 import BeautifulSoup
from psycopg import Connection
from playwright.sync_api import Page, TimeoutError, sync_playwright

CURRENT_DIR = Path(__file__).resolve().parent
PARENT_DIR = CURRENT_DIR.parent
sys.path.insert(0, str(PARENT_DIR))

from db import PostgresSettings, connect_database, load_postgres_settings

CHARTS = [
    "Material",
    "Finder",
    "FinderAmplifier",
    "FinderEnhancer",
    "Excavator",
    "Refiners",
    "Scanner",
    "FAP",
    "MedicalEnhancer",
    "MiscTool",
    "Weapon",
    "Armor",
    "ArmorItem",
    "ArmorEnhancer",
    "Plating",
    "Clothes",
    "Vehicle",
    "SpaceShips",
]

DEFAULT_ITEM_TYPE_BY_CHART = {
    "Material": "Material",
    "Finder": "Finder",
    "FinderAmplifier": "Finder Amplifier",
    "FinderEnhancer": "Finder Enhancer",
    "Excavator": "Excavator",
    "Armor": "Armor",
}

TABLE_SELECTOR = "table#ctl00_ContentPlaceHolder1_DG1"
ROW_SELECTOR = "tr.G, tr.GA"
HEADER_ROW_SELECTOR = "tr.GridHeader"
ITEM_LINK_SELECTOR = 'a[title^="ID="]'
NEXT_PAGE_SELECTOR = 'a[title="Next page"]'
ALL_SELECTOR = 'a:has-text("(All)")'
OUTPUT_PATH = Path(__file__).resolve().parent / "chart-item-image-map.json"
MAX_PAGES_PER_CHART = 100
DEFAULT_TIMEOUT_MS = 120_000
IMAGE_ID_PATTERN = re.compile(r"/(\d+)(?:Micro)?\.(?:jpg|jpeg|png|gif)$", re.IGNORECASE)
TITLE_ID_PATTERN = re.compile(r"ID=(\d+)")


@dataclass
class ChartStats:
    chart: str
    pages_scraped: int = 0
    rows_read: int = 0
    rows_inserted: int = 0
    rows_updated: int = 0
    item_count: int = 0
    skipped: bool = False
    errors: list[str] = field(default_factory=list)


# Resolve the numeric item ID from the item link, with a title-based fallback.
def extract_item_id(link_href: str | None, link_title: str | None) -> int | None:
    """Extract the EntropiaWiki item ID from the main item link."""
    if link_href:
        parsed_href = urlparse(link_href)
        item_ids = parse_qs(parsed_href.query).get("id")
        if item_ids:
            try:
                return int(item_ids[0])
            except ValueError:
                pass

    if link_title:
        title_match = TITLE_ID_PATTERN.search(link_title)
        if title_match:
            return int(title_match.group(1))

    return None


# Resolve the numeric image ID from one chart thumbnail URL when present.
def extract_image_id(image_src: str | None) -> int | None:
    """Extract the numeric image ID from a gallery image URL when present."""
    if not image_src:
        return None

    normalized_src = urlparse(image_src).path
    match = IMAGE_ID_PATTERN.search(normalized_src)
    if match:
        return int(match.group(1))

    return None


# Build the target chart URL from the base wiki URL configured in the environment.
def build_chart_url(settings: PostgresSettings, chart: str) -> str:
    """Build the EntropiaWiki chart URL from the shared environment configuration."""
    return f"{settings.wiki_base_url.rstrip('/')}/Chart.aspx?chart={chart}"


def normalize_cell_text(cell) -> str | None:
    """Return stripped cell text or None when the cell is missing or blank."""
    if cell is None:
        return None

    text = cell.get_text(strip=True)
    return text or None


def extract_column_indexes(table) -> dict[str, int]:
    """Read the second GridHeader row and map normalized header names to cell indexes."""
    header_rows = table.select(HEADER_ROW_SELECTOR)
    if len(header_rows) < 2:
        return {}

    header_cells = header_rows[1].find_all("td", recursive=False)
    column_indexes: dict[str, int] = {}

    for index, cell in enumerate(header_cells):
        header_name = normalize_cell_text(cell)
        if header_name is None:
            continue
        column_indexes[header_name.casefold()] = index

    return column_indexes


def resolve_default_item_type(chart: str, parsed_item_type: str | None) -> str | None:
    """Return the parsed type when present, otherwise the chart default when configured."""
    if parsed_item_type:
        return parsed_item_type

    return DEFAULT_ITEM_TYPE_BY_CHART.get(chart)


# Parse one rendered chart page and extract item/image metadata row by row.
def parse_items(html: str, chart: str) -> list[dict[str, int | str | None]]:
    """Parse one chart HTML page and return item metadata without any network dependency."""
    soup = BeautifulSoup(html, "html.parser")
    table = soup.select_one(TABLE_SELECTOR)
    if table is None:
        return []

    column_indexes = extract_column_indexes(table)
    items: list[dict[str, int | str | None]] = []
    for row in table.select(ROW_SELECTOR):
        link = row.select_one(ITEM_LINK_SELECTOR)
        if link is None:
            continue

        item_id = extract_item_id(link.get("href"), link.get("title"))
        if item_id is None:
            continue

        item_name = link.get_text(strip=True)
        if not item_name:
            continue

        image = row.select_one("td.II img")
        image_id = extract_image_id(image.get("src") if image else None)
        cells = row.find_all("td", recursive=False)
        item_type = normalize_cell_text(cells[column_indexes["type"]]) if "type" in column_indexes and len(cells) > column_indexes["type"] else None
        item_type = resolve_default_item_type(chart, item_type)
        item_class = normalize_cell_text(cells[column_indexes["class"]]) if "class" in column_indexes and len(cells) > column_indexes["class"] else None

        items.append(
            {
                "item_id": item_id,
                "item_name": item_name,
                "image_id": image_id,
                "item_type": item_type,
                "item_class": item_class,
            }
        )

    return items


# Block until the chart table is visible after a navigation or postback.
def wait_for_chart_table(page: Page) -> None:
    """Wait until the chart table has been rendered after a navigation or postback."""
    page.wait_for_load_state("domcontentloaded")
    page.locator(TABLE_SELECTOR).wait_for(state="visible", timeout=DEFAULT_TIMEOUT_MS)


# Expand the result list to the '(All)' view when the control exists.
def click_all_if_available(page: Page, chart: str) -> None:
    """Click the '(All)' pager control when it exists on the current chart page."""
    all_link = page.locator(ALL_SELECTOR).first
    if all_link.count() == 0:
        print(f"[{chart}] selecting All skipped")
        return

    print(f"[{chart}] selecting All")
    with page.expect_navigation(wait_until="domcontentloaded"):
        all_link.click()
    wait_for_chart_table(page)


# Persist one page of scraped rows immediately so monthly runs do not lose progress.
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


# Decide whether a chart can be skipped because it was scraped less than one month ago.
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


# Store the latest successful scrape date and item count for one chart.
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


# Load the whole item catalog from PostgreSQL so the JSON stays complete even when some charts are skipped.
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


# Send one Telegram message when the bot token and chat id are configured.
def send_telegram_message(settings: PostgresSettings, message: str) -> None:
    """Send a Telegram message when the bot token and chat id are configured."""
    if not settings.telegram_bot_token or not settings.telegram_chat_id:
        return

    payload = urlencode(
        {
            "chat_id": settings.telegram_chat_id,
            "text": message,
        }
    ).encode("utf-8")
    url = f"https://api.telegram.org/bot{settings.telegram_bot_token}/sendMessage"
    with urlopen(url, data=payload):
        pass


# Format the per-chart summary sent to Telegram after each chart run.
def build_chart_summary_message(stats: ChartStats) -> str:
    """Build the human-readable Telegram summary for one scraped chart."""
    error_lines = "\n".join(f"- {error}" for error in stats.errors) if stats.errors else "none"
    return (
        f"EntropiaWiki chart scrape\n"
        f"Chart: {stats.chart}\n"
        f"Skipped: {'yes' if stats.skipped else 'no'}\n"
        f"Pages scraped: {stats.pages_scraped}\n"
        f"Rows read: {stats.rows_read}\n"
        f"Rows inserted in DB: {stats.rows_inserted}\n"
        f"Rows updated in DB: {stats.rows_updated}\n"
        f"Items recovered: {stats.item_count}\n"
        f"Errors:\n{error_lines}"
    )


# Scrape one chart across all pages, save each page in DB, and deduplicate rows by item ID.
def scrape_chart(
    page: Page, chart: str, connection: Connection, settings: PostgresSettings
) -> tuple[list[dict[str, int | str | None]], ChartStats]:
    """Scrape one chart, write each page to PostgreSQL, and collect chart-level statistics."""
    stats = ChartStats(chart=chart)
    skip_chart, last_item_count = should_skip_chart(connection, chart)
    if skip_chart:
        stats.skipped = True
        stats.item_count = last_item_count or 0
        print(f"[{chart}] skipped: scraped less than one month ago")
        try:
            send_telegram_message(settings, build_chart_summary_message(stats))
        except Exception as telegram_error:
            print(f"[{chart}] telegram failed: {telegram_error}", file=sys.stderr)
        return [], stats

    print(f"[{chart}] opening")

    try:
        page.goto(build_chart_url(settings, chart), wait_until="domcontentloaded")
        wait_for_chart_table(page)
        click_all_if_available(page, chart)

        items_by_id: dict[int, dict[str, int | str | None]] = {}
        seen_page_signatures: set[tuple[int, ...]] = set()

        for page_number in range(1, MAX_PAGES_PER_CHART + 1):
            page_items = parse_items(page.content(), chart)
            current_page_ids = tuple(
                sorted(item["item_id"] for item in page_items if isinstance(item["item_id"], int))
            )
            if current_page_ids in seen_page_signatures:
                repeated_message = f"repeated page detected, stopping at page {page_number}"
                print(f"[{chart}] {repeated_message}")
                stats.errors.append(repeated_message)
                break
            seen_page_signatures.add(current_page_ids)

            stats.pages_scraped += 1
            stats.rows_read += len(page_items)

            inserted_count, updated_count = upsert_items_page(connection, page_items)
            stats.rows_inserted += inserted_count
            stats.rows_updated += updated_count

            for item in page_items:
                item_id = item["item_id"]
                if isinstance(item_id, int):
                    items_by_id[item_id] = item

            print(
                f"[{chart}] page {page_number}: read={len(page_items)} inserted={inserted_count} updated={updated_count}"
            )

            next_link = page.locator(NEXT_PAGE_SELECTOR).first
            if next_link.count() == 0:
                break

            with page.expect_navigation(wait_until="domcontentloaded"):
                next_link.click()
            wait_for_chart_table(page)
        else:
            limit_message = f"pagination limit reached ({MAX_PAGES_PER_CHART})"
            print(f"[{chart}] {limit_message}")
            stats.errors.append(limit_message)

        stats.item_count = len(items_by_id)
        upsert_scraped_page(connection, chart, stats.item_count)
        print(f"[{chart}] completed: {len(items_by_id)} unique items")
        return list(items_by_id.values()), stats
    except Exception as error:
        connection.rollback()
        stats.errors.append(str(error))
        raise
    finally:
        try:
            send_telegram_message(settings, build_chart_summary_message(stats))
        except Exception as telegram_error:
            print(f"[{chart}] telegram failed: {telegram_error}", file=sys.stderr)


# Iterate over the chart whitelist, merge all scraped items globally, and keep scraping after one chart failure.
def scrape_all_charts(
    settings: PostgresSettings,
) -> tuple[list[dict[str, int | str | None]], list[ChartStats]]:
    """Scrape every chart, persist pages as they are read, and return items plus chart summaries."""
    chart_stats: list[ChartStats] = []

    with connect_database(settings) as connection:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            context = browser.new_context()
            page = context.new_page()
            page.set_default_timeout(DEFAULT_TIMEOUT_MS)

            try:
                for chart in CHARTS:
                    try:
                        _, stats = scrape_chart(page, chart, connection, settings)
                        chart_stats.append(stats)
                    except Exception as error:
                        failed_stats = ChartStats(chart=chart, errors=[str(error)])
                        chart_stats.append(failed_stats)
                        print(f"[{chart}] fatal: {error}", file=sys.stderr)
                    print("")
            finally:
                context.close()
                browser.close()

        items = load_all_items(connection)

    return items, chart_stats


# Write the final deduplicated dataset to the local JSON output file.
def save_results(items: list[dict[str, int | str | None]], output_path: Path = OUTPUT_PATH) -> None:
    """Persist the final deduplicated result set to JSON."""
    output_path.write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[done] results written: {output_path}")


# Raise at the end if at least one chart failed so cron can mark the run as broken.
def raise_on_failed_charts(stats_by_chart: list[ChartStats]) -> None:
    """Fail the process after completion when one or more charts produced a fatal error."""
    failed_charts = [stats.chart for stats in stats_by_chart if stats.pages_scraped == 0 and stats.errors]
    if failed_charts:
        raise RuntimeError(f"chart scrape failed: {', '.join(failed_charts)}")


# Run the full scrape flow from browser automation to DB upserts and JSON export.
def main() -> None:
    settings = load_postgres_settings()
    items, chart_stats = scrape_all_charts(settings)
    save_results(items)
    print(f"Total unique items: {len(items)}")
    raise_on_failed_charts(chart_stats)


if __name__ == "__main__":
    try:
        main()
    except TimeoutError as error:
        print(f"[fatal] timeout: {error}", file=sys.stderr)
        raise SystemExit(1) from error
    except Exception as error:
        print(f"[fatal] {error}", file=sys.stderr)
        raise SystemExit(1) from error
