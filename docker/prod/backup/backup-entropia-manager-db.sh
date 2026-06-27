#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DEFAULT_ENV_FILE="$SCRIPT_DIR/.env"
ENV_FILE="${ENV_FILE:-$DEFAULT_ENV_FILE}"
echo "Using env file: $ENV_FILE"
if [ -f "$ENV_FILE" ]; then
  # shellcheck disable=SC1090
  . "$ENV_FILE"
fi

if [ -z "${API_CONTAINER_NAME:-}" ]; then
  echo "API_CONTAINER_NAME is required"
  exit 1
fi

if [ -z "${BACKUP_DIR:-}" ]; then
  echo "BACKUP_DIR is required"
  exit 1
fi

if [ -z "${RETENTION_DAYS:-}" ]; then
  echo "RETENTION_DAYS is required"
  exit 1
fi

if [ -z "${BACKUP_PREFIX:-}" ]; then
  echo "BACKUP_PREFIX is required"
  exit 1
fi

FILES_DIR="$BACKUP_DIR/files"
mkdir -p "$FILES_DIR"

if ! docker inspect -f '{{.State.Running}}' "$API_CONTAINER_NAME" >/dev/null 2>&1; then
  echo "Container not running: $API_CONTAINER_NAME"
  exit 1
fi

TODAY="$(date +%F)"
BACKUP_FILE="$FILES_DIR/${BACKUP_PREFIX}_${TODAY}.sql.gz"
TMP_FILE="${BACKUP_FILE}.tmp"

echo "Creating backup: $BACKUP_FILE"
docker exec "$API_CONTAINER_NAME" sh -lc 'pg_dump "$DATABASE_URL"' | gzip -c > "$TMP_FILE"
mv "$TMP_FILE" "$BACKUP_FILE"

echo "Cleaning backups older than ${RETENTION_DAYS} days..."
find "$FILES_DIR" -type f -name "${BACKUP_PREFIX}_*.sql.gz" -mtime +"$RETENTION_DAYS" -print -delete

echo "Backup completed."
