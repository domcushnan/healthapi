"""EBI Ontology Lookup Service (OLS4) — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://www.ebi.ac.uk/ols4/api"


def fetch(path: str, params: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers={"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    data = fetch("/search", params={"q": "asthma", "ontology": "hp", "rows": 5})
    response = data["response"]
    docs = response["docs"]
    print(f"HPO matches for 'asthma': {response['numFound']} total")
    print(f"Showing top {len(docs)}:\n")
    for doc in docs:
        print(f"- {doc['obo_id']}  {doc['label']}")
        description = (doc.get("description") or [None])[0]
        if description:
            # Trim long descriptions for terminal output.
            text = description if len(description) <= 120 else description[:117] + "..."
            print(f"    {text}")
        synonyms = doc.get("exact_synonyms") or []
        if synonyms:
            print(f"    synonyms: {', '.join(synonyms[:3])}")
        print()


if __name__ == "__main__":
    main()
