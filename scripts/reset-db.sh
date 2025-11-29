#!/bin/sh
set -e

DB_PATH="./data/dev.sqlite"

echo "Resetting DB at $DB_PATH..."

rm -f "$DB_PATH"
touch "$DB_PATH"

npx prisma migrate deploy

echo "Done."
