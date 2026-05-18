"""UKHSA Data Dashboard API — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.request import Request, urlopen


BASE_URL = "https://api.ukhsa-dashboard.data.gov.uk"


def fetch(path: str) -> dict | list:
    url = f"{BASE_URL}{path}"
    req = Request(url, headers={"Accept": "application/json"})
    # urllib follows 3xx redirects by default — important because /themes
    # 301-redirects to /themes/.
    with urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    # 1. Top-level themes.
    themes = fetch("/themes")
    print("Themes:")
    for t in themes:
        print(f"  {t['name']}")
    print()

    # 2. Daily COVID-19 cases for England, first page.
    path = (
        "/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19"
        "/geography_types/Nation/geographies/England"
        "/metrics/COVID-19_cases_casesByDay"
    )
    page = fetch(path)
    total = page["count"]
    rows = page["results"]
    print(f"Daily COVID-19 case counts for England — {total:,} total observations")
    print(f"First page contains {len(rows)} rows.")
    print("Earliest five observations on this page:")
    for r in rows[:5]:
        print(f"  {r['date']}  cases={r['metric_value']:>8.1f}  delay={r['in_reporting_delay_period']}")


if __name__ == "__main__":
    main()
