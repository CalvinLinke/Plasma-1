#!/usr/bin/env bash
# Trägt nur Notion-Variablen nach Vercel ein (Microsoft ist dort meist schon gesetzt).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"
# shellcheck source=scripts/vercel-plasma.sh
source "$ROOT/scripts/vercel-plasma.sh"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Fehlt: .env.local"
  exit 1
fi

get_env() {
  local key="$1"
  local value
  value="$(grep -E "^${key}=" "$ENV_FILE" | head -1 | cut -d= -f2- || true)"
  if [[ -z "$value" ]]; then
    echo "Fehlt in .env.local: $key" >&2
    exit 1
  fi
  printf '%s' "$value"
}

add_var() {
  local key="$1"
  local sensitive="${2:-false}"
  local value
  value="$(get_env "$key")"
  echo "→ $key"
  for env in production preview; do
    if [[ "$sensitive" == "true" ]]; then
      vercel_plasma env add "$key" "$env" --value "$value" --sensitive --force --yes
    else
      vercel_plasma env add "$key" "$env" --value "$value" --force --yes
    fi
  done
}

cd "$ROOT"
echo "Plasma-Vercel: $VERCEL_CONFIG_DIR"
echo ""

add_var NOTION_API_KEY true
add_var NOTION_PARENT_PAGE_ID false
add_var NOTION_LEADS_DATABASE_ID false

echo ""
echo "Notion-Variablen auf Vercel gesetzt."
