#!/usr/bin/env bash
# Liest Werte aus .env.local und trägt sie in Vercel (Production) ein.
# Nutzt den Plasma-Account unter ~/.vercel-plasma (getrennt vom persönlichen Login).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ENV_FILE="$ROOT/.env.local"
# shellcheck source=scripts/vercel-plasma.sh
source "$ROOT/scripts/vercel-plasma.sh"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Fehlt: .env.local"
  exit 1
fi

if [[ ! -f "$ROOT/.vercel/project.json" ]]; then
  echo "Projekt noch nicht verknüpft. Bitte zuerst:"
  echo "  npm run vercel:plasma:setup"
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
  if [[ "$sensitive" == "true" ]]; then
    vercel_plasma env add "$key" production --value "$value" --sensitive --force --yes
  else
    vercel_plasma env add "$key" production --value "$value" --force --yes
  fi
}

cd "$ROOT"
echo "Plasma-Vercel: $VERCEL_CONFIG_DIR"
echo ""

# Microsoft Graph
add_var MS_TENANT_ID false
add_var MS_CLIENT_ID false
add_var MS_CLIENT_SECRET true
add_var MS_SENDER_UPN false

# Notion
add_var NOTION_API_KEY true
add_var NOTION_PARENT_PAGE_ID false
add_var NOTION_LEADS_DATABASE_ID false

echo ""
echo "Fertig. Bitte redeployen:"
echo "  npm run vercel:plasma:deploy"
