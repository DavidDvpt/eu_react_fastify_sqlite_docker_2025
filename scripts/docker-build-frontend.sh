#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
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
BUILD_ARGS=(
  --platform "${PLATFORM:-linux/amd64}"
  --load
  --pull
  -f "$DOCKERFILE"
  -t "$IMAGE"
)

if [[ "$IMAGE_TAG" != "latest" ]]; then
  BUILD_ARGS+=( -t "entropia-manager-frontend:latest" )
fi

docker buildx build \
  "${BUILD_ARGS[@]}" \
  "$ROOT_DIR"
echo "Build complete."
