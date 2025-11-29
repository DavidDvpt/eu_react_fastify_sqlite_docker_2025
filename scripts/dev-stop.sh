#!/bin/sh

set -e

DB_CONTAINER="app_eu_db_dev"
API_PORT=8020
FRONT_PORT=5173

echo "-----------------------------------------"
echo "🛑 DEV STOP SCRIPT"
echo "-----------------------------------------"

# 1. Stop backend
echo "🛑 Stopping backend (port $API_PORT)..."
if lsof -i:$API_PORT >/dev/null 2>&1; then
  # Cherche le PID qui écoute sur le port 8020
  PID=$(lsof -ti tcp:$API_PORT)
  echo "   → Killing backend process PID $PID"
  kill -9 $PID
else
  echo "   → Backend not running."
fi

# 2. Stop frontend
echo "🛑 Stopping frontend (port $FRONT_PORT)..."
if lsof -i:$FRONT_PORT >/dev/null 2>&1; then
  PID=$(lsof -ti tcp:$FRONT_PORT)
  echo "   → Killing frontend process PID $PID"
  kill -9 $PID
else
  echo "   → Frontend not running."
fi

# 3. Stop Docker DB
echo "🛑 Stopping PostgreSQL container..."
if docker ps --format '{{.Names}}' | grep -q "$DB_CONTAINER"; then
  docker compose -f docker/docker-compose.dev.yml down
  echo "   → PostgreSQL stopped."
else
  echo "   → PostgreSQL container not running."
fi

echo "-----------------------------------------"
echo "✅ ALL DEV SERVICES STOPPED"
echo "DB       → stopped"
echo "API      → stopped"
echo "Front    → stopped"
echo "-----------------------------------------"
