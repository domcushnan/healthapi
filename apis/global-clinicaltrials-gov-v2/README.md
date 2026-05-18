# ClinicalTrials.gov API v2

> Search and fetch records for clinical studies registered worldwide, including protocol details, status, sponsors and (where posted) results.

| | |
|---|---|
| Provider | U.S. National Library of Medicine |
| Region | Global |
| Category | `clinical-evidence` |
| Base URL | `https://clinicaltrials.gov/api/v2` |
| Docs | https://clinicaltrials.gov/data-api/api |
| Auth | None — public, no key required |
| Licence | Public domain (U.S. government work). Terms: https://clinicaltrials.gov/about-site/terms-conditions |
| Rate limits | None documented; be considerate (no more than a few requests per second) |
| Last verified | 2026-05-18 |

## What it is

ClinicalTrials.gov is the U.S. National Library of Medicine's registry of clinical studies conducted around the world. The v2 API exposes the full registry as JSON: every study has an NCT identifier, a protocol record (eligibility, interventions, locations, sponsors), a status timeline and — for completed studies that posted them — results sections.

It is the primary source for finding what trials exist for a given condition or intervention, who is running them, where they are recruiting and what they reported. Researchers use it for evidence synthesis, sponsors for competitive landscape, patients and clinicians for trial matching.

The v2 API replaces the legacy v1 endpoints at `classic.clinicaltrials.gov`. The old `api.clinicaltrials.gov` host no longer resolves.

## Gotchas

- Always use `https://clinicaltrials.gov/api/v2/`. The old `api.clinicaltrials.gov` host returns DNS errors, and `classic.clinicaltrials.gov/api/` v1 paths are deprecated.
- Pagination is cursor-based via `nextPageToken`, not page numbers or offsets. Pass the returned token back as `pageToken` to get the next page.
- Single study records can exceed 50 KB. Use `fields=` to project only the modules you need (e.g. `fields=NCTId,BriefTitle,OverallStatus`).
- Use `query.cond=` for condition searches, `query.intr=` for intervention, `query.term=` for free-text across all fields.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
