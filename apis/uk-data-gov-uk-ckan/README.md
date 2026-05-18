# data.gov.uk CKAN API (health subset)

> What UK public-sector datasets are published on a given health topic, and where can the underlying files be downloaded.

| | |
|---|---|
| Provider | UK Cabinet Office / Central Digital and Data Office |
| Region | UK |
| Category | `uk-stats` |
| Base URL | `https://ckan.publishing.service.gov.uk/api/3` |
| Docs | https://docs.ckan.org/en/latest/api/index.html |
| Auth | None — public, no key required |
| Licence | Datasets vary; most are Open Government Licence v3.0 (https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/). Check each package's `license_id` field. |
| Rate limits | None documented |
| Last verified | 2026-05-18 |

## What it is

data.gov.uk is the UK government's index of open datasets published by central government, devolved administrations, local authorities, and arms-length bodies. The portal is a CKAN instance, so it exposes the standard CKAN Action API: every browse and search action on the website maps to a JSON endpoint with the same parameters.

The catalogue covers everything from NHS reference costs and prescribing volumes to hospital activity, public health outcomes, and Northern Ireland health-trust returns. For each dataset CKAN returns the metadata (title, organisation, licence, update frequency) plus a `resources` array pointing at the actual files — usually CSV, XLSX or an external portal URL.

It is most useful as the first stop when looking for "is there a UK government dataset on X?" — it does not host most of the bytes itself, but it tells you who does.

## Gotchas

- The historical host `https://data.gov.uk/api/3/...` returns a 301 redirect to `ckan.publishing.service.gov.uk`. Always call the resolved host directly to avoid an extra round trip per request.
- CKAN gives you dataset metadata plus a list of resource URLs — it does not always proxy the files themselves. Many `resources[].url` values point at `opendatani.gov.uk`, `digital.nhs.uk`, or a department's own portal.
- Search is full-text against the package index. To filter by topic, use `fq=topic:health` rather than relying on `q` alone.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
