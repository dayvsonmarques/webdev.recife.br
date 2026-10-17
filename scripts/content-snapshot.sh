#!/usr/bin/env bash
# Salva o conteúdo do painel local em lib/site-content.json — o site usa esse arquivo quando ADMIN_API_URL não está definido.
set -euo pipefail

URL="${ADMIN_API_URL:-http://localhost:3310/paineldosite}/api/public/site"
OUT="$(cd "$(dirname "$0")/.." && pwd)/lib/site-content.json"

curl -sf "$URL" | jq . > "$OUT.tmp" && mv "$OUT.tmp" "$OUT"
echo "✔ snapshot: $OUT"
