"""HAPI FHIR Public Test Server (R4) — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://hapi.fhir.org/baseR4"


def fetch(path: str, params: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers={"Accept": "application/fhir+json"})
    with urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def name_of(patient: dict) -> str:
    names = patient.get("name") or []
    if not names:
        return "(no name)"
    n = names[0]
    given = " ".join(n.get("given", []))
    family = n.get("family", "")
    return f"{given} {family}".strip() or "(no name)"


def main() -> None:
    bundle = fetch("/Patient", params={"_count": 3})
    entries = bundle.get("entry", [])
    print(f"FHIR Bundle type: {bundle.get('type')}")
    print(f"Patients returned: {len(entries)}\n")
    for entry in entries:
        patient = entry["resource"]
        print(f"- Patient/{patient['id']}")
        print(f"    name:       {name_of(patient)}")
        print(f"    gender:     {patient.get('gender', 'unknown')}")
        print(f"    birthDate:  {patient.get('birthDate', 'unknown')}")
        print()


if __name__ == "__main__":
    main()
