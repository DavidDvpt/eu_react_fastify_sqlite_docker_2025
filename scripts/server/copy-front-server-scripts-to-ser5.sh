#!/usr/bin/env bash
set -Eeuo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/../.." && pwd)"

REMOTE="ser5"
REMOTE_DIR="scripts"

SOURCE_DIR="$ROOT_DIR/scripts/server"
SOURCE_FILES=(
  "$SOURCE_DIR/entropia-manager-frontend-start.sh"
  "$SOURCE_DIR/entropia-manager-frontend-stop.sh"
)

if ! command -v rsync >/dev/null 2>&1; then
  echo "error: rsync is required but not installed." >&2
  exit 1
fi

if ! command -v ssh >/dev/null 2>&1; then
  echo "error: ssh is required but not installed." >&2
  exit 1
fi

for source_file in "${SOURCE_FILES[@]}"; do
  if [[ ! -f "$source_file" ]]; then
    echo "error: script not found: $source_file" >&2
    exit 1
  fi
done

echo "Preparing $REMOTE:$REMOTE_DIR"
ssh "$REMOTE" "mkdir -p '$REMOTE_DIR'"

echo "Copying frontend server scripts"
rsync -avz \
  --chmod=Fu=rwx,Fgo= \
  "${SOURCE_FILES[@]}" \
  "$REMOTE:$REMOTE_DIR/"

echo "done: $REMOTE:$REMOTE_DIR"
