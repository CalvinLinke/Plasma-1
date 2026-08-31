#!/usr/bin/env bash
# Einmalig: Plasma-Vercel-Account einrichten (Option 2 — eigener Config-Ordner)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=scripts/vercel-plasma.sh
source "$ROOT/scripts/vercel-plasma.sh"

echo "Plasma-Vercel nutzt: $VERCEL_CONFIG_DIR"
echo ""
echo "Schritt 1/2 — Login (Browser öffnet sich)"
vercel_plasma login

echo ""
echo "Schritt 2/2 — Projekt verknüpfen"
echo "Team + Projektname aus dem Vercel-Dashboard von plasma-energie.de"
echo ""
read -r -p "Team (z.B. calvin-linke-s-projects): " TEAM
read -r -p "Projektname: " PROJECT

if [[ -f "$ROOT/.env.local" ]]; then
  BACKUP="$ROOT/.env.local.bak.$(date +%Y%m%d-%H%M%S)"
  cp "$ROOT/.env.local" "$BACKUP"
  echo "Sicherung: $BACKUP"
fi

cd "$ROOT"
if [[ -n "$TEAM" ]]; then
  vercel_plasma link --yes --scope "$TEAM" --project "$PROJECT"
else
  vercel_plasma link --yes --project "$PROJECT"
fi

# vercel link kann .env.local überschreiben — Backup wiederherstellen, falls nötig.
LATEST_BACKUP="$(ls -t "$ROOT"/.env.local.bak.* 2>/dev/null | head -1 || true)"
if [[ -n "$LATEST_BACKUP" ]] && grep -qE '^(MS_|NOTION_)' "$LATEST_BACKUP"; then
  if ! grep -qE '^(MS_|NOTION_)' "$ROOT/.env.local" 2>/dev/null; then
    cp "$LATEST_BACKUP" "$ROOT/.env.local"
    echo ".env.local aus Backup wiederhergestellt."
  fi
fi

echo ""
echo "Fertig. Als Nächstes:"
echo "  npm run vercel:plasma:sync"
