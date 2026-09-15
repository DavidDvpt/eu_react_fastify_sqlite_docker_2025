#!/bin/sh

set -e

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
FRONTEND_DIR=$(CDPATH= cd -- "$SCRIPT_DIR/../apps/front-end" && pwd)
FRONT_PORT=5173
SERVICE="${1:-}"
ACTION="${2:-}"

if [ "$SERVICE" != "front" ] || [ -z "$ACTION" ]; then
  echo "Usage: sh ./scripts/dev-service.sh front <start|stop|restart|status>"
  exit 1
fi

is_running() {
  nc -z localhost "$FRONT_PORT" >/dev/null 2>&1
}

stop_front() {
  if is_running; then
    PIDS=$(lsof -ti tcp:"$FRONT_PORT" || true)
    [ -z "$PIDS" ] || kill $PIDS || true
  fi
}

start_front() {
  if is_running; then
    echo "Front already running on port $FRONT_PORT."
    return
  fi

  echo "Starting front..."
  cd "$FRONTEND_DIR"
  npm run dev &
}

case "$ACTION" in
  status)
    if is_running; then echo "front is running on port $FRONT_PORT."; else echo "front is stopped."; fi
    ;;
  start) start_front ;;
  stop) stop_front ;;
  restart) stop_front; start_front ;;
  *) echo "Usage: sh ./scripts/dev-service.sh front <start|stop|restart|status>"; exit 1 ;;
esac
