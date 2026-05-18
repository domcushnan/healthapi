#!/usr/bin/env bash
# HDR UK Health Data Gateway API — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

BASE='https://api.healthdatagateway.org/api/v1'

truncate() { head -c 2000; cat >/dev/null; }

echo "=== Example 1: First active dataset (one record) ==="
curl -sS --max-time 30 \
  -H 'Accept: application/json' \
  "${BASE}/datasets?perPage=1&status=ACTIVE" \
  | truncate
echo
echo

echo "=== Example 2: Detail for dataset 1717 ==="
curl -sS --max-time 30 \
  "${BASE}/datasets/1717" \
  | truncate
echo
echo

echo "=== Example 3: First collection (catalogue grouping) ==="
curl -sS --max-time 30 \
  "${BASE}/collections?perPage=1" \
  | truncate
echo
