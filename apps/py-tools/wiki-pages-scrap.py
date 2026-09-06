# Run the full scrape flow from browser automation to DB upserts and JSON export.
import json
import sys
from pathlib import Path

CURRENT_DIR = Path(__file__).resolve().parent
DB_DIR = CURRENT_DIR / 'db'
TOOLS_DIR = CURRENT_DIR / 'wiki-pages-scrap'
OUTPUT_PATH = TOOLS_DIR / "chart-item-image-map.json"

sys.path.insert(0, str(DB_DIR))
sys.path.insert(0, str(TOOLS_DIR))
sys.path.insert(0, str(CURRENT_DIR))

from db import connect_database, load_postgres_settings
from definitions import PostgresSettings
from scrap_chart_tools import raise_on_failed_charts, scrape_all_charts

CHARTS = [
    "Material",
    # "Finder",
    # "FinderAmplifier",
    # "FinderEnhancer",
    # "Excavator",
    # "Refiners",
    # "Scanner",
    # "FAP",
    # "MedicalEnhancer",
    # "MiscTool",
    # "Weapon",
    # "Armor",
    # "ArmorItem",
    # "ArmorEnhancer",
    # "Plating",
    # "Clothes",
    # "Vehicle",
    # "SpaceShips",
]

# Write the final deduplicated dataset to the local JSON output file.
def save_results(items: list[dict[str, int | str | None]], output_path: Path = OUTPUT_PATH) -> None:
    """Persist the final deduplicated result set to JSON."""
    output_path.write_text(json.dumps(items, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"[done] results written: {output_path}")


def main() -> None:
    settings = load_postgres_settings()
    dbConnection = connect_database(settings)
    items, chart_stats = scrape_all_charts(dbConnection, settings, CHARTS)
    # save_results(items)
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
