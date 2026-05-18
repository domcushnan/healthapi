# OHID Fingertips Public Health Data API

> What does any official England public-health indicator look like, broken down by ICB, local authority, GP practice or ward, with confidence intervals and time series.

| | |
|---|---|
| Provider | Office for Health Improvement and Disparities (OHID, formerly PHE), Department of Health and Social Care |
| Region | UK-England |
| Category | `uk-public-health` |
| Base URL | `https://fingertips.phe.org.uk/api` |
| Docs | https://fingertips.phe.org.uk/api |
| Auth | None — public, no key required |
| Licence | Open Government Licence v3.0 (https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) |
| Rate limits | None documented |
| Last verified | 2026-05-18 |

## What it is

Fingertips is OHID's public-health indicator service — the same data engine that powers the public-facing Fingertips profiles (Smoking, Cardiovascular, Child and Maternal Health, Wider Determinants of Health, and dozens more). Every indicator on every profile has a stable numeric ID and is queryable through this API.

For each indicator you can pull values at any area type the indicator supports — England, region, ICB, upper-tier local authority, district, GP practice, MSOA, or ward — along with sex/age breakdowns, 95% and 99.8% confidence intervals, counts, denominators, comparators, and recent-trend flags. This is the canonical source for any "how does my place compare on indicator X" question and for England-wide indicator benchmarking.

Indicators are grouped into profiles (each profile has a `Key` like `tobacco-control`) and indicator-groups within a profile. To get from "I want the smoking-prevalence indicator for every ICB" to actual data you generally walk: `/profiles` → pick a group → `/indicator_metadata` to confirm units and methodology → `/all_data/csv/by_indicator_id` for the values.

## Gotchas

- The JSON `/indicator_data/...` and `/latest_data/...` endpoints return HTTP 500 with a "browser not supported" HTML body for many parameter combinations that the public Fingertips site itself uses internally. The CSV bulk endpoint `/all_data/csv/by_indicator_id` is the reliable path and returns `text/csv`.
- `/all_data/csv/by_indicator_id` requires four positional concepts: `indicator_ids`, `child_area_type_id`, `parent_area_type_id`, and `parent_area_code`. All four are mandatory — omit any one and you get either empty CSV or a 500. The worked example below shows a fully-specified request for England national-level values.
- Useful area-type IDs: `15` = England, `6` = Government Office Region (E12), `66` = upper-tier local authority, `7` = General Practice, `502` = ICB sub-locations. Use `/area_types` to confirm — IDs do drift when geographies are reorganised.
- This API is the indicator layer. Where indicators are reported at GP-practice or ICB level, the area codes line up with NHS Organisation Data Service codes — look them up in [`uk-ods-spine`](../uk-ods-spine/) to resolve a practice or ICB code to a name and address.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

The captured sample at `examples/sample-response.csv` is the bulk CSV for indicator 92313 (Percentage of people in employment) for England.

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
