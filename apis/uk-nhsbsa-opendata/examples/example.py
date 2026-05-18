"""NHS Business Services Authority Open Data Portal (CKAN) — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://opendata.nhsbsa.net/api/3"


def fetch(path: str, params: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers={"Accept": "application/json"})
    with urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    # 1. Discover the current English Prescribing Dataset.
    search = fetch(
        "/action/package_search",
        params={"q": "english prescribing dataset", "rows": 5},
    )
    print(f"Datasets matching 'english prescribing dataset': {search['result']['count']:,}")
    for ds in search["result"]["results"][:3]:
        print(f"  {ds['name']:55}  {ds['title']}")
    print()

    # 2. Show the active EPD dataset's most recent CSV resources.
    show = fetch(
        "/action/package_show",
        params={"id": "english-prescribing-dataset-epd-with-snomed-code"},
    )
    result = show["result"]
    resources = result.get("resources", [])
    print(f"Dataset: {result['title']}")
    print(f"Licence: {result['license_title']}")
    print(f"Total monthly resources: {len(resources)}")
    print("Most recent three resources:")
    for r in resources[-3:]:
        print(f"  {r['name']:30}  resource_id={r['id']}")
    print()
    print("Direct CSV URL for the most recent month:")
    print(f"  {resources[-1]['url']}")


if __name__ == "__main__":
    main()
