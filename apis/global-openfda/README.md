# openFDA (drug events, drug labels, device events, food enforcement)

> Query U.S. Food and Drug Administration adverse-event reports, structured drug labels, medical device incidents, and food recall notices.

| | |
|---|---|
| Provider | U.S. Food and Drug Administration |
| Region | US |
| Category | `drug-safety` |
| Base URL | `https://api.fda.gov` |
| Docs | https://open.fda.gov/apis/ |
| Auth | None — public, no key required |
| Licence | U.S. public domain (https://open.fda.gov/license/). Disclaimer: data are unvalidated and not for clinical decisions. |
| Rate limits | 1,000 requests per IP per day without a key; 120,000 per day with a free key. Burst limit 240 per minute. |
| Last verified | 2026-05-18 |

## What it is

openFDA is the FDA's public-data programme. It exposes four broad surfaces over the same HTTP API: drug adverse-event reports drawn from the FAERS database, structured product labelling (SPL) for marketed drugs, medical-device incident reports from MAUDE, and food-recall enforcement notices.

It is the canonical free source for post-market safety signals on US-marketed drugs and devices, and for verifying what is on a current SPL drug label. The data are noisy — adverse-event reports are voluntary, unverified, and frequently incomplete — so the API is most useful for cohort-level signal detection, recall searches, and label text retrieval rather than individual clinical decisions.

## Gotchas

- The anonymous limit is 1,000 requests per IP per day. The free API key (optional) raises that to 120,000. Local development on a shared IP can hit the limit faster than you expect.
- `search=` uses Lucene query syntax: `field:value`, quoted phrases, and date ranges in the form `[20200101 TO 20201231]`. URL-encode quotes and brackets.
- Adverse-event records are huge — `limit=1` on `/drug/event.json` returns ~190 KB because of nested narratives. Use the `_count` parameter for aggregations instead of pulling raw rows.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
