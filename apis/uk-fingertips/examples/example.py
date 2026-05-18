"""OHID Fingertips Public Health Data API — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import csv
import io
import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://fingertips.phe.org.uk/api"


def fetch_bytes(path: str, params: dict | None = None) -> bytes:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers={"Accept": "*/*"})
    with urlopen(req, timeout=30) as resp:
        return resp.read()


def fetch_json(path: str, params: dict | None = None) -> dict | list:
    return json.loads(fetch_bytes(path, params).decode("utf-8"))


def main() -> None:
    indicator_id = "92313"  # Percentage of people in employment

    # 1. Metadata: confirm the indicator name and unit before pulling rows.
    meta = fetch_json(
        "/indicator_metadata/by_indicator_id",
        params={"indicator_ids": indicator_id},
    )
    descriptive = meta[indicator_id]["Descriptive"]
    unit = meta[indicator_id]["Unit"]["Label"]
    print(f"Indicator {indicator_id}: {descriptive['Name']}")
    print(f"  Source: {descriptive['DataSource']}")
    print(f"  Unit:   {unit}")
    print()

    # 2. Bulk CSV: every value for the indicator at England area-type, parent = England.
    csv_bytes = fetch_bytes(
        "/all_data/csv/by_indicator_id",
        params={
            "indicator_ids": indicator_id,
            "child_area_type_id": "15",
            "parent_area_type_id": "15",
            "parent_area_code": "E92000001",
        },
    )
    rows = list(csv.DictReader(io.StringIO(csv_bytes.decode("utf-8"))))
    print(f"Rows returned: {len(rows):,}")

    # Print the three most recent rows (England, Persons, all-ages).
    persons = [r for r in rows if r["Sex"] == "Persons"]
    persons.sort(key=lambda r: r["Time period Sortable"], reverse=True)
    print("Latest three persons-all-ages rows:")
    for r in persons[:3]:
        print(f"  {r['Time period']:>8}  {r['Value']:>6}  (CI {r['Lower CI 95.0 limit']}–{r['Upper CI 95.0 limit']})")


if __name__ == "__main__":
    main()
