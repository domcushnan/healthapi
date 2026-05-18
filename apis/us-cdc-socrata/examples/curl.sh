#!/usr/bin/env bash
# CDC Open Data (Socrata) — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

echo "=== Example 1: catalogue — first 3 datasets ==="
curl -sS --max-time 20 \
  'https://data.cdc.gov/api/views/metadata/v1?limit=3' \
  | head -c 2000
echo

echo "=== Example 2: COVID-19 death counts for New York (dataset pj7m-y5uh) ==="
curl -sS --max-time 20 \
  'https://data.cdc.gov/resource/pj7m-y5uh.json?$where=state=%27New%20York%27&$limit=2' \
  | head -c 2000
echo

echo "=== Example 3: SoQL projection — state, indicator, value ==="
curl -sS --max-time 20 \
  'https://data.cdc.gov/resource/pj7m-y5uh.json?$select=state,indicator,non_hispanic_white&$limit=5' \
  | head -c 2000
echo
