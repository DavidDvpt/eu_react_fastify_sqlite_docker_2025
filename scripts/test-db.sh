#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker/docker-compose.test.yml"
COMPOSE_PROJECT="${COMPOSE_PROJECT:-app_eu_test}"
DB_CONTAINER="${DB_CONTAINER:-app_eu_db_test}"
export CI="${CI:-1}"

cleanup() {
  docker rm -f "$DB_CONTAINER" >/dev/null 2>&1 || true
  docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" down --remove-orphans
}
trap cleanup EXIT

# Pre-clean to avoid name conflicts before starting
cleanup

echo "🏗️  Starting test stack..."
docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" up -d "$DB_SERVICE"

echo "⏳ Waiting for Postgres..."
ready=0
for i in {1..30}; do
  if docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" pg_isready -U postgres -d app_dev >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 1
done

if [ "$ready" -ne 1 ]; then
  echo "❌ Postgres not ready after 30s"
  docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" logs "$DB_SERVICE"
  exit 1
fi

echo "🧪 Running DB migrations/seed if needed..."
DATABASE_URL="$DB_URL" npm --prefix back-end run prisma:deploy

echo "🧪 Running repositories and bdd tests..."
DATABASE_URL="$DB_URL" npm --prefix back-end run test:bdd -- --run
