#!/usr/bin/env bash
# openFDA — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

echo "=== Example 1: drug label lookup for ADVIL ==="
curl -sS --max-time 20 \
  'https://api.fda.gov/drug/label.json?search=openfda.brand_name:%22ADVIL%22&limit=1' \
  | head -c 2000
echo

echo "=== Example 2: top adverse-event reactions for ibuprofen ==="
curl -sS --max-time 20 \
  'https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:%22ibuprofen%22&count=patient.reaction.reactionmeddrapt.exact&limit=10' \
  | head -c 2000
echo

echo "=== Example 3: most recent Class I food recall ==="
curl -sS --max-time 20 \
  'https://api.fda.gov/food/enforcement.json?search=classification:%22Class+I%22&limit=1' \
  | head -c 2000
echo
