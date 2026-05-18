"""RxNav (RxNorm) — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "https://rxnav.nlm.nih.gov/REST"


def fetch(path: str, params: dict | None = None, headers: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers=headers or {"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    # 1. Resolve a brand name to an RxCUI.
    resolved = fetch("/rxcui.json", params={"name": "lipitor"})
    rxcuis = resolved["idGroup"].get("rxnormId") or []
    if not rxcuis:
        print("No RxCUI found for 'lipitor'.")
        return
    rxcui = rxcuis[0]
    print(f"'lipitor' -> RxCUI {rxcui}")

    # 2. Fetch concept properties.
    props = fetch(f"/rxcui/{rxcui}/properties.json")["properties"]
    print(f"  name: {props['name']}")
    print(f"  tty:  {props['tty']}")

    # 3. Walk to the active ingredient(s).
    related = fetch(f"/rxcui/{rxcui}/related.json", params={"tty": "IN"})
    groups = related["relatedGroup"]["conceptGroup"]
    ingredients = []
    for g in groups:
        for c in g.get("conceptProperties", []) or []:
            ingredients.append((c["rxcui"], c["name"]))
    print("  ingredients:")
    for cui, name in ingredients:
        print(f"    RxCUI {cui}: {name}")


if __name__ == "__main__":
    main()
