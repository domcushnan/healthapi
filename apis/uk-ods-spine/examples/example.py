"""NHS Organisation Data Service (ODS) ORD API — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://directory.spineservices.nhs.uk/ORD/2-0-0"


def fetch(path: str, params: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers={"Accept": "application/json"})
    with urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    # 1. Resolve one ODS code: RXR is the canonical example trust used in NHSBSA cross-references.
    org = fetch("/organisations/RXR")["Organisation"]
    loc = org["GeoLoc"]["Location"]
    print(f"OrgId:   {org['OrgId']['extension']}")
    print(f"Name:    {org['Name']}")
    print(f"Status:  {org['Status']}")
    print(f"Address: {loc.get('AddrLn1', '')}, {loc.get('Town', '')}, {loc.get('PostCode', '')}")
    primary_roles = [r for r in org["Roles"]["Role"] if r.get("primaryRole")]
    if primary_roles:
        print(f"Primary role: {primary_roles[0]['id']}")
    print()

    # 2. List three ICBs. ICBs hide under NonPrimaryRoleId=RO318 — RO261 is their primary role.
    icbs = fetch("/organisations", params={"NonPrimaryRoleId": "RO318", "Limit": "3"})
    print("Three ICBs (NonPrimaryRoleId=RO318):")
    for entry in icbs["Organisations"]:
        print(f"  {entry['OrgId']}  {entry['Name']}")


if __name__ == "__main__":
    main()
