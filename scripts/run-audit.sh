#!/usr/bin/env bash
# One-command acceptance audit: lint → tests → build → 30 checks → scorecard.
# Usage: ./scripts/run-audit.sh [--online] [--skip-build]
set -euo pipefail
cd "$(dirname "$0")/.."
exec node scripts/audit.mjs "$@"
