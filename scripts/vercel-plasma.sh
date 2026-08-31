#!/usr/bin/env bash
# Plasma-Vercel-Account — getrennt vom persönlichen ~/.vercel
export VERCEL_CONFIG_DIR="${VERCEL_CONFIG_DIR:-$HOME/.vercel-plasma}"

vercel_plasma() {
  vercel --global-config "$VERCEL_CONFIG_DIR" "$@"
}
