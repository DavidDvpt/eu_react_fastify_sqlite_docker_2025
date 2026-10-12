#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(CDPATH= cd "$SCRIPT_DIR/.." && pwd)"
DOCKERFILE="$ROOT_DIR/docker/prod/Dockerfile.frontend.prod"
IMAGE_TAG="${IMAGE_TAG:-latest}"
IMAGE="entropia-manager-frontend:$IMAGE_TAG"

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not installed." >&2
  exit 1
fi

if ! docker buildx version >/dev/null 2>&1; then
  echo "Docker Buildx is required." >&2
  exit 1
fi

echo "Building $IMAGE..."
build_image() {
  docker buildx build \
    --platform "${PLATFORM:-linux/amd64}" \
    --load \
    --pull \
    -f "$DOCKERFILE" \
    -t "$IMAGE" \
    "$@" \
    "$ROOT_DIR"
}

if [ "$IMAGE_TAG" != "latest" ]; then
  build_image -t "entropia-manager-frontend:latest"
else
  build_image
fi
echo "Build complete."
