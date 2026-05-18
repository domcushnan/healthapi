"""Office for National Statistics Beta API — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://api.beta.ons.gov.uk/v1"


def fetch(path: str, params: dict | None = None, headers: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers=headers or {"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    # Fetch one observation: deaths registered in England in week 52 of 2025, all causes.
    data = fetch(
        "/datasets/weekly-deaths-region/editions/time-series/versions/116/observations",
        params={
            "time": "2025",
            "geography": "E92000001",
            "week": "week-52",
            "causeofdeath": "all-causes",
        },
    )
    obs = data["observations"][0]
    dims = data["dimensions"]
    print(f"Geography:      {dims['geography']['option']['id']}")
    print(f"Time:           {dims['time']['option']['id']}")
    print(f"Week:           {dims['week']['option']['id']}")
    print(f"Cause of death: {dims['causeofdeath']['option']['id']}")
    print(f"Observation:    {obs['observation']} deaths")
    print(f"Total rows:     {data['total_observations']}")


if __name__ == "__main__":
    main()
