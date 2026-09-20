#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker/prod/docker-compose.entropia-manager-frontend.yml"
ENV_FILE="$ROOT_DIR/docker/prod/.env.prod.build"
DOCKERHUB_NAMESPACE="lamouche42"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not installed." >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "Docker Compose v2 is required." >&2
  exit 1
fi

echo "Building ${DOCKERHUB_NAMESPACE}/entropia-manager-frontend:${IMAGE_TAG:-latest}..."
docker compose -f "$COMPOSE_FILE" build --pull frontend
echo "Build complete."
