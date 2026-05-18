#!/usr/bin/env bash
# NHS Organisation Data Service (ODS) ORD API — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

BASE='https://directory.spineservices.nhs.uk/ORD/2-0-0'

truncate() { head -c 2000; cat >/dev/null; }

echo "=== Example 1: Full record for East Lancashire Hospitals NHS Trust (RXR) ==="
curl -sS --max-time 20 \
  "${BASE}/organisations/RXR" \
  | truncate
echo
echo

echo "=== Example 2: Find three Integrated Care Boards (NonPrimaryRoleId=RO318) ==="
curl -sS --max-time 20 \
  -H 'Accept: application/json' \
  "${BASE}/organisations?NonPrimaryRoleId=RO318&Limit=3" \
  | truncate
echo
echo

echo "=== Example 3: Lookup table of organisation role codes ==="
curl -sS --max-time 20 \
  "${BASE}/roles" \
  | truncate
echo
