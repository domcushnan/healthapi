#!/usr/bin/env bash
# EBI Ontology Lookup Service (OLS4) — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

BASE='https://www.ebi.ac.uk/ols4/api'

echo "=== Example 1: Search HPO for 'asthma' ==="
curl -sS --max-time 20 \
  "${BASE}/search?q=asthma&ontology=hp&rows=3" \
  | head -c 2000
echo
echo

echo "=== Example 2: Single ontology details (Human Phenotype Ontology) ==="
curl -sS --max-time 20 \
  -H 'Accept: application/json' \
  "${BASE}/ontologies/hp" \
  | head -c 2000
echo
echo

echo "=== Example 3: Fetch a term by IRI (HP:0002099 = Asthma) ==="
# IRI is double-URL-encoded in the path segment.
curl -sS --max-time 20 \
  "${BASE}/ontologies/hp/terms/http%253A%252F%252Fpurl.obolibrary.org%252Fobo%252FHP_0002099" \
  | head -c 2000
echo
