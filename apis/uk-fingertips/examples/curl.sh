#!/usr/bin/env bash
# OHID Fingertips Public Health Data API — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

BASE='https://fingertips.phe.org.uk/api'

# head -c truncates and exits early; the trailing cat drains the rest of
# curl's output so the pipe doesn't break under `set -o pipefail`.
truncate() { head -c 2000; cat >/dev/null; }

echo "=== Example 1: List every area type Fingertips supports ==="
curl -sS --max-time 20 \
  "${BASE}/area_types" \
  | truncate
echo
echo

echo "=== Example 2: Metadata for indicator 92313 (Percentage of people in employment) ==="
curl -sS --max-time 20 \
  -H 'Accept: application/json' \
  "${BASE}/indicator_metadata/by_indicator_id?indicator_ids=92313" \
  | truncate
echo
echo

echo "=== Example 3: Bulk CSV — indicator 92313 for England ==="
curl -sS --max-time 30 \
  "${BASE}/all_data/csv/by_indicator_id?indicator_ids=92313&child_area_type_id=15&parent_area_type_id=15&parent_area_code=E92000001" \
  | truncate
echo
