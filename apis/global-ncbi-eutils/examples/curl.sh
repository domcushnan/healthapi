#!/usr/bin/env bash
# NCBI E-utilities — runnable examples
# Run: bash examples/curl.sh
#
# Note: anonymous calls are limited to 3 req/sec per IP. We sleep briefly
# between calls so this script stays well under the cap.
set -euo pipefail

TOOL="tool=healthapi-repo&email=example%40example.org"

echo "=== Example 1: esearch — find recent PubMed records on asthma ==="
curl -sS --max-time 20 \
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=asthma&retmax=3&retmode=json&${TOOL}" \
  | head -c 2000
echo
sleep 0.5

echo "=== Example 2: esummary — document summary for a single PubMed ID ==="
curl -sS --max-time 20 \
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=42149595&retmode=json&${TOOL}" \
  | head -c 2000
echo
sleep 0.5

echo "=== Example 3: efetch — plain-text abstract for the same PubMed ID ==="
curl -sS --max-time 20 \
  "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=42149595&rettype=abstract&retmode=text&${TOOL}" \
  | head -c 2000
echo
