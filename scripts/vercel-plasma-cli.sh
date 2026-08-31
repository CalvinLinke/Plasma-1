#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# shellcheck source=scripts/vercel-plasma.sh
source "$ROOT/scripts/vercel-plasma.sh"
cd "$ROOT"
vercel_plasma "$@"
