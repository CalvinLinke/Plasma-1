#!/bin/bash

NODE_BIN="/Users/calvinlinke/Documents/Testprojekt/.local/node-v20.18.0-darwin-arm64/bin"
export PATH="$NODE_BIN:$PATH"

echo "Node: $(node --version)"
echo "npm:  $(npm --version)"
echo ""

cd "$(dirname "$0")"

if [ ! -d "node_modules/lucide-react" ]; then
  echo "Installiere fehlende Pakete..."
  npm install
fi

echo ""
echo "Starte Dev-Server auf http://localhost:3000 ..."
npm run dev
