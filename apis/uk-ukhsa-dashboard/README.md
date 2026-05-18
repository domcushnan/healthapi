# UKHSA Data Dashboard API

> The live UK Health Security Agency dashboard — daily case, hospital admission, vaccination and air-quality time series for England by metric, geography, age and sex.

| | |
|---|---|
| Provider | UK Health Security Agency |
| Region | UK-England |
| Category | `uk-public-health` |
| Base URL | `https://api.ukhsa-dashboard.data.gov.uk` |
| Docs | https://ukhsa-dashboard.data.gov.uk/access-our-data |
| Auth | None — public, no key required |
| Licence | Open Government Licence v3.0 (https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) |
| Rate limits | None documented |
| Last verified | 2026-05-18 |

## What it is

This API powers the UKHSA Data Dashboard at `ukhsa-dashboard.data.gov.uk`. It is the live replacement for the now-decommissioned `api.coronavirus.data.gov.uk` COVID dashboard, but its scope has expanded well beyond COVID — it now serves three top-level themes:

- `infectious_disease` (COVID-19, influenza, RSV, measles, mpox, and more)
- `immunisation` (uptake metrics by age and geography)
- `climate_and_environment` (air quality, temperature, environmental health)

Every observation in the API is identified by a six-part path: `theme/sub_theme/topic/geography_type/geography/metric`. For each combination you get a paginated time series with `date`, `metric_value`, and optional sex/age/stratum breakdowns and a `in_reporting_delay_period` flag.

For England-level outbreak surveillance and vaccination uptake monitoring, this is the canonical machine-readable source.

## Gotchas

- The deeply-hierarchical path is enforced strictly. Names use snake_case underscores: `infectious_disease`, not `infectious-disease` or `infectiousDisease`. Discover paths by following the `link` fields returned at each level rather than constructing them by hand.
- Trailing slashes matter and the behaviour is asymmetric. Collection endpoints (e.g. `/themes`, `/themes/{theme}/sub_themes`) issue an HTTP 301 redirect to the trailing-slash variant — you must follow the redirect (curl follows automatically with `-L`; native fetch and the Python `urllib` examples below already land on `200` via the 301). Detail endpoints (`/themes/{theme}`, `/themes/{theme}/sub_themes/{sub_theme}/topics/{topic}`) serve at the path **without** a trailing slash and return 404 if you add one. When in doubt, follow the `link` field returned by the parent response — it is always the correct form.
- The legacy COVID host `api.coronavirus.data.gov.uk` no longer resolves (DNS NXDOMAIN). Older blog posts and tutorials still reference it; use this host instead.
- Time-series responses are paginated via a `page=N` query string. Respect the `next` URL rather than hard-coding page numbers — `next` is `null` once exhausted.
- Geography codes (`geography_code` in each result row) are standard ONS codes — `E92000001` for England, regional E12 codes, NHS region codes. They cross-reference cleanly with Fingertips area codes ([`uk-fingertips`](../uk-fingertips/)) and ONS ([`uk-ons-beta-api`](../uk-ons-beta-api/)).

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

The captured sample at `examples/sample-response.json` is the first page of daily COVID-19 case counts for England.

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
