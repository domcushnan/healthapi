"""NCBI E-utilities — example using only the Python standard library.

Chains esearch -> esummary in one run, which is the standard E-utilities
pattern: search a database to get UIDs, then fetch summaries.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
import time
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils"

# NCBI ask every caller to identify themselves. Replace these in your own code.
TOOL = "healthapi-repo"
EMAIL = "[email protected]"


def fetch(path: str, params: dict) -> dict:
    params = {**params, "tool": TOOL, "email": EMAIL}
    url = f"{BASE_URL}{path}?{urlencode(params)}"
    req = Request(url, headers={"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    # Step 1: search PubMed for the three most recent records on asthma.
    search = fetch(
        "/esearch.fcgi",
        {"db": "pubmed", "term": "asthma", "retmax": 3, "retmode": "json"},
    )
    result = search["esearchresult"]
    uids = result["idlist"]
    print(f"PubMed reports {result['count']} total hits for 'asthma'")
    print(f"First {len(uids)} UIDs: {', '.join(uids)}")
    print()

    # Be polite — anonymous limit is 3 req/sec.
    time.sleep(0.4)

    # Step 2: pull document summaries for those UIDs in a single call.
    summary = fetch(
        "/esummary.fcgi",
        {"db": "pubmed", "id": ",".join(uids), "retmode": "json"},
    )
    for uid in uids:
        record = summary["result"][uid]
        authors = ", ".join(a["name"] for a in record.get("authors", [])[:3])
        if len(record.get("authors", [])) > 3:
            authors += " et al."
        print(f"PMID {uid} — {record.get('source', 'n/a')} ({record.get('pubdate', 'n/a')})")
        print(f"  {record.get('title', '').rstrip('.')}")
        print(f"  {authors}")
        print()


if __name__ == "__main__":
    main()
