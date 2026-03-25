#!/usr/bin/env sh
set -eu

PUID=${PUID:-1000}
PGID=${PGID:-1000}

APP_USER="flowstruct"
APP_GROUP="flowstruct-group"

if [ "$(id -u)" = "0" ]; then
    if ! getent group "$APP_GROUP" >/dev/null 2>&1; then
        addgroup -g "$PGID" "$APP_GROUP"
    fi

    if ! id -u "$APP_USER" >/dev/null 2>&1; then
        adduser -u "$PUID" -G "$APP_GROUP" -D "$APP_USER"
    fi

    chown -R "$PUID:$PGID" /app

    exec gosu "$PUID:$PGID" "$0" "$@"
fi

echo ""
echo "  🚀  Starting Flowstruct..."
echo ""

export SITE_GENERATOR_API_KEY=$(openssl rand -hex 32)

if [ -f /app/app.jar ]; then
    echo "  Starting service..."
    java -jar /app/app.jar &
    SPRING_PID=$!
else
    echo "  ⚠️  Warning: /app/app.jar not found"
fi

TRUST_PROXY=${TRUST_PROXY:-false}

echo "  Starting reverse proxy service..."
if [ "$TRUST_PROXY" = "true" ]; then
    caddy run --adapter caddyfile --config /app/reverse-proxy/Caddyfile.trust-proxy &
    CADDY_PID=$!
else
    caddy run --adapter caddyfile --config /app/reverse-proxy/Caddyfile &
    CADDY_PID=$!
fi

sleep 1

if [ -f /app/app.jar ]; then
    echo "  ⌛️  Waiting for backend health..."
    until curl -sSf http://localhost:8080/actuator/health >/dev/null 2>&1; do
        echo "."
        sleep 1
    done
    echo "✓"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅  Flowstruct is running!"
echo "    → http://localhost:3000"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

wait
