import re

VARIANTS = ("micro", "normal", "original")
IMAGE_FILE_PATTERN = re.compile(r"^(\d+)(micro|normal|original)\.(jpg|png)$", re.IGNORECASE)

def parse_variant_file_name(file_name: str, expected_variant: str) -> tuple[str, str] | None:
    """Parse one stored image file name and return its image id and extension when it matches the variant."""
    match = IMAGE_FILE_PATTERN.match(file_name)
    if not match:
        return None

    image_id, variant, extension = match.groups()
    if variant.lower() != expected_variant.lower():
        return None

    return image_id, extension.lower()