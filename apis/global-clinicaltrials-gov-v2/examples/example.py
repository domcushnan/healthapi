"""ClinicalTrials.gov API v2 — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://clinicaltrials.gov/api/v2"


def fetch(path: str, params: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers={"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    # Search the first two asthma studies, projecting a small set of fields
    # to keep the payload readable.
    data = fetch(
        "/studies",
        params={
            "query.cond": "asthma",
            "pageSize": 2,
            "fields": "NCTId,BriefTitle,OverallStatus,Phase,LeadSponsorName",
        },
    )

    for study in data.get("studies", []):
        ident = study["protocolSection"]["identificationModule"]
        status = study["protocolSection"].get("statusModule", {})
        sponsor = (
            study["protocolSection"]
            .get("sponsorCollaboratorsModule", {})
            .get("leadSponsor", {})
        )
        print(f"{ident.get('nctId')} — {status.get('overallStatus', 'UNKNOWN')}")
        print(f"  {ident.get('briefTitle')}")
        print(f"  Sponsor: {sponsor.get('name', 'n/a')}")
        print()

    if token := data.get("nextPageToken"):
        print(f"Next page token: {token[:20]}...")


if __name__ == "__main__":
    main()
