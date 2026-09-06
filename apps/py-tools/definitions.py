from dataclasses import dataclass, field
from typing import Optional
from pathlib import Path
@dataclass
class PostgresSettings:
    host: str
    port: int
    database: str
    user: str
    password: str
    download_base_url: str
    wiki_base_url:str
    telegram_bot_token: Optional[str]
    telegram_chat_id: Optional[str]

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

@dataclass(frozen=True)
class InitDbContext:
    app_name: str
    schema_sql_path: Path


@dataclass
class ExistingImageRecord:
    id_image: int
    variant: str
    extension: str
    file_name: str
    file_path: str

