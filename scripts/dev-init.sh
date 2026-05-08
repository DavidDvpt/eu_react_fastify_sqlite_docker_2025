#!/bin/sh

set -e

DB_CONTAINER="app_eu_db_dev"
DB_PORT=5433
API_PORT=8020
FRONT_PORT=5173
DB_COMPOSE_PROJECT="app_eu_dev"
DB_COMPOSE_FILE="docker/docker-compose.dev.yml"

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
cd back-end

echo "💣 Resetting database..."
npx dotenv -e .env -- prisma migrate reset --force

echo "🧱 Applying migrations..."
npx dotenv -e .env -- prisma migrate dev --name init

echo "🔧 Generating Prisma Client..."
npx dotenv -e .env -- prisma generate

echo "🌱 Running seed..."
npx dotenv -e .env -- prisma db seed

# 3. Start backend if not already running
if nc -z localhost $API_PORT; then
  echo "⚠️ Backend already running on port $API_PORT."
else
  echo "🚀 Starting backend dev server..."
  npx dotenv -e .env -- npm run dev &
fi

cd ..

# 4. Wait for backend
echo "⏳ Waiting for backend on port $API_PORT..."
until nc -z localhost $API_PORT; do
  sleep 0.5
done

# 5. Start frontend if not running
if nc -z localhost $FRONT_PORT; then
  echo "⚠️ Frontend already running on port $FRONT_PORT."
else
  echo "🎨 Starting frontend dev server..."
  cd front-end
  npm run dev &
  cd ..
fi

echo ""
echo "-----------------------------------------"
echo "✅ ALL SERVICES STARTED"
echo "DB       → localhost:$DB_PORT"
echo "API      → http://localhost:$API_PORT"
echo "Front    → http://localhost:$FRONT_PORT"
echo "-----------------------------------------"
