#!/bin/sh
set -eu

SCRIPT_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/../.." && pwd)"

COMPOSE_SOURCE="$ROOT_DIR/docker/prod/entropia-manager-frontend.yaml"
COMPOSE_DIR="/opt/docker"
COMPOSE_FILE="$COMPOSE_DIR/entropia-manager-frontend.yaml"
SCRIPTS_DIR="$HOME/scripts"
IMAGE_TAG="${IMAGE_TAG:-latest}"
IMAGE="entropia-manager-frontend:$IMAGE_TAG"
PLATFORM="${PLATFORM:-linux/amd64}"

if ! command -v docker >/dev/null 2>&1; then
  echo "error: Docker is required but not installed" >&2
  exit 1
fi

if ! docker buildx version >/dev/null 2>&1; then
  echo "error: Docker Buildx is required" >&2
  exit 1
fi

if [ ! -f "$COMPOSE_SOURCE" ]; then
  echo "error: compose file not found: $COMPOSE_SOURCE" >&2
  exit 1
fi

echo "Building $IMAGE"
PLATFORM="$PLATFORM" IMAGE_TAG="${IMAGE_TAG:-latest}" \
  "$ROOT_DIR/scripts/docker-build-frontend.sh"

echo "Installing Compose file in $COMPOSE_FILE"
mkdir -p "$COMPOSE_DIR"
cp -f "$COMPOSE_SOURCE" "$COMPOSE_FILE"
chmod 0644 "$COMPOSE_FILE"

echo "Installing frontend control scripts in $SCRIPTS_DIR"
mkdir -p "$SCRIPTS_DIR"
cp -f \
  "$SCRIPT_DIR/entropia-manager-frontend-start.sh" \
  "$SCRIPT_DIR/entropia-manager-frontend-stop.sh" \
  "$SCRIPTS_DIR/"
chmod u+x \
  "$SCRIPTS_DIR/entropia-manager-frontend-start.sh" \
  "$SCRIPTS_DIR/entropia-manager-frontend-stop.sh"

echo "Starting frontend"
exec sh "$SCRIPTS_DIR/entropia-manager-frontend-start.sh"
