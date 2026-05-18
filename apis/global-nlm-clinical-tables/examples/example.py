"""NLM Clinical Tables Search Service — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://clinicaltables.nlm.nih.gov/api"


def fetch(path: str, params: dict | None = None) -> list:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers={"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    # Clinical Tables returns a positional array, not an object.
    # Layout: [total_count, [codes], extra_or_null, [[display_fields], ...]]
    data = fetch(
        "/icd10cm/v3/search",
        params={"sf": "code,name", "terms": "asthma", "maxList": "7"},
    )
    total, codes, _extra, display = data
    print(f"ICD-10-CM matches for 'asthma': {total} total")
    print(f"Showing top {len(codes)}:\n")
    for code, description in display:
        print(f"  {code}\t{description}")


if __name__ == "__main__":
    main()
