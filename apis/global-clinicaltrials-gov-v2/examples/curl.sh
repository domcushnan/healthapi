#!/usr/bin/env bash
# ClinicalTrials.gov API v2 — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

echo "=== Example 1: search studies by condition (asthma, 2 results, projected fields) ==="
curl -sS --max-time 20 \
  'https://clinicaltrials.gov/api/v2/studies?query.cond=asthma&pageSize=2&fields=NCTId,BriefTitle,OverallStatus,Phase,LeadSponsorName' \
  | head -c 2000
echo

echo "=== Example 2: fetch a single study by NCT id ==="
curl -sS --max-time 20 \
  'https://clinicaltrials.gov/api/v2/studies/NCT01168635?fields=NCTId,BriefTitle,OverallStatus,Phase,StartDate,CompletionDate' \
  | head -c 2000
echo

echo "=== Example 3: aggregate database size statistics ==="
curl -sS --max-time 20 \
  'https://clinicaltrials.gov/api/v2/stats/size' \
  | head -c 2000
echo
