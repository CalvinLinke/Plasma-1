#!/bin/bash
# GitHub Upload Script — Plasma Energie Solution
# Usage: GITHUB_TOKEN=ghp_xxx bash upload-to-github.sh

set -e

TOKEN="${GITHUB_TOKEN}"
if [ -z "$TOKEN" ]; then
  echo "Fehler: GITHUB_TOKEN nicht gesetzt"
  echo "Verwendung: GITHUB_TOKEN=ghp_... bash upload-to-github.sh"
  exit 1
fi

REPO_NAME="Plasma-1"
REPO_DESC="Plasma Energie Solution – Website"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKIP_DIRS="node_modules|.next|.git"
SKIP_FILES="upload-to-github.js|upload-to-github.sh|.env.local|.DS_Store|.env"

api() {
  local method="$1"
  local path="$2"
  local data="$3"
  if [ -n "$data" ]; then
    curl -s -X "$method" \
      -H "Authorization: token $TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      -H "Content-Type: application/json" \
      -d "$data" \
      "https://api.github.com${path}"
  else
    curl -s -X "$method" \
      -H "Authorization: token $TOKEN" \
      -H "Accept: application/vnd.github.v3+json" \
      "https://api.github.com${path}"
  fi
}

# 1. Token prüfen
echo "GitHub-Token wird geprüft..."
USER_JSON=$(api GET "/user")
USERNAME=$(echo "$USER_JSON" | python3 -c "import sys,json; print(json.load(sys.stdin)['login'])" 2>/dev/null)
if [ -z "$USERNAME" ]; then
  echo "Fehler: Ungültiger Token oder Verbindungsproblem"
  echo "$USER_JSON"
  exit 1
fi
echo "Eingeloggt als: $USERNAME"
echo ""

# 2. Repository erstellen
echo "Prüfe Repository '$REPO_NAME'..."
REPO_STATUS=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$USERNAME/$REPO_NAME")

if [ "$REPO_STATUS" = "404" ]; then
  echo "Repository existiert nicht — wird erstellt..."
  CREATE_RESULT=$(api POST "/user/repos" "{\"name\":\"$REPO_NAME\",\"description\":\"$REPO_DESC\",\"private\":false,\"auto_init\":false}")
  REPO_URL=$(echo "$CREATE_RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('html_url',''))" 2>/dev/null)
  if [ -z "$REPO_URL" ]; then
    echo "Fehler beim Erstellen:"
    echo "$CREATE_RESULT"
    exit 1
  fi
  echo "Repository erstellt: $REPO_URL"
  sleep 1
else
  echo "Repository gefunden — Dateien werden synchronisiert."
fi
echo ""

# 3. Hilfsfunktion: Datei hochladen
upload_file() {
  local rel_path="$1"
  local full_path="$2"

  # Base64 enkodieren
  local content
  content=$(base64 < "$full_path" | tr -d '\n')

  # SHA abrufen (falls Datei existiert)
  local encoded_path
  encoded_path=$(python3 -c "import urllib.parse,sys; print('/'.join(urllib.parse.quote(p) for p in sys.argv[1].split('/')))" "$rel_path")

  local sha_json
  sha_json=$(curl -s \
    -H "Authorization: token $TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$USERNAME/$REPO_NAME/contents/$encoded_path")

  local sha
  sha=$(echo "$sha_json" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['sha'])" 2>/dev/null)

  # Payload bauen
  local message
  if [ -n "$sha" ]; then
    message="Update $rel_path"
    payload="{\"message\":\"$message\",\"content\":\"$content\",\"sha\":\"$sha\"}"
  else
    message="Add $rel_path"
    payload="{\"message\":\"$message\",\"content\":\"$content\"}"
  fi

  # Hochladen
  local status
  status=$(curl -s -o /dev/null -w "%{http_code}" \
    -X PUT \
    -H "Authorization: token $TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    -H "Content-Type: application/json" \
    -d "$payload" \
    "https://api.github.com/repos/$USERNAME/$REPO_NAME/contents/$encoded_path")

  if [ "$status" = "201" ]; then
    echo "  + $rel_path"
  elif [ "$status" = "200" ]; then
    echo "  ↑ $rel_path"
  else
    echo "  ✗ $rel_path (HTTP $status)"
  fi
}

# 4. .gitignore zuerst
echo "Lade .gitignore hoch..."
GITIGNORE_CONTENT=$(printf '.env.local\n.env\nnode_modules/\n.next/\n.DS_Store\n*.log\n' | base64 | tr -d '\n')
SHA_GI=$(curl -s \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/$USERNAME/$REPO_NAME/contents/.gitignore" | \
  python3 -c "import sys,json; print(json.load(sys.stdin).get('sha',''))" 2>/dev/null)

if [ -n "$SHA_GI" ]; then
  GI_PAYLOAD="{\"message\":\"Update .gitignore\",\"content\":\"$GITIGNORE_CONTENT\",\"sha\":\"$SHA_GI\"}"
else
  GI_PAYLOAD="{\"message\":\"Add .gitignore\",\"content\":\"$GITIGNORE_CONTENT\"}"
fi
curl -s -o /dev/null -X PUT \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Content-Type: application/json" \
  -d "$GI_PAYLOAD" \
  "https://api.github.com/repos/$USERNAME/$REPO_NAME/contents/.gitignore"
echo "  + .gitignore"
echo ""

# 5. Alle Dateien hochladen
echo "Dateien werden hochgeladen..."
CREATED=0
UPDATED=0
FAILED=0

while IFS= read -r -d '' file; do
  rel="${file#$SCRIPT_DIR/}"

  # Überspringe
  skip=0
  IFS='|' read -ra SDIRS <<< "$SKIP_DIRS"
  for sd in "${SDIRS[@]}"; do
    if [[ "$rel" == "$sd"/* ]] || [[ "$rel" == "$sd" ]]; then
      skip=1; break
    fi
  done
  IFS='|' read -ra SFILES <<< "$SKIP_FILES"
  for sf in "${SFILES[@]}"; do
    if [[ "$(basename "$rel")" == "$sf" ]]; then
      skip=1; break
    fi
  done
  [ $skip -eq 1 ] && continue

  result=$(upload_file "$rel" "$file")
  echo "$result"
  if [[ "$result" == "  + "* ]]; then ((CREATED++));
  elif [[ "$result" == "  ↑ "* ]]; then ((UPDATED++));
  else ((FAILED++)); fi

done < <(find "$SCRIPT_DIR" -type f -print0 | sort -z)

echo ""
echo "────────────────────────────────────────────────────"
echo "$CREATED erstellt, $UPDATED aktualisiert, $FAILED fehlgeschlagen"
echo ""
echo "Repository: https://github.com/$USERNAME/$REPO_NAME"
echo ""
echo "Nächster Schritt — Vercel Deployment:"
echo "1. Öffne https://vercel.com/new"
echo "2. Wähle 'Import Git Repository'"
echo "3. Wähle '$REPO_NAME'"
echo "4. Framework: Next.js (automatisch erkannt)"
echo "5. Klicke 'Deploy'"
