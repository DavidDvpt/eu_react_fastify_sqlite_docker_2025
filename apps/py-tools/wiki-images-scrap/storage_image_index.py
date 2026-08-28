from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import urlopen



INDEX_FILE_NAME = "image-index.json"

CURRENT_DIR = Path(__file__).resolve().parent
ROOT_DIR = CURRENT_DIR.parent
ENV_PATH = CURRENT_DIR / ".env"

from constants import VARIANTS


@dataclass
class StorageImageIndex:
    generatedAt: str
    micro: dict[str, str]
    normal: dict[str, str]
    original: dict[str, str]

    def to_dict(self) -> dict[str, Any]:
        return {
            "generatedAt": self.generatedAt,
            "micro": self.micro,
            "normal": self.normal,
            "original": self.original,
        }


def _iso_now() -> str:
    """Return the current UTC timestamp formatted for JSON metadata."""
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")





def format_variant_token(variant: str) -> str:
    """Return the canonical file-name token used for a variant in stored image files."""
    return variant[:1].upper() + variant[1:].lower()


def get_default_storage_index_path(storage_dir: Path) -> Path:
    """Return the default JSON index path located at the root of the image storage."""
    return storage_dir / INDEX_FILE_NAME


def build_storage_image_index(storage_dir: Path) -> StorageImageIndex:
    """Scan the micro, normal, and original folders and build an id-to-relative-path index."""
    variant_indexes: dict[str, dict[str, str]] = {variant: {} for variant in VARIANTS}

    for variant in VARIANTS:
        current_dir = storage_dir / variant
        if not current_dir.is_dir():
            continue

        entries = sorted(current_dir.iterdir(), key=lambda entry: entry.name.casefold())
        for entry in entries:
            if not entry.is_file():
                continue

            parsed = parse_variant_file_name(entry.name, variant)
            if not parsed:
                continue

            image_id, _extension = parsed
            relative_path = entry.relative_to(storage_dir).as_posix()
            variant_indexes[variant].setdefault(image_id, relative_path)

    return StorageImageIndex(
        generatedAt=_iso_now(),
        micro=variant_indexes["micro"],
        normal=variant_indexes["normal"],
        original=variant_indexes["original"],
    )


def write_storage_image_index(
    storage_dir: Path,
    index: StorageImageIndex,
    index_path: Path | None = None,
) -> None:
    """Serialize the computed storage index to JSON on disk."""
    target_path = index_path or get_default_storage_index_path(storage_dir)
    target_path.parent.mkdir(parents=True, exist_ok=True)
    target_path.write_text(json.dumps(index.to_dict(), indent=2), encoding="utf-8")


def validate_storage_image_index(parsed: Any, source_label: str) -> StorageImageIndex:
    """Validate a raw JSON payload and normalize it into the typed storage index structure."""
    if (
        not isinstance(parsed, dict)
        or not isinstance(parsed.get("micro"), dict)
        or not isinstance(parsed.get("normal"), dict)
        or not isinstance(parsed.get("original"), dict)
    ):
        raise ValueError(f"Invalid storage image index at {source_label}")

    generated_at = parsed.get("generatedAt")
    if not isinstance(generated_at, str):
        generated_at = datetime.fromtimestamp(0, timezone.utc).isoformat(timespec="milliseconds").replace(
            "+00:00", "Z"
        )

    return StorageImageIndex(
        generatedAt=generated_at,
        micro={str(key): str(value) for key, value in parsed["micro"].items()},
        normal={str(key): str(value) for key, value in parsed["normal"].items()},
        original={str(key): str(value) for key, value in parsed["original"].items()},
    )


def load_storage_image_index(
    storage_dir: Path,
    index_path: Path | None = None,
) -> StorageImageIndex:
    """Load and validate a storage index JSON file from disk."""
    target_path = index_path or get_default_storage_index_path(storage_dir)
    parsed = json.loads(target_path.read_text(encoding="utf-8"))
    return validate_storage_image_index(parsed, str(target_path))


def download_storage_image_index(remote_url: str) -> StorageImageIndex:
    """Fetch a remote storage index JSON file and validate its structure."""
    try:
        with urlopen(remote_url) as response:
            parsed = json.load(response)
    except (HTTPError, URLError) as exc:
        raise RuntimeError(f"Unable to download storage image index from {remote_url}") from exc

    return validate_storage_image_index(parsed, remote_url)
