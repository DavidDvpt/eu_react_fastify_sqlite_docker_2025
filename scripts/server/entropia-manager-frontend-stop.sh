#!/usr/bin/env bash
set -Eeuo pipefail

cd /opt/docker

COMPOSE_FILE="/opt/docker/entropia-manager-frontend.yaml"
COMPOSE_PROJECT="entropia-manager-frontend"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "error: compose file not found: $COMPOSE_FILE" >&2
  exit 1
fi

docker compose \
  -p "$COMPOSE_PROJECT" \
  -f "$COMPOSE_FILE" \
  down --remove-orphans
