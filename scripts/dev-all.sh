#!/usr/bin/env bash
# Sobe tudo para desenvolvimento local: banco (Docker), painel e site.
# Ctrl+C encerra painel e site juntos.
set -euo pipefail

PANEL_DIR="${PANEL_DIR:-$(cd "$(dirname "$0")/../.." && pwd)/admin.webdev.recife.br}"
SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

docker start webdev-admin-db >/dev/null
echo "▶ banco: webdev-admin-db (porta 5436)"

(cd "$PANEL_DIR" && pnpm dev 2>&1 | sed 's/^/[painel] /') &
PANEL_PID=$!
trap 'kill $PANEL_PID 2>/dev/null; pkill -P $PANEL_PID 2>/dev/null; exit 0' INT TERM EXIT

echo "▶ aguardando o painel em http://localhost:3310/paineldosite ..."
for _ in $(seq 1 60); do
  curl -sf http://localhost:3310/paineldosite/api/health >/dev/null && break
  sleep 1
done
curl -sf http://localhost:3310/paineldosite/api/health >/dev/null || { echo "✖ o painel não subiu — veja as linhas [painel] acima"; exit 1; }

echo "▶ site: http://localhost:3210 · painel: http://localhost:3310/paineldosite"
cd "$SITE_DIR" && pnpm dev
