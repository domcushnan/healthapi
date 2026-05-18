"""Disease Ontology (DO) API — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import quote, urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://api.disease-ontology.org/v1"


def fetch(path: str, params: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers={"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    term = fetch(f"/terms/{quote('DOID:14330', safe='')}")
    print(f"{term['id']}  {term['name']}\n")
    print(f"Definition:\n  {term['definition']}\n")
    print("Parent DOIDs:")
    for parent_id in term.get("parents", []):
        print(f"  {parent_id}")
    print("\nCross-references (first 10):")
    for xref in term.get("xrefs", [])[:10]:
        print(f"  {xref}")
    print("\nSynonyms:")
    for synonym in term.get("synonyms", [])[:5]:
        if isinstance(synonym, dict):
            print(f"  {synonym.get('pred', '')}\t{synonym.get('val', '')}")
        else:
            print(f"  {synonym}")


if __name__ == "__main__":
    main()
