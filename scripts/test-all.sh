#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
COMPOSE_FILE="$ROOT_DIR/docker/docker-compose.test.yaml"

DB_SERVICE="db"
DB_PORT_HOST=5434
DB_URL="postgresql://postgres:postgres@localhost:${DB_PORT_HOST}/app_dev"

cleanup() {
  docker compose -p app_eu_test -f "$COMPOSE_FILE" down --remove-orphans
}
trap cleanup EXIT

echo "🏗️  Starting test stack..."
docker compose -f "$COMPOSE_FILE" up -d "$DB_SERVICE"

echo "⏳ Waiting for Postgres..."
ready=0
for i in {1..30}; do
  if docker compose -p app_eu_test -f "$COMPOSE_FILE" exec -T "$DB_SERVICE" pg_isready -U postgres -d app_dev >/dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 1
done

if [ "$ready" -ne 1 ]; then
  echo "❌ Postgres not ready after 30s"
  docker compose -p app_eu_test -f "$COMPOSE_FILE" logs "$DB_SERVICE"
  exit 1
fi

echo "🧪 Running DB migrations/seed if needed..."
DATABASE_URL="$DB_URL" npm --prefix back-end run prisma:deploy

echo "🧪 Running repositories and bdd tests..."
DATABASE_URL="$DB_URL" npm --prefix back-end run test:bdd

echo "🧪 Running API tests (ex: e2e)..."
# DATABASE_URL="$DB_URL" npm --prefix back-end run test:e2e

echo "🧪 Running frontend tests..."
# npm --prefix front-end test