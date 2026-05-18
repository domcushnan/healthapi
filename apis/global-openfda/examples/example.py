"""openFDA — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://api.fda.gov"


def fetch(path: str, params: dict | None = None, headers: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers=headers or {"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    search = 'patient.drug.medicinalproduct:"ibuprofen"'

    # Total matching reports — a plain search without `count` returns meta.results.total.
    total_resp = fetch("/drug/event.json", params={"search": search, "limit": 1})
    total = total_resp["meta"]["results"]["total"]
    print(f"Total ibuprofen adverse-event reports: {total:,}")

    # Top 10 reactions — aggregation responses do not include meta.results.total.
    agg = fetch(
        "/drug/event.json",
        params={
            "search": search,
            "count": "patient.reaction.reactionmeddrapt.exact",
            "limit": 10,
        },
    )
    print("Top 10 reactions:")
    for row in agg["results"]:
        print(f"  {row['count']:>7,}  {row['term']}")


if __name__ == "__main__":
    main()
