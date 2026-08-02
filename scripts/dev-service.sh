#!/bin/sh

set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
ROOT_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/.." && pwd)

SERVICE="$1"
ACTION="$2"

API_PORT=8020
FRONT_PORT=5173
BACKEND_DIR="$ROOT_DIR/apps/back-end"
FRONTEND_DIR="$ROOT_DIR/apps/front-end"
VITE_BIN="$ROOT_DIR/node_modules/.bin/vite"

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

usage() {
  echo "Usage: sh ./scripts/dev-service.sh <api|front> <start|stop|restart|status>"
  exit 1
}

if [ -z "$SERVICE" ] || [ -z "$ACTION" ]; then
  usage
fi

get_port() {
  case "$1" in
    api) echo "$API_PORT" ;;
    front) echo "$FRONT_PORT" ;;
    *) usage ;;
  esac
}

is_running() {
  PORT="$1"
  nc -z localhost "$PORT" >/dev/null 2>&1
}

stop_service() {
  PORT="$1"
  NAME="$2"

  if is_running "$PORT"; then
    PIDS=$(lsof -ti tcp:"$PORT" || true)
    if [ -n "$PIDS" ]; then
      echo "Stopping $NAME on port $PORT (PID: $PIDS)"
      kill $PIDS || true
      sleep 0.5
    fi
  fi

  if is_running "$PORT"; then
    PIDS=$(lsof -ti tcp:"$PORT" || true)
    if [ -n "$PIDS" ]; then
      echo "Force stopping $NAME on port $PORT (PID: $PIDS)"
      kill -9 $PIDS || true
    fi
  fi
}

start_api() {
  if is_running "$API_PORT"; then
    echo "API already running on port $API_PORT."
    return
  fi

  echo "Starting API..."
  (
    load_env_file "$BACKEND_DIR/config/.env.dev"
    cd "$BACKEND_DIR"
    npm run dev
  ) &
}

start_front() {
  if is_running "$FRONT_PORT"; then
    echo "Front already running on port $FRONT_PORT."
    return
  fi

  echo "Starting front..."
  (
    load_env_file "$FRONTEND_DIR/config/.env.dev"
    cd "$FRONTEND_DIR"
    "$VITE_BIN"
  ) &
}

PORT="$(get_port "$SERVICE")"

case "$ACTION" in
  status)
    if is_running "$PORT"; then
      echo "$SERVICE is running on port $PORT."
    else
      echo "$SERVICE is stopped."
    fi
    ;;
  start)
    if [ "$SERVICE" = "api" ]; then
      start_api
    else
      start_front
    fi
    ;;
  stop)
    stop_service "$PORT" "$SERVICE"
    ;;
  restart)
    stop_service "$PORT" "$SERVICE"
    if [ "$SERVICE" = "api" ]; then
      start_api
    else
      start_front
    fi
    ;;
  *)
    usage
    ;;
esac
