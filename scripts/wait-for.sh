#!/usr/bin/env bash
# Usage: ./wait-for.sh host:port [-- command args...]

set -e

HOSTPORT="$1"
shift

HOST="${HOSTPORT%:*}"
PORT="${HOSTPORT#*:}"
TIMEOUT="${TIMEOUT:-60}"

echo "Waiting for $HOST:$PORT up to ${TIMEOUT}s ..."
for i in $(seq $TIMEOUT); do
  (echo > /dev/tcp/$HOST/$PORT) >/dev/null 2>&1 && {
    echo "✓ $HOST:$PORT is ready"
    exec "$@"
    exit 0
  }
  sleep 1
done

echo "✗ Timeout waiting for $HOST:$PORT"
exit 1
