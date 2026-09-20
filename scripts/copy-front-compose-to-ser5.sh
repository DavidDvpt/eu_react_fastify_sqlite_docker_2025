#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

SOURCE_FILE="$ROOT_DIR/docker/prod/docker-compose.entropia-manager-frontend.yml"
REMOTE_DIR="/opt/docker"
REMOTE_FILE="$REMOTE_DIR/entropia-manager-frontend.compose.yaml"
REMOTE="ser5"

if ! command -v rsync >/dev/null 2>&1; then
  echo "error: rsync is required but not installed." >&2
  exit 1
fi

if ! command -v ssh >/dev/null 2>&1; then
  echo "error: ssh is required but not installed." >&2
  exit 1
fi

if [[ ! -f "$SOURCE_FILE" ]]; then
  echo "error: compose file not found: $SOURCE_FILE" >&2
  exit 1
fi

echo "Preparing $REMOTE:$REMOTE_DIR"
ssh "$REMOTE" "mkdir -p '$REMOTE_DIR'"

echo "Copying $SOURCE_FILE"
rsync -avz \
  --chmod=Fu=rw,Fgo= \
  "$SOURCE_FILE" \
  "$REMOTE:$REMOTE_FILE"

echo "done: $REMOTE:$REMOTE_FILE"
