# NHS Business Services Authority Open Data Portal (CKAN)

> Every NHS prescription written in England, plus pharmacy contract data, dispensing returns, and BNF code reference data, all published monthly as open data.

| | |
|---|---|
| Provider | NHS Business Services Authority (NHSBSA) |
| Region | UK-England |
| Category | `uk-nhs` |
| Base URL | `https://opendata.nhsbsa.net/api/3` |
| Docs | https://opendata.nhsbsa.net/ |
| Auth | None — public, no key required |
| Licence | Open Government Licence v3.0 (https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/). Confirmed via `license_id=OGL-UK-3.0` in dataset metadata. |
| Rate limits | None documented |
| Last verified | 2026-05-18 |

## What it is

NHSBSA's Open Data Portal is a standard CKAN instance hosting around 600 datasets covering prescribing, dispensing, pharmacy contracts, dental activity, eye-care payments, and the BNF code reference tables. The flagship is the English Prescribing Dataset (EPD) — roughly 17 million rows per month, one row per (prescriber, BNF code, month), with quantities, costs, and patient counts.

CKAN exposes a JSON action API at `/api/3/action/<name>`. The two most useful actions for discovery are `package_search` (full-text search across all datasets) and `package_show` (full metadata for one dataset, including the list of monthly resource files). Each monthly file is a separate CKAN resource with its own resource ID, and its CSV is downloadable from the resource's `url` field.

Most analytical pipelines use this API for discovery (find the latest month, get its CSV URL) and then download the CSV directly to do the heavy work locally. Practice and ICB codes in NHSBSA rows are the same ODS codes published by [`uk-ods-spine`](../uk-ods-spine/), so the two APIs join cleanly.

## Gotchas

- The legacy `english-prescribing-data-epd` dataset has been retired. The current EPD is published under the slug `english-prescribing-dataset-epd-with-snomed-code`. Hard-coding the old slug returns a "this dataset is retired" notice in the `notes` field.
- Monthly resources are named `EPD_SNOMED_YYYYMM` (and `PCA_YYYYMM`, `PRESCRIBER_DETAILS_YYYYMM`, etc. for the other monthly series) but their CKAN `resource_id` values are UUIDs, not the human-readable names. Always discover the current resource_id with `package_show` rather than constructing one.
- `datastore_search` on the EPD resources can return HTTP 500 because the monthly tables are too large for the CKAN datastore back-end to serve interactively. The reliable retrieval pattern is `package_show` → pick the resource → download the CSV at its `url` (which redirects to an R2 signed URL).
- The `notes` field on many datasets contains inline HTML and `nhsuk-warning-callout` blocks announcing schema changes (for example the May 2026 SNOMED code change from numeric to string). Read it before parsing CSV columns.
- ICB codes and practice codes in NHSBSA rows are ODS codes — resolve names and addresses via [`uk-ods-spine`](../uk-ods-spine/) (e.g. `/organisations/RJ1`).

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

The captured sample at `examples/sample-response.json` is a trimmed `package_search?q=prescribing&rows=2` response.

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
