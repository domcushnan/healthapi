"""HDR UK Health Data Gateway API — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://api.healthdatagateway.org/api/v1"


def fetch(path: str, params: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers={"Accept": "application/json"})
    with urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def unwrap_summary(item: dict) -> dict:
    """Walk the three-deep metadata wrapper to the summary block."""
    return (
        item.get("latest_metadata", {})
        .get("metadata", {})
        .get("metadata", {})
        .get("summary", {})
    )


def main() -> None:
    # First page of ACTIVE datasets — print their titles and publishers.
    page = fetch("/datasets", params={"perPage": "5", "status": "ACTIVE"})
    print(f"Total active datasets in the Gateway: {page['total']:,}")
    print(f"Pages: {page['last_page']}  |  Showing page {page['current_page']}")
    print()
    print("First five ACTIVE datasets:")
    for item in page["data"]:
        summary = unwrap_summary(item)
        title = summary.get("title", "(untitled)")
        publisher = (summary.get("publisher") or {}).get("name", "(unknown publisher)")
        print(f"  [{item['id']}]  {title[:70]}")
        print(f"          publisher: {publisher}")


if __name__ == "__main__":
    main()
