# RxNav (RxNorm) API

> Look up standard US drug names, brand-to-generic mappings, NDC status, and related concept identifiers from the National Library of Medicine.

| | |
|---|---|
| Provider | U.S. National Library of Medicine |
| Region | US |
| Category | `drug-safety` |
| Base URL | `https://rxnav.nlm.nih.gov/REST` |
| Docs | https://lhncbc.nlm.nih.gov/RxNav/APIs/RxNormAPIs.html |
| Auth | None — public, no key required |
| Licence | RxNorm is in the U.S. public domain (NLM open-access). |
| Rate limits | 20 requests/sec per IP (documented). |
| Last verified | 2026-05-18 |

## What it is

RxNav is the National Library of Medicine's front door to RxNorm — the US standard vocabulary for clinical drugs. The API maps user-supplied drug names (brand names, misspellings, ingredient strings) to stable RxNorm Concept Unique Identifiers (RxCUIs), and walks the relationships between brands, generics, ingredients, and dose forms.

Use it to normalise free-text drug mentions to a canonical concept ID, to check whether an NDC is still active, or to fan out from an ingredient (e.g. `fluconazole`, RxCUI 4450) to every branded product that contains it. RxNav also hosts adjacent NLM services (RxClass, RxTerms, NDF-RT) on the same host.

## Gotchas

- The host returns JSON or XML depending on the path suffix and the `Accept` header. Always request a `.json` path (e.g. `/drugs.json`) and send `Accept: application/json` — XML is the default for some endpoints otherwise.
- The drug-drug interaction endpoint (`/interaction/interaction.json`) was deprecated in 2022 and now returns HTTP 404 — NLM removed the legacy DDI dataset entirely. Use the `/related.json` and `/ndcstatus.json` endpoints below instead.
- RxCUIs are strings, not numbers. Don't parse them as integers in client code — leading zeros and length are not guaranteed forever.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
