# CDC Open Data (Socrata)

> Query CDC's public health datasets — mortality, COVID-19, notifiable diseases, immunisation, environmental health — using SoQL on the Socrata platform.

| | |
|---|---|
| Provider | U.S. Centers for Disease Control and Prevention |
| Region | US |
| Category | `public-health-data` |
| Base URL | `https://data.cdc.gov` |
| Docs | https://dev.socrata.com/foundry/data.cdc.gov |
| Auth | None — public, no key required |
| Licence | U.S. public domain (federal government works). Per-dataset terms occasionally apply; see each dataset page. |
| Rate limits | Anonymous calls are throttled; higher limits with a free Socrata app token. Works without one for low volume. |
| Last verified | 2026-05-18 |

## What it is

`data.cdc.gov` is the CDC's instance of Socrata, a hosted open-data platform. The site lists thousands of datasets covering chronic disease surveillance, infectious disease notifications, mortality, vaccine coverage, environmental hazards, and pandemic response. Each dataset has a stable four-by-four identifier (e.g. `pj7m-y5uh`) and is queryable as JSON, CSV, GeoJSON, or XML.

Queries use SoQL — a SQL-like dialect with `$select`, `$where`, `$group`, `$order`, `$limit`, `$offset`. There is also a meta-endpoint that lists the entire catalogue, so you can find a dataset's four-by-four ID programmatically.

## Gotchas

- Each dataset has a four-by-four ID like `pj7m-y5uh`. Some old IDs (notably the early COVID-19 daily counts `9mfq-cb36`) have been retired and now 404. Confirm a dataset still exists in the catalogue before hardcoding its ID.
- SoQL parameter names are prefixed with `$` (e.g. `$where`, `$limit`). Shells and HTTP clients sometimes interpret `$` — quote the URL fully or URL-encode.
- Numeric fields are returned as JSON strings, not numbers. Cast on the client side.
- Some datasets use column names that collide with SoQL reserved words (e.g. a column literally called `group`). Backtick-quote them in `$where`: `` `group`='By Total' ``.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
