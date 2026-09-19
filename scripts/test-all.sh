#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

echo "***********************"
echo "🧪 Running frontend tests..."
echo "***********************"
(
  cd "$ROOT_DIR/apps/frontend"
  npm run test:front
)
