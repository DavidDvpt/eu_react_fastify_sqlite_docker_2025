#!/usr/bin/env bash
set -euo pipefail

export SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"

export DB_SERVICE="db"
export DB_PORT_HOST=5434
export DB_URL="postgresql://postgres:postgres@localhost:${DB_PORT_HOST}/app_test"

sh "$SCRIPT_DIR/test-db.sh"

echo "🧪 Running API tests (ex: e2e)..."
DATABASE_URL="$DB_URL" npm --prefix back-end run test

echo "🧪 Running frontend tests..."
# npm --prefix front-end test