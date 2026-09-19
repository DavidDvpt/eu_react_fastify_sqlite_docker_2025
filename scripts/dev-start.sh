#!/bin/sh

set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
FRONTEND_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/../apps/frontend" && pwd)
FRONT_PORT=5173

if [ "${1:-}" != "" ]; then
  echo "Usage: sh ./scripts/dev-start.sh"
  exit 1
fi

echo "-----------------------------------------"
echo "🚀 FRONTEND DEV START"
echo "-----------------------------------------"

if nc -z localhost "$FRONT_PORT" >/dev/null 2>&1; then
  echo "⚠️ Frontend already running on port $FRONT_PORT."
else
  echo "🎨 Starting frontend dev server..."
  cd "$FRONTEND_DIR"
  npm run dev &
fi

echo "✅ Frontend → http://localhost:$FRONT_PORT"
