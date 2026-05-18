"""WHO GHO OData API — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://ghoapi.azureedge.net/api"


def fetch(path: str, params: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        # OData $-prefixed keys are accepted percent-encoded as %24 by the
        # GHO endpoint (verified 2026-05-18).
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers={"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    # Life expectancy at birth (WHOSIS_000001) for the United Kingdom.
    # SEX_BTSX = both sexes, SEX_FMLE = female, SEX_MLE = male.
    data = fetch(
        "/WHOSIS_000001",
        params={
            "$filter": "SpatialDim eq 'GBR' and Dim1 eq 'SEX_BTSX'",
            "$top": 5,
            "$format": "json",
        },
    )

    print("Life expectancy at birth, United Kingdom (both sexes)")
    print("-" * 60)
    rows = sorted(data.get("value", []), key=lambda r: r["TimeDim"])
    for row in rows:
        year = row["TimeDim"]
        value = row.get("Value", "n/a")
        print(f"  {year}: {value}")


if __name__ == "__main__":
    main()
