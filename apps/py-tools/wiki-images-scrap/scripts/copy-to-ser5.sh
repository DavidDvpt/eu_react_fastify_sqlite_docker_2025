#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
IMAGE_APP_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
APP_ROOT_DIR="$(cd -- "$IMAGE_APP_DIR/.." && pwd)"
SHARED_ROOT_DIR="$(cd -- "$APP_ROOT_DIR/.." && pwd)"
ENV_SCRIPT_FILE="$SCRIPT_DIR/.env.script"

if [[ ! -f "$ENV_SCRIPT_FILE" ]]; then
  echo "Missing $ENV_SCRIPT_FILE"
  echo "Copy .env.script.example to .env.script and fill values."
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_SCRIPT_FILE"
set +a

: "${SSH_TARGET:?SSH_TARGET is required}"
: "${REMOTE_DIR:?REMOTE_DIR is required}"

LOCAL_ENV_PROD="$APP_ROOT_DIR/.env.prod"

if [[ ! -f "$LOCAL_ENV_PROD" ]]; then
  echo "Missing production env file: $LOCAL_ENV_PROD"
  exit 1
fi

TMP_DIR="$(mktemp -d)"
STAGING_DIR="$TMP_DIR/images-scrap"

cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

mkdir -p "$STAGING_DIR"

echo "Preparing staging directory..."
cp "$IMAGE_APP_DIR/build_storage_image_index.py" "$STAGING_DIR/"
cp "$SHARED_ROOT_DIR/db.py" "$STAGING_DIR/"
cp "$IMAGE_APP_DIR/download_entropia_images.py" "$STAGING_DIR/"
cp "$IMAGE_APP_DIR/generate_gallery.py" "$STAGING_DIR/"
cp "$SHARED_ROOT_DIR/init_db.py" "$STAGING_DIR/"
cp "$APP_ROOT_DIR/requirements.txt" "$STAGING_DIR/"
cp "$IMAGE_APP_DIR/storage_image_index.py" "$STAGING_DIR/"

mkdir -p "$STAGING_DIR/sql"
cp "$SHARED_ROOT_DIR/sql/images-scrap.init_schema.sql" "$STAGING_DIR/sql/"

cp "$LOCAL_ENV_PROD" "$STAGING_DIR/.env"

echo "Preparing remote directory..."
ssh "$SSH_TARGET" "mkdir -p $REMOTE_DIR"

echo "Copying images-scrap app..."
scp -r "$STAGING_DIR/." "$SSH_TARGET:$REMOTE_DIR/"

echo "Done."
echo "Remote directory: $REMOTE_DIR"
echo "Remote env:       $REMOTE_DIR/.env"
