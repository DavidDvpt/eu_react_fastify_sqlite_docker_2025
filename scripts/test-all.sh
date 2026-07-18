#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

echo "***********************"
echo "🧪 Running BDD tests..."
echo "***********************"
sh "$ROOT_DIR/apps/back-end/scripts/test-db.sh"

echo "***********************"
echo "🧪 Running API tests..."
echo "***********************"
(
  cd "$ROOT_DIR/apps/back-end"
  npm run test:api
)

echo "***********************"
echo "🧪 Running frontend tests..."
echo "***********************"
(
  cd "$ROOT_DIR/apps/front-end"
  npm run test:front
)
