#!/usr/bin/env bash
# NHS Business Services Authority Open Data Portal (CKAN) — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

BASE='https://opendata.nhsbsa.net/api/3'

# Drain pattern: head truncates; the cat absorbs the rest so the pipe
# doesn't break under `set -o pipefail`.
truncate() { head -c 2000; cat >/dev/null; }

echo "=== Example 1: Search for prescribing datasets ==="
curl -sS --max-time 20 \
  "${BASE}/action/package_search?q=prescribing&rows=2" \
  | truncate
echo
echo

echo "=== Example 2: Full metadata for the English Prescribing Dataset (EPD with SNOMED) ==="
curl -sS --max-time 30 \
  "${BASE}/action/package_show?id=english-prescribing-dataset-epd-with-snomed-code" \
  | truncate
echo
echo

echo "=== Example 3: First 25 dataset slugs (discovery without paging) ==="
curl -sS --max-time 20 \
  "${BASE}/action/package_list?limit=25" \
  | truncate
echo
