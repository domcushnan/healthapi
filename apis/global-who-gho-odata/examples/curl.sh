#!/usr/bin/env bash
# WHO GHO OData API — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

echo "=== Example 1: list the first 3 indicators in the catalogue ==="
curl -sS --max-time 20 \
  'https://ghoapi.azureedge.net/api/Indicator?$top=3&$format=json' \
  | head -c 2000
echo

echo "=== Example 2: life expectancy at birth (WHOSIS_000001) for the UK, first 3 rows ==="
curl -sS --max-time 20 \
  'https://ghoapi.azureedge.net/api/WHOSIS_000001?$filter=SpatialDim%20eq%20%27GBR%27&$top=3&$format=json' \
  | head -c 2000
echo

echo "=== Example 3: list the first 3 country dimension values ==="
curl -sS --max-time 20 \
  'https://ghoapi.azureedge.net/api/DIMENSION/COUNTRY/DimensionValues?$top=3&$format=json' \
  | head -c 2000
echo
