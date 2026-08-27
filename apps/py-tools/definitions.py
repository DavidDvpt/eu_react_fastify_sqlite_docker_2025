from dataclasses import dataclass, field

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