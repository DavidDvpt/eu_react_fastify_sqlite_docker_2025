#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker/docker-compose.prod.yml"
ENV_FILE="$SCRIPT_DIR/.env"
PLATFORM="${PLATFORM:-linux/amd64}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "Docker is required but not installed."
  exit 1
fi

if [[ -z "${DOCKERHUB_NAMESPACE:-}" ]]; then
  echo "Missing DOCKERHUB_NAMESPACE. Example: export DOCKERHUB_NAMESPACE='mydockerhubuser'"
  exit 1
fi

if [[ -z "${IMAGE_TAG:-}" ]]; then
  echo "Missing IMAGE_TAG. Example: export IMAGE_TAG='v1.0.0'"
  exit 1
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Missing DATABASE_URL (required by docker-compose.prod.yml)."
  exit 1
fi

export VITE_API_URL="${VITE_API_URL}"

echo "-----------------------------------------"
echo "🐳 Docker Hub build + push (prod)"
echo "Namespace : $DOCKERHUB_NAMESPACE"
echo "Tag       : $IMAGE_TAG"
echo "Platform  : $PLATFORM"
echo "VITE_API_URL: $VITE_API_URL"
echo "-----------------------------------------"

echo "[1/4] Checking Docker login..."
if ! docker info >/dev/null 2>&1; then
  echo "Docker daemon is not reachable. Start Docker and retry."
  exit 1
fi

echo "[2/4] Ensuring buildx builder..."
if ! docker buildx inspect >/dev/null 2>&1; then
  docker buildx create --use
fi
docker buildx inspect --bootstrap >/dev/null

echo "[3/4] Building + pushing API image..."
docker buildx build \
  --platform "$PLATFORM" \
  -f "$ROOT_DIR/docker/Dockerfile.api.prod" \
  -t "${DOCKERHUB_NAMESPACE}/entropia-manager-api:${IMAGE_TAG}" \
  --push \
  "$ROOT_DIR"

echo "[4/4] Building + pushing Front image..."
docker buildx build \
  --platform "$PLATFORM" \
  -f "$ROOT_DIR/docker/Dockerfile.front.prod" \
  --build-arg "VITE_API_URL=$VITE_API_URL" \
  -t "${DOCKERHUB_NAMESPACE}/entropia-manager-front:${IMAGE_TAG}" \
  --push \
  "$ROOT_DIR"

echo "✅ Build + push complete."
echo "API   : ${DOCKERHUB_NAMESPACE}/entropia-manager-api:${IMAGE_TAG}"
echo "Front : ${DOCKERHUB_NAMESPACE}/entropia-manager-front:${IMAGE_TAG}"
