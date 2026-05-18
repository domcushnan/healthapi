"""Europe PMC REST API — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://www.ebi.ac.uk/europepmc/webservices/rest"


def fetch(path: str, params: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers={"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    # Search for recent literature on asthma and long COVID, lightweight
    # records only (`resultType=lite`).
    data = fetch(
        "/search",
        params={
            "query": "asthma AND long covid",
            "format": "json",
            "resultType": "lite",
            "pageSize": 3,
        },
    )

    print(f"Total hits: {data.get('hitCount')}")
    print()
    for record in data.get("resultList", {}).get("result", []):
        title = record.get("title", "").rstrip(".")
        journal = record.get("journalTitle", "n/a")
        year = record.get("pubYear", "n/a")
        pmid = record.get("pmid") or record.get("id")
        print(f"PMID {pmid} ({year}) — {journal}")
        print(f"  {title}")
        if doi := record.get("doi"):
            print(f"  https://doi.org/{doi}")
        print()

    if cursor := data.get("nextCursorMark"):
        print(f"Next cursor: {cursor}")


if __name__ == "__main__":
    main()
