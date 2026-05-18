# Curation notes — verified 2026-05-18

## Summary

- **Cut**: 13 APIs (target was 12–15).
- All 13 were hit anonymously with curl from this environment and returned HTTP 200 with real content matching their documented content type. Evidence excerpts are in `catalogue.json`.

## Breakdown

### By category
| Category | Count | APIs |
|---|---|---|
| `clinical-evidence` | 3 | ClinicalTrials.gov v2, NCBI E-utilities, Europe PMC |
| `ontology` | 3 | NLM Clinical Tables (ICD-10-CM/LOINC/RxTerms), Disease Ontology, EBI OLS4 |
| `uk-stats` | 2 | data.gov.uk CKAN, ONS Beta API |
| `drug-safety` | 2 | openFDA, RxNav (RxNorm) |
| `global-health` | 1 | WHO GHO OData |
| `public-health-data` | 1 | CDC Open Data (Socrata) |
| `fhir-sandbox` | 1 | HAPI FHIR public R4 |

### By region
| Region | Count |
|---|---|
| US | 5 |
| Global | 4 |
| UK | 2 |
| EU | 2 |

Note: `uk-nhs` category is intentionally empty — every NHS-branded developer API I tried now requires registration (see rejections). UK readers still get OPS (deaths, suicide registrations, wellbeing) via ONS, and UK NHS reference-cost datasets via the data.gov.uk CKAN index.

## Cluster assignments

Distributed 13 APIs across four clusters. Each cluster is **3 or 4 APIs** of broadly similar shape so folder-builder agents can reuse boilerplate within a cluster.

### Cluster 1 — UK government statistics (2 APIs)
- `uk-cdkan-data-gov-uk` — data.gov.uk CKAN
- `uk-ons-beta-api` — ONS Beta API

Rationale: UK-only, OGL-licensed, government-stats shaped. Same audience.

### Cluster 2 — US drug/health regulatory data (3 APIs)
- `global-openfda` — openFDA (drug, device, food)
- `global-rxnav-rxnorm` — RxNav / RxNorm
- `us-cdc-socrata` — CDC Open Data

Rationale: All US federal / NLM / FDA endpoints, all drug/device/public-health flavoured, all permissive licences (public domain). Folder-builder can reuse the same "U.S. public domain" disclaimer block.

### Cluster 3 — Global biomedical literature & indicators (4 APIs)
- `global-clinicaltrials-gov-v2` — ClinicalTrials.gov v2
- `global-ncbi-eutils` — NCBI E-utilities (PubMed, etc.)
- `global-europepmc` — Europe PMC
- `global-who-gho-odata` — WHO GHO

Rationale: Literature + global indicators. All return paginated bibliographic-style records. Agent can produce similar "search + fetch by id" example trees.

### Cluster 4 — Ontologies, code systems & FHIR (4 APIs)
- `global-nlm-clinical-tables-icd10cm` — NLM Clinical Tables
- `global-disease-ontology` — Disease Ontology
- `global-ebi-ols4` — EBI OLS4
- `fhir-hapi-public-r4` — HAPI FHIR public R4

Rationale: Code-system lookups + the FHIR sandbox. Common theme is "look up a term/resource by id". Different shape from the literature cluster, so isolating it avoids template clash.

## APIs rejected, with verification evidence

### OpenPrescribing
- **Tested**: `https://openprescribing.net/api/1.0/spending_by_org/?org_type=ccg&code=99H&format=json` and `/api/1.0/bnf_code/?q=cerazette&format=json`.
- **Result**: HTTP 403 with a Cloudflare managed-challenge page. No way to satisfy the JS challenge from curl.
- **Conclusion**: Endpoint is still anonymous in principle, but Cloudflare browser-integrity-check blocks curl. Fails the bar "a reader must be able to copy a curl command and run it immediately." **Excluded.**

### ONS legacy timeseries API (`api.ons.gov.uk`)
- **Tested**: `https://api.ons.gov.uk/timeseries/MGSX/dataset/LMS/data`.
- **Result**: HTTP 404 with response body explicitly stating: *"This API has been decommissioned… It was fully retired on 25/11/2024."*  `Sunset: Mon, 14 Oct 2024` and `Deprecation: @1725962400` response headers confirm.
- **Conclusion**: Replaced by `api.beta.ons.gov.uk` which I included instead. **Excluded.**

### NHS Website Content API (`developer.api.nhs.uk`)
- **Tested**: `https://developer.api.nhs.uk/nhs-api/content/v1/conditions`.
- **Result**: HTTP 401 — `{"message": "Unauthorized. A valid API key must be provided in the X-API-Key header."}`.
- **Conclusion**: NHS Content API now requires registration. Fails "no key, no signup" bar. **Excluded.**

### NICE Evidence search
- **Tested**: `https://www.evidence.nhs.uk/api/search`.
- **Result**: HTTP 301 → `evidence-search-service-closure-information`. The service itself was shut down (this has been the case for some time).
- **Conclusion**: Decommissioned. **Excluded.**

### MHRA Yellow Card / DAP open data
- **Tested**: `https://yellowcard.mhra.gov.uk/api/v1/search`.
- **Result**: HTTP 404 (Sucuri caching, no API at that path).
- **Conclusion**: MHRA does publish Drug Analysis Profile PDFs/CSVs through the interactive DAPs site, but there is no documented public JSON API. **Excluded.**

### EMA (European Medicines Agency)
- **Tested**: `https://www.ema.europa.eu/api/medicines` and a guess at `api.api.ema.europa.eu`.
- **Result**: 404 / DNS not found. EMA publishes Excel/CSV exports through a search portal but offers no public REST API at the time of verification.
- **Conclusion**: **Excluded.**

### OpenAQ
- **Tested**: `https://api.openaq.org/v3/locations`.
- **Result**: HTTP 401 — `{"message": "Unauthorized. A valid API key must be provided in the X-API-Key header."}`.
- **Conclusion**: OpenAQ v3 (the current version) now mandates an API key. **Excluded.**

### Human Mortality Database
- Not tested with curl — the maintainers gate every download behind an account agreement at the source. Confirmed by documentation only.
- **Excluded** per the original prompt's suggestion.

### Our World in Data
- Has CSV grabs at predictable URLs but no stable REST API as of writing. The new Grapher API surface is in flux and not documented for third-party reuse. **Excluded** to keep the bar high.

### ChEMBL REST API
- **Tested**: `https://www.ebi.ac.uk/chembl/api/data/molecule.json?limit=2` — twice, once after a delay.
- **Result**: HTTP 500 (EBI error page) both times.
- **Conclusion**: Drug discovery data is genuinely no-key in normal operation but the service was throwing 500s during verification. Per the brief — "if an endpoint is flaky, exclude it" — **excluded**. Worth re-checking in a future curation pass.

### ONC HealthIT API
- **Tested**: `https://healthit.gov/data/open-api?api=onc-certified-health-it-products`.
- **Result**: HTTP 200 but body was an empty JSON array `[]`. Likely needs additional query parameters that aren't documented in the dataset listing.
- **Conclusion**: Returns "real" 200 but no useful content out of the box. Fails "returns real data". **Excluded.**

## Surprises worth recording downstream

- **openFDA truly is keyless** for low-volume callers: 1,000 req/IP/day, 240 req/min burst. The "API key" prompts on their docs site are for higher-volume tiers only. Excerpt and the link header in my verification confirm.
- **NCBI E-utilities** sends `X-RateLimit-Limit: 3` and `X-RateLimit-Remaining: 2` on every anonymous call — so the documented 3/sec limit is enforced live. Anything chatty will get 429s quickly.
- **ClinicalTrials.gov v1** lives at `https://classic.clinicaltrials.gov/api/` and is deprecated. The host `api.clinicaltrials.gov` doesn't resolve. **Always use `https://clinicaltrials.gov/api/v2/`** — folder-builders that lift snippets from old blog posts will break.
- **data.gov.uk** redirects every request to `ckan.publishing.service.gov.uk`. Document the resolved host so users don't hit the redirect every call.
- **ONS** legacy API explicitly emits `Sunset` and `Deprecation` headers — nice. The beta replacement at `api.beta.ons.gov.uk` is verbose JSON; downstream agents should trim sample responses aggressively.
- **Disease Ontology** issues 308 permanent-redirects to trailing-slash URLs. Note for any minimal-dep curl examples — pass `-L`.
- **NLM Clinical Tables** returns a positional JSON array, not an object. Anyone copy-pasting expecting `{ results: [...] }` will be confused — give them a worked example.

## Response sizes — trim aggressively

For the repo's per-API folder samples, the following responses should be trimmed to the first ~10–20 lines or a single record:

- **WHO GHO `/Indicator`** — 400+ KB JSON of every indicator.
- **ClinicalTrials.gov** study record — a single study can be 50+ KB pretty-printed; pick a deliberately small one or use `fields=` projection.
- **CKAN `package_search`** with rows=20 is ~100 KB. Use `rows=2` and tell folder-builder to strip the `resources` arrays in examples.
- **openFDA** drug events have huge nested arrays. Use `limit=1` and consider redacting the `narrativeincludeclinical` blob in samples.
- **Europe PMC** with `pageSize > 5` gets large. Use `resultType=lite&pageSize=1`.

## Notes for folder-builder agents

- Every entry's `verification_evidence.response_excerpt` is real text from the live API on 2026-05-18. Use it for the "Example response" block but trim further if needed for readability.
- The `auth` field is always `"none"` — that's the gate this whole list satisfies. Folder READMEs can call this out at the top.
- For each `key_endpoints[].example_params`, the URLs in `verification_evidence.endpoint_tested` are confirmed-working curl-able URLs you can paste verbatim into a "Try it" section.
- Where `gotchas` mentions a specific behaviour (cursor pagination, redirects, JSON-array responses), please surface that in the folder README rather than burying it.
- License field is short-form; for some APIs (CDC, openFDA) the underlying terms link is the canonical source — link to it, don't paraphrase.
