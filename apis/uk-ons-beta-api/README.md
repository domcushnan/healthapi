# Office for National Statistics Beta API

> What datasets does the ONS publish on health, deaths and wellbeing, and how do you fetch their machine-readable observations.

| | |
|---|---|
| Provider | Office for National Statistics (ONS) |
| Region | UK |
| Category | `uk-stats` |
| Base URL | `https://api.beta.ons.gov.uk/v1` |
| Docs | https://developer.ons.gov.uk/ |
| Auth | None — public, no key required |
| Licence | Open Government Licence v3.0 (https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) |
| Rate limits | None documented; Cloudflare sits in front |
| Last verified | 2026-05-18 |

## What it is

The ONS Beta API is the replacement for the long-running but now-decommissioned `api.ons.gov.uk/timeseries` service. It is the canonical machine-readable surface for ONS datasets — including weekly death registrations by region, suicides by local authority, personal wellbeing quarterly estimates, and the full set of publications that appear on the ONS website.

Each dataset has one or more editions (for example, a `time-series` edition that keeps growing, and capped editions like `2010-19` or `covid-19`). Each edition has versions, and each version has dimensions (time, geography, cause-of-death) plus download links to the underlying CSV, XLSX and CSV-W metadata files.

It is most useful when you want stable identifiers and a JSON surface to drive dashboards, alerting, or analysis pipelines against UK official statistics, rather than scraping the ONS website.

## Gotchas

- The legacy host `https://api.ons.gov.uk/timeseries/...` was fully retired on 25 November 2024 and now returns HTTP 404 with `Sunset` and `Deprecation` response headers. Always call `api.beta.ons.gov.uk/v1` instead.
- Some legacy probes against `/datasets/{id}/timeseries` paths still 404 on the beta API. To pull actual numbers, walk `/datasets/{id}` → `/editions` → `/versions/{n}` and then either the version-level `downloads` (CSV/XLSX) or the `/observations` endpoint with dimension query params.
- Responses are verbose. Trim or project specific fields when caching to disk — single dataset records routinely cross 2 KB once the `links` and `methodologies` arrays are populated.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
