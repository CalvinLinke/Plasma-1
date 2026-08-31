#!/usr/bin/env bash
# Extrahiert Text aus Rechnungen in rechnungen/_input (OCR für PDF/Bilder).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
mkdir -p rechnungen/_input
python3 .claude/skills/rechnungs-analyse/scripts/extract.py --ocr-lang deu+eng "$@"
