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
: "${REMOTE_COMPOSE_NAME:?REMOTE_COMPOSE_NAME is required}"
: "${REMOTE_ENV_NAME:?REMOTE_ENV_NAME is required}"

LOCAL_COMPOSE="$ROOT_DIR/docker/prod/server/docker-compose.entropia-manager.yml"
LOCAL_ENV_RUNTIME="$SCRIPT_DIR/.env.prod.runtime"

if [[ ! -f "$LOCAL_COMPOSE" ]]; then
  echo "Missing compose file: $LOCAL_COMPOSE"
  exit 1
fi

if [[ ! -f "$LOCAL_ENV_RUNTIME" ]]; then
  echo "Missing runtime env file: $LOCAL_ENV_RUNTIME"
  exit 1
fi

echo "Preparing remote directory..."
ssh "$SSH_TARGET" "mkdir -p $REMOTE_DIR/docker"

echo "Copying compose..."
scp "$LOCAL_COMPOSE" "$SSH_TARGET:$REMOTE_DIR/docker/$REMOTE_COMPOSE_NAME"

echo "Copying runtime env..."
scp "$LOCAL_ENV_RUNTIME" "$SSH_TARGET:$REMOTE_DIR/$REMOTE_ENV_NAME"

echo "Done."
echo "Remote compose: $REMOTE_DIR/docker/$REMOTE_COMPOSE_NAME"
echo "Remote env:     $REMOTE_DIR/$REMOTE_ENV_NAME"
