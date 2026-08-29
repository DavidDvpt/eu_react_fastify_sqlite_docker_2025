from pathlib import Path
import sys

CURRENT_DIR = Path(__file__).resolve().parent
DB_DIR = CURRENT_DIR / 'db'

sys.path.insert(0, str(DB_DIR))

from db import connect_database, load_postgres_settings

SETTINGS = load_postgres_settings()

def get_db_connection():
    settings = load_postgres_settings()
    return connect_database(settings)


if __name__ == "__main__":
    get_db_connection()