# WHO Global Health Observatory (GHO) OData API

> Pull WHO's curated global health indicators — life expectancy, immunisation coverage, mortality, health-system capacity — by country and year, as JSON via OData.

| | |
|---|---|
| Provider | World Health Organization |
| Region | Global |
| Category | `global-health` |
| Base URL | `https://ghoapi.azureedge.net/api` |
| Docs | https://www.who.int/data/gho/info/gho-odata-api |
| Auth | None — public, no key required |
| Licence | WHO data are generally available under CC BY-NC-SA 3.0 IGO (https://www.who.int/about/policies/publishing/copyright). Verify per indicator. |
| Rate limits | None documented. Hosted on Azure Edge so heavy load may hit infrastructure caps. |
| Last verified | 2026-05-18 |

## What it is

The Global Health Observatory is WHO's official statistics portal. The OData API exposes the same indicators that back the [GHO website](https://www.who.int/data/gho) — roughly 2,000 indicators covering everything from `WHOSIS_000001` (life expectancy at birth) to communicable disease incidence, nutrition, environment and health-system capacity, broken down by country and year.

Every indicator has a stable code. You can list them all via `/Indicator`, then fetch the observations for a specific indicator by code (e.g. `/WHOSIS_000001`) and filter using standard OData syntax (`$filter`, `$top`, `$skip`, `$select`).

It is the canonical source for cross-country health statistics — what you reach for when a question starts with "how does X compare across countries".

## Gotchas

- The OData root (`/`) returns XML metadata by default. Always pass `$format=json` on data endpoints, even though most return JSON regardless. The `Indicator` and `DIMENSION` collections do return JSON without it, but it does no harm.
- `$filter` strings must be URL-encoded carefully — single quotes around values are required. Example: `$filter=SpatialDim%20eq%20'GBR'` (space encoded as `%20`, single quotes literal).
- The `/Indicator` list is ~400 KB. Cache it locally rather than fetching on every call.
- Indicator codes are case-sensitive. `WHOSIS_000001` works; `whosis_000001` does not.
- Country codes use ISO 3166-1 alpha-3 (`GBR`, `USA`, `FRA`). The country dimension is enumerable via `/DIMENSION/COUNTRY/DimensionValues`.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
