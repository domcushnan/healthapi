"""CDC Open Data (Socrata) — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://data.cdc.gov"

# "Distribution of COVID-19 deaths and populations, by jurisdiction,
# age, and race and Hispanic origin" — a stable demo dataset.
DATASET_ID = "pj7m-y5uh"


def fetch(path: str, params: dict | None = None, headers: dict | None = None) -> list | dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers=headers or {"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    # Note: `group` is a SoQL reserved word, so we backtick-quote it in $where.
    rows = fetch(
        f"/resource/{DATASET_ID}.json",
        params={
            "$select": "state,indicator,non_hispanic_white,hispanic_latino_total",
            "$where": "indicator='Count of COVID-19 deaths' AND `group`='By Total'",
            "$order": "state",
            "$limit": "5",
        },
    )

    assert isinstance(rows, list)
    print(f"Dataset {DATASET_ID} — {len(rows)} rows:")
    for r in rows:
        white = int(r.get("non_hispanic_white", "0"))
        hispanic = int(r.get("hispanic_latino_total", "0"))
        print(f"  {r['state']:<25} white={white:>7,}  hispanic={hispanic:>7,}")


if __name__ == "__main__":
    main()
