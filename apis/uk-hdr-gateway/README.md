# HDR UK Health Data Gateway API

> A searchable metadata catalogue of UK health datasets — what exists, who holds it, what it covers — for researchers planning a Data Access Request.

| | |
|---|---|
| Provider | Health Data Research UK |
| Region | UK |
| Category | `uk-public-health` |
| Base URL | `https://api.healthdatagateway.org/api/v1` |
| Docs | https://www.healthdatagateway.org/page/api-documentation |
| Auth | None — public, no key required (read-only catalogue endpoints) |
| Licence | Catalogue metadata available under permissive terms for discovery. Underlying datasets are not in the API — access requires a Data Access Request to the data custodian. |
| Rate limits | None documented |
| Last verified | 2026-05-18 |

## What it is

The Health Data Gateway is HDR UK's federated catalogue of UK health datasets — NHS trust EHR extracts, biobank cohorts, registries, omics datasets, imaging collections — published by around 100 data custodians (Secure Data Environments, NHS trusts, biobanks, registries, research organisations).

The API exposes **metadata only**. For each dataset you get title, abstract, publisher, spatial coverage, structural metadata (tables, columns), accessibility process, and links to the custodian's Data Access Request workflow. Access to the underlying patient-level data is gated separately by each custodian.

This is the right place to answer "which datasets in the UK could in principle support my study, who holds them, and what do I need to do to get access" — not "give me the data". For researchers planning a project or a feasibility assessment, it is the canonical discovery surface.

## Gotchas

- The correct host is `api.healthdatagateway.org`. The variant `api.www.healthdatagateway.org` does not resolve (DNS NXDOMAIN); older blog posts that reference it are broken. Always use this host.
- Pagination uses `perPage` (not `per_page` or `limit`). The default is 25.
- The metadata field is wrapped three layers deep: `latest_metadata.metadata.metadata.summary.title`. This reflects a versioned schema wrapper, not a typo. The example below shows how to unwrap it.
- Dataset `status` includes `DRAFT` and `ACTIVE`. Filter with `?status=ACTIVE` to skip in-progress entries from custodians who are still onboarding.
- Some endpoints documented on the marketing site (e.g. `/teams`) currently return HTTP 401 against the public host — they require an authenticated session. The endpoints listed below have all been verified to work anonymously.
- The Gateway exposes metadata for the entire UK, including custodians in Scotland, Wales and Northern Ireland. If your scope is England-only, filter on `spatialCoverage` or on the publisher's country.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

The captured sample at `examples/sample-response.json` is a single dataset record trimmed to its summary section.

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
