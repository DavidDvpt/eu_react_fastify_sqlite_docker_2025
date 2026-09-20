#!/usr/bin/env bash
set -Eeuo pipefail

cd /opt/docker

COMPOSE_FILE="/opt/docker/entropia-manager-frontend.compose.yaml"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "error: compose file not found: $COMPOSE_FILE" >&2
  exit 1
fi

docker compose \
  -f "$COMPOSE_FILE" \
  pull frontend

docker compose \
  -f "$COMPOSE_FILE" \
  up -d --no-deps frontend
