#!/usr/bin/env bash
# NLM Clinical Tables Search Service — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

BASE='https://clinicaltables.nlm.nih.gov/api'

echo "=== Example 1: ICD-10-CM diagnosis search for 'asthma' ==="
curl -sS --max-time 20 \
  "${BASE}/icd10cm/v3/search?sf=code,name&terms=asthma" \
  | head -c 2000
echo
echo

echo "=== Example 2: LOINC lab code search for 'haemoglobin' ==="
curl -sS --max-time 20 \
  -H 'Accept: application/json' \
  "${BASE}/loinc_items/v3/search?terms=haemoglobin&df=LOINC_NUM,LONG_COMMON_NAME&maxList=5" \
  | head -c 2000
echo
echo

echo "=== Example 3: RxTerms drug search for 'ibuprofen' ==="
curl -sS --max-time 20 \
  "${BASE}/rxterms/v3/search?terms=ibuprofen&maxList=5" \
  | head -c 2000
echo
