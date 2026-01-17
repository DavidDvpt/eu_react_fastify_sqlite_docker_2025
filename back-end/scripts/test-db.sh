#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)" # back-end

DB_SERVICE="db"
DB_NAME="app_test"
DB_PORT_HOST=5434
DB_URL="postgresql://postgres:postgres@localhost:${DB_PORT_HOST}/${DB_NAME}"

COMPOSE_FILE="$ROOT_DIR/docker/docker-compose.test.yml"
COMPOSE_PROJECT="${COMPOSE_PROJECT:-app_eu_test}"
export CI="${CI:-1}"

cleanup() {
  docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" down --remove-orphans
}
trap cleanup EXIT

cleanup

echo "🏗️  Starting test stack..."
docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" up -d "$DB_SERVICE"

echo "⏳ Waiting for Postgres..."
ready=0
for i in {1..30}; do
  if docker compose -p "$COMPOSE_PROJECT" -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" pg_isready -U postgres -d "$DB_NAME" >/dev/null 2>&1; then
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

cd "$ROOT_DIR"

echo "🧪 Running DB migrations/seed if needed..."
DATABASE_URL="$DB_URL" npm run prisma:deploy

echo "🧪 Running repositories and bdd tests..."
DATABASE_URL="$DB_URL" npm run test:bdd -- --run
