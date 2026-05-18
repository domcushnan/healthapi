#!/usr/bin/env bash
# Europe PMC REST API — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

echo "=== Example 1: search literature on asthma and long COVID (lite, 2 results) ==="
curl -sS --max-time 20 \
  'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=asthma+AND+long+covid&format=json&pageSize=2&resultType=lite' \
  | head -c 2000
echo

echo "=== Example 2: structured query (author + journal) with core resultType ==="
curl -sS --max-time 20 \
  'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=AUTH%3A%22smith%22+AND+JOURNAL%3A%22BMJ%22&format=json&pageSize=1&resultType=core' \
  | head -c 2000
echo

echo "=== Example 3: cited references for a PubMed article ==="
curl -sS --max-time 20 \
  'https://www.ebi.ac.uk/europepmc/webservices/rest/MED/41776429/references?format=json&pageSize=2' \
  | head -c 2000
echo
