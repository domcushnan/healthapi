#!/usr/bin/env bash
# HAPI FHIR Public Test Server (R4) — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

BASE='https://hapi.fhir.org/baseR4'
ACCEPT='Accept: application/fhir+json'

# Helper: fetch a URL into a temp file, then head it. This avoids SIGPIPE on
# very large responses (the FHIR CapabilityStatement is hundreds of kB).
show() {
  local label="$1" url="$2"
  local tmp; tmp="$(mktemp)"
  echo "=== ${label} ==="
  curl -sS --max-time 30 -H "${ACCEPT}" "${url}" -o "${tmp}"
  head -c 2000 "${tmp}"
  rm -f "${tmp}"
  echo
  echo
}

show "Example 1: Search Patient (page size 2)" \
  "${BASE}/Patient?_count=2"

show "Example 2: Read Patient/90286136" \
  "${BASE}/Patient/90286136"

show "Example 3: CapabilityStatement (server metadata)" \
  "${BASE}/metadata"
