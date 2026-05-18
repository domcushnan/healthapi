#!/usr/bin/env bash
# RxNav (RxNorm) — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

echo "=== Example 1: drug name -> RxCUI (Lipitor) ==="
curl -sS --max-time 20 \
  -H 'Accept: application/json' \
  'https://rxnav.nlm.nih.gov/REST/rxcui.json?name=lipitor' \
  | head -c 2000
echo

echo "=== Example 2: brand -> ingredient (RxCUI 153165 -> IN) ==="
curl -sS --max-time 20 \
  -H 'Accept: application/json' \
  'https://rxnav.nlm.nih.gov/REST/rxcui/153165/related.json?tty=IN' \
  | head -c 2000
echo

echo "=== Example 3: NDC status check ==="
curl -sS --max-time 20 \
  -H 'Accept: application/json' \
  'https://rxnav.nlm.nih.gov/REST/ndcstatus.json?ndc=0093-7146-56' \
  | head -c 2000
echo
