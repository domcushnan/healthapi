"""data.gov.uk CKAN API — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://ckan.publishing.service.gov.uk/api/3"


def fetch(path: str, params: dict | None = None, headers: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers=headers or {"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    data = fetch("/action/package_search", params={"q": "health", "rows": 2})
    result = data["result"]
    print(f"Total matching datasets: {result['count']}")
    print(f"Showing {len(result['results'])} of them:\n")
    for pkg in result["results"]:
        print(f"- {pkg['title']}")
        print(f"    name:         {pkg['name']}")
        print(f"    publisher:    {pkg['organization']['title']}")
        print(f"    licence:      {pkg.get('license_title', 'unspecified')}")
        print(f"    resources:    {pkg['num_resources']} file(s)")
        print()


if __name__ == "__main__":
    main()
