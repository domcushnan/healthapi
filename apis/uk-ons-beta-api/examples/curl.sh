#!/usr/bin/env bash
# Office for National Statistics Beta API — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

BASE='https://api.beta.ons.gov.uk/v1'

echo "=== Example 1: List the first 3 published datasets ==="
curl -sS --max-time 20 \
  "${BASE}/datasets?limit=3" \
  | head -c 2000
echo
echo

echo "=== Example 2: Metadata for the weekly deaths by region dataset ==="
curl -sS --max-time 20 \
  -H 'Accept: application/json' \
  "${BASE}/datasets/weekly-deaths-region" \
  | head -c 2000
echo
echo

echo "=== Example 3: One observation — England, 2025 week 52, all causes ==="
curl -sS --max-time 20 \
  "${BASE}/datasets/weekly-deaths-region/editions/time-series/versions/116/observations?time=2025&geography=E92000001&week=week-52&causeofdeath=all-causes" \
  | head -c 2000
echo
