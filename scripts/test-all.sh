#!/bin/sh
set -eu

SCRIPT_DIR="$(CDPATH= cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(CDPATH= cd "$SCRIPT_DIR/.." && pwd)"

echo "***********************"
echo "🧪 Running frontend tests..."
echo "***********************"
(
  cd "$ROOT_DIR/apps/frontend"
  npm run test:front
)
