# Folder spec — every API folder must follow this exactly

Folder path: `apis/<slug>/` (slug from `_curation/catalogue.json`).

## Files

```
apis/<slug>/
  README.md
  endpoints.md
  examples/
    curl.sh
    example.py
    example.ts
    sample-response.json
```

No other files. No subfolders inside `examples/`.

---

## `README.md` template

Use this exact structure. Replace `{{...}}` with real values.

```markdown
# {{name}}

> {{one-line description — what real question does this API answer}}

| | |
|---|---|
| Provider | {{provider}} |
| Region | {{region}} |
| Category | `{{category}}` |
| Base URL | `{{base_url}}` |
| Docs | {{docs_url}} |
| Auth | None — public, no key required |
| Licence | {{licence}} |
| Rate limits | {{rate_limits}} |
| Last verified | 2026-05-18 |

## What it is

Two or three short paragraphs. What the API exposes, who runs it, what it
is most useful for. Write for a smart non-engineer. No marketing language.

## Gotchas

- {{gotcha 1}}
- {{gotcha 2}}

(If the catalogue entry has no gotchas, write a single bullet: "None known
as of the last verification date.")

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
```

---

## `endpoints.md` template

```markdown
# {{name}} — Endpoints

Base URL: `{{base_url}}`

## `{{METHOD}} {{path}}`

{{one-sentence purpose}}

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `param` | query | yes | what it does |

**Example**

```
{{full example URL or curl invocation, copy-pasteable}}
```

Returns: brief description of the response shape.

---

(repeat per endpoint)
```

Cover every endpoint from `key_endpoints` in the catalogue entry. If the
API has more endpoints worth mentioning, add them — but they must be
documented on the provider's site and reachable without auth.

---

## `examples/curl.sh`

```bash
#!/usr/bin/env bash
# {{name}} — runnable examples
# Run: bash examples/curl.sh
set -euo pipefail

echo "=== Example 1: {{short description}} ==="
curl -sS --max-time 20 \
  '{{full URL}}' \
  | head -c 2000
echo

echo "=== Example 2: {{short description}} ==="
curl -sS --max-time 20 \
  -H 'Accept: application/json' \
  '{{full URL}}' \
  | head -c 2000
echo
```

- Use `set -euo pipefail`.
- At least two examples per API, three if natural.
- Pipe through `head -c 2000` or `| jq '. | .field' | head -20` so output stays readable.
- Use real, working URLs you've tested.

---

## `examples/example.py`

```python
"""{{name}} — example using only the Python standard library.

Run: python3 examples/example.py
"""

from __future__ import annotations

import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen


BASE_URL = "{{base_url}}"


def fetch(path: str, params: dict | None = None, headers: dict | None = None) -> dict:
    url = f"{BASE_URL}{path}"
    if params:
        url = f"{url}?{urlencode(params)}"
    req = Request(url, headers=headers or {"Accept": "application/json"})
    with urlopen(req, timeout=20) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> None:
    data = fetch("{{path}}", params={{params_dict}})
    # Print a small, useful slice of the response
    print(json.dumps(data, indent=2)[:1500])


if __name__ == "__main__":
    main()
```

- Standard library only. No `requests`, no `httpx`.
- `python3 examples/example.py` must run end-to-end and print real output.
- Show one focused example, not every endpoint. Keep it readable.

---

## `examples/example.ts`

```typescript
// {{name}} — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "{{base_url}}";

async function fetchJson<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

async function main() {
  const data = await fetchJson<unknown>("{{path}}", {{params_object}});
  console.log(JSON.stringify(data, null, 2).slice(0, 1500));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

- Native `fetch` only (Node 20+). No axios, no node-fetch.
- One focused example.
- Must run with `npx tsx examples/example.ts`.

---

## `examples/sample-response.json`

A real captured response — trimmed if the upstream response is huge.

- Hit the SAME endpoint your `example.py` / `example.ts` calls.
- Save the JSON pretty-printed (2-space indent).
- If the response is over ~4 KB, truncate the largest array to 2–3 items
  and add a sibling key: `"_truncated": true` at the top level (or inside
  the truncated array's parent). Never invent fields — only trim.
- If the response is not JSON (e.g. XML, CSV), save the first ~2 KB
  verbatim into `sample-response.xml` or `sample-response.csv` instead
  and update the README to point at that filename.

---

## Style rules

- No emojis in any file.
- No mentions of Claude, AI, LLMs, agents, or how this repo was built.
- No "this might change" hedging — if it's unstable, fix the example or
  exclude the endpoint.
- All headings use ATX style (`#`, `##`, etc.).
- Code fences declare language (` ```bash`, ` ```python`, ` ```typescript`).
- British English spelling in prose (licence, organise) — leave URLs and code
  as-is.
