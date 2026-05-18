#!/usr/bin/env bash
# Disease Ontology (DO) API — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

BASE='https://api.disease-ontology.org/v1'

echo "=== Example 1: API info (version, data release, licence) ==="
curl -sS --max-time 20 \
  "${BASE}/info" \
  | head -c 2000
echo
echo

echo "=== Example 2: Fetch DOID:14330 (Parkinson's disease) ==="
curl -sS --max-time 20 \
  -H 'Accept: application/json' \
  "${BASE}/terms/DOID:14330" \
  | head -c 2000
echo
echo

echo "=== Example 3: Resolve label 'asthma' to its term ==="
curl -sS --max-time 20 \
  "${BASE}/terms/label/asthma" \
  | head -c 2000
echo
