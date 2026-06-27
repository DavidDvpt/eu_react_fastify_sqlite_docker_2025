#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/../../.." && pwd)"
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
: "${REMOTE_SCRIPT_NAME:?REMOTE_SCRIPT_NAME is required}"
: "${REMOTE_ENV_NAME:?REMOTE_ENV_NAME is required}"

LOCAL_SCRIPT="$SCRIPT_DIR/backup-entropia-manager-db.sh"
LOCAL_ENV="$SCRIPT_DIR/.env"

if [[ ! -f "$LOCAL_SCRIPT" ]]; then
  echo "Missing backup script: $LOCAL_SCRIPT"
  exit 1
fi

if [[ ! -f "$LOCAL_ENV" ]]; then
  echo "Missing env file: $LOCAL_ENV"
  exit 1
fi

echo "Preparing remote directory..."
ssh "$SSH_TARGET" "mkdir -p $REMOTE_DIR"

echo "Copying backup script..."
scp "$LOCAL_SCRIPT" "$SSH_TARGET:$REMOTE_DIR/$REMOTE_SCRIPT_NAME"

echo "Copying env..."
scp "$LOCAL_ENV" "$SSH_TARGET:$REMOTE_DIR/$REMOTE_ENV_NAME"

echo "Done."
echo "Remote script: $REMOTE_DIR/$REMOTE_SCRIPT_NAME"
echo "Remote env:    $REMOTE_DIR/$REMOTE_ENV_NAME"
