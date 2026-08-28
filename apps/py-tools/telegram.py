# Send one Telegram message when the bot token and chat id are configured.
from urllib.parse import urlencode
from urllib.request import urlopen
from db import PostgresSettings
from definitions import ChartStats

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

    if stats.skipped:
        return (
            f"EntropiaWiki chart scrape\n"
            f"Chart: {stats.chart}\n"
            f"Skipped: {'yes' if stats.skipped else 'no'}\n"
        )
    
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