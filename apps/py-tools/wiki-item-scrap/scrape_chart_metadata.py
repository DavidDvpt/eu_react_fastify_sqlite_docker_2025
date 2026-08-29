from __future__ import annotations

import json
import re
import sys
from pathlib import Path
from urllib.parse import parse_qs, urlparse

from bs4 import BeautifulSoup
from psycopg import Connection
from playwright.sync_api import Page, TimeoutError, sync_playwright

CURRENT_DIR = Path(__file__).resolve().parent
PARENT_DIR = CURRENT_DIR.parent
sys.path.insert(0, str(PARENT_DIR))
sys.path.insert(0, str(CURRENT_DIR))

from py_tools_utils import get_db_connection, SETTINGS

from definitions import ChartStats
from telegram import build_chart_summary_message, send_telegram_message

from sql_requests import (
    load_all_items,
    should_skip_chart,
    upsert_items_page,
    upsert_scraped_page,
)

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

TABLE_SELECTOR = "table#ctl00_ContentPlaceHolder1_DG1"
ROW_SELECTOR = "tr.G, tr.GA"
ITEM_LINK_SELECTOR = 'a[title^="ID="]'
NEXT_PAGE_SELECTOR = 'a[title="Next page"]'
ALL_SELECTOR = 'a:has-text("(All)")'
OUTPUT_PATH = Path(__file__).resolve().parent / "chart-item-image-map.json"
MAX_PAGES_PER_CHART = 100
DEFAULT_TIMEOUT_MS = 120_000
IMAGE_COLUMN_INDEX = 1
ITEM_COLUMN_INDEX = 2
IMAGE_ID_PATTERN = re.compile(r"/(\d+)(?:Micro)?\.(?:jpg|jpeg|png|gif)$", re.IGNORECASE)
TITLE_ID_PATTERN = re.compile(r"ID=(\d+)")


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


# Parse one rendered chart page and extract item/image metadata row by row.
def parse_items(html: str) -> list[dict[str, int | str | None]]:
    """Parse one chart HTML page and return item metadata without any network dependency."""
    soup = BeautifulSoup(html, "html.parser")
    table = soup.select_one(TABLE_SELECTOR)
    if table is None:
        return []

    items: list[dict[str, int | str | None]] = []

    for row in table.select(ROW_SELECTOR):
        cells = row.find_all("td", recursive=False)
        if len(cells) <= ITEM_COLUMN_INDEX:
            continue

        item_cell = cells[ITEM_COLUMN_INDEX]
        link = item_cell.select_one(ITEM_LINK_SELECTOR)
        if link is None:
            continue

        item_id = extract_item_id(link.get("href"), link.get("title"))
        if item_id is None:
            continue

        item_name = link.get_text(strip=True)
        if not item_name:
            continue

        image_cell = cells[IMAGE_COLUMN_INDEX] if len(cells) > IMAGE_COLUMN_INDEX else None
        image = image_cell.select_one("img") if image_cell is not None else None
        image_id = extract_image_id(image.get("src") if image else None)

        items.append(
            {
                "item_id": item_id,
                "item_name": item_name,
                "image_id": image_id,
                "item_type": None,
                "item_class": None,
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


# Scrape one chart across all pages, save each page in DB, and deduplicate rows by item ID.
def scrape_chart(
    page: Page, chart: str, connection: Connection, settings: PostgresSettings
) -> tuple[list[dict[str, int | str | None]], ChartStats]:
    """Scrape one chart, write each page to PostgreSQL, and collect chart-level statistics."""
    stats = ChartStats(chart=chart)
    skip_chart, last_item_count = should_skip_chart(connection, chart)
    if skip_chart:
        stats.skipped = True
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
            page_items = parse_items(page.content())
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

    with get_db_connection() as connection:
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
    settings = SETTINGS()
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
