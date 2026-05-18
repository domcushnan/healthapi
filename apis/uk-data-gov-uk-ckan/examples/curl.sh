#!/usr/bin/env bash
# data.gov.uk CKAN API — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

BASE='https://ckan.publishing.service.gov.uk/api/3'

echo "=== Example 1: Search the catalogue for 'health' (top 2 results) ==="
curl -sS --max-time 20 \
  "${BASE}/action/package_search?q=health&rows=2" \
  | head -c 2000
echo
echo

echo "=== Example 2: Fetch one dataset (id=health) with its resources ==="
curl -sS --max-time 20 \
  -H 'Accept: application/json' \
  "${BASE}/action/package_show?id=health" \
  | head -c 2000
echo
echo

echo "=== Example 3: Show the NHS Digital publisher record ==="
curl -sS --max-time 20 \
  "${BASE}/action/organization_show?id=nhs-digital" \
  | head -c 2000
echo
