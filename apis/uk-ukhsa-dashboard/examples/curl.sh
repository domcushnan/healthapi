#!/usr/bin/env bash
# UKHSA Data Dashboard API — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

BASE='https://api.ukhsa-dashboard.data.gov.uk'

# Drain pattern keeps `pipefail` happy when head truncates curl's output.
truncate() { head -c 2000; cat >/dev/null; }

echo "=== Example 1: List the top-level themes (-L follows the 301 to /themes/) ==="
curl -sSL --max-time 20 \
  "${BASE}/themes" \
  | truncate
echo
echo

echo "=== Example 2: Detail for the infectious_disease theme ==="
curl -sS --max-time 20 \
  -H 'Accept: application/json' \
  "${BASE}/themes/infectious_disease" \
  | truncate
echo
echo

echo "=== Example 3: First page of daily COVID-19 case counts for England ==="
curl -sS --max-time 30 \
  "${BASE}/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19/geography_types/Nation/geographies/England/metrics/COVID-19_cases_casesByDay" \
  | truncate
echo
