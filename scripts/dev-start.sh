#!/bin/sh

set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)

DB_CONTAINER="app_eu_db_dev"
DB_PORT=5433
API_PORT=8020
FRONT_PORT=5173
DB_COMPOSE_PROJECT="app_eu_dev"
DB_COMPOSE_FILE="$ROOT_DIR/docker/docker-compose.dev.yml"
BACKEND_DIR="$ROOT_DIR/apps/back-end"
FRONTEND_DIR="$ROOT_DIR/apps/front-end"
PRISMA_BIN="$ROOT_DIR/node_modules/.bin/prisma"
VITE_BIN="$ROOT_DIR/node_modules/.bin/vite"
SKIP_FRONT=false

for arg in "$@"; do
  case "$arg" in
    --skip-front)
      SKIP_FRONT=true
      ;;
    *)
      echo "Unknown argument: $arg"
      echo "Usage: sh ./scripts/dev-start.sh [--skip-front]"
      exit 1
      ;;
  esac
done

load_env_file() {
  ENV_FILE="$1"

  if [ ! -f "$ENV_FILE" ]; then
    echo "Missing env file: $ENV_FILE"
    exit 1
  fi

  set -a
  # shellcheck disable=SC1090
  . "$ENV_FILE"
  set +a
}

if [ ! -x "$PRISMA_BIN" ]; then
  echo "Missing Prisma binary at $PRISMA_BIN"
  echo "Run npm install at the repository root first."
  exit 1
fi

if [ "$SKIP_FRONT" != "true" ] && [ ! -x "$VITE_BIN" ]; then
  echo "Missing Vite binary at $VITE_BIN"
  echo "Run npm install at the repository root first."
  exit 1
fi

echo "-----------------------------------------"
echo "🚀 DEV INIT SCRIPT"
echo "-----------------------------------------"

# 1. Docker DB
if docker ps --format '{{.Names}}' | grep -q "$DB_CONTAINER"; then
  echo "🐘 PostgreSQL container already running."
else
  echo "🔄 Starting Docker (PostgreSQL dev)..."
  docker compose -p "$DB_COMPOSE_PROJECT" -f "$DB_COMPOSE_FILE" up -d
fi

echo "⏳ Waiting for PostgreSQL on port $DB_PORT..."
until nc -z localhost $DB_PORT; do
  sleep 0.5
done

# 2. Reset + migrations
echo "📦 Moving into backend directory (Prisma init)..."
load_env_file "$BACKEND_DIR/config/.env.dev"
cd "$BACKEND_DIR"

echo "💣 Resetting database..."
"$PRISMA_BIN" migrate reset --force

echo "🧱 Applying migrations..."
"$PRISMA_BIN" migrate dev --name init

echo "🔧 Generating Prisma Client..."
"$PRISMA_BIN" generate

echo "🌱 Running seed..."
"$PRISMA_BIN" db seed

# 3. Start backend if not already running
if nc -z localhost $API_PORT; then
  echo "⚠️ Backend already running on port $API_PORT."
else
  echo "🚀 Starting backend dev server..."
  npm run dev &
fi

cd "$ROOT_DIR"

# 4. Wait for backend
echo "⏳ Waiting for backend on port $API_PORT..."
until nc -z localhost $API_PORT; do
  sleep 0.5
done

if [ "$SKIP_FRONT" = "true" ]; then
  echo "⏭️ Skipping frontend startup."
else
  # 5. Start frontend if not running
  if nc -z localhost $FRONT_PORT; then
    echo "⚠️ Frontend already running on port $FRONT_PORT."
  else
    echo "🎨 Starting frontend dev server..."
    load_env_file "$FRONTEND_DIR/config/.env.dev"
    cd "$FRONTEND_DIR"
    "$VITE_BIN" &
  fi
fi

echo ""
echo "-----------------------------------------"
if [ "$SKIP_FRONT" = "true" ]; then
  echo "✅ BACKEND DEV SERVICES STARTED"
else
  echo "✅ ALL SERVICES STARTED"
fi
echo "DB       → localhost:$DB_PORT"
echo "API      → http://localhost:$API_PORT"
if [ "$SKIP_FRONT" = "true" ]; then
  echo "Front    → skipped"
else
  echo "Front    → http://localhost:$FRONT_PORT"
fi
echo "-----------------------------------------"
