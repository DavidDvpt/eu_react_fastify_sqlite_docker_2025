#!/bin/sh

set -e

FRONT_PORT=5173

echo "🛑 Stopping frontend on port $FRONT_PORT..."
if lsof -i:"$FRONT_PORT" >/dev/null 2>&1; then
  PIDS=$(lsof -ti tcp:"$FRONT_PORT")
  kill $PIDS || true
else
  echo "Frontend not running."
fi

echo "✅ Frontend stopped"
