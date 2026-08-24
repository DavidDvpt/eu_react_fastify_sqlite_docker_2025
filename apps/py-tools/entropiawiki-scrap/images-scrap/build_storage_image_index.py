from __future__ import annotations

import sys
from pathlib import Path

from storage_image_index import build_storage_image_index, get_default_storage_index_path, write_storage_image_index


SCRIPT_DIR = Path(__file__).resolve().parent


def main() -> None:
    """Build the local image index JSON from the current image scraper directory structure."""
    index = build_storage_image_index(SCRIPT_DIR)
    index_path = get_default_storage_index_path(SCRIPT_DIR)
    write_storage_image_index(SCRIPT_DIR, index, index_path)

    micro_count = len(index.micro)
    normal_count = len(index.normal)
    original_count = len(index.original)
    print(
        f"[done] index written: {index_path} "
        f"(micro={micro_count}, normal={normal_count}, original={original_count}, generatedAt={index.generatedAt})"
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("[fatal]", error, file=sys.stderr)
        raise SystemExit(1) from error
