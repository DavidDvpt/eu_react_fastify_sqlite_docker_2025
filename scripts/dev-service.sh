#!/bin/sh

set -e

SERVICE="$1"
ACTION="$2"

API_PORT=8020
FRONT_PORT=5173

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
    cd back-end
    npx dotenv -e .env.dev -- npm run dev
  ) &
}

start_front() {
  if is_running "$FRONT_PORT"; then
    echo "Front already running on port $FRONT_PORT."
    return
  fi

  echo "Starting front..."
  (
    cd front-end
    npx env-cmd -f ./config/.env.dev -- npm run dev
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
