# UK England health-API curation notes (2026-05-18)

Audience: NHS England senior leaders. Same strict no-auth bar as the existing catalogue. Five passed, one excluded, plus one extra added (ODS Spine). Two of the six original candidates needed to be re-pointed at the current live host before they passed.

## Candidate verdicts

### 1. OHID Fingertips — PASS

- Tested `https://fingertips.phe.org.uk/api/area_types` -> HTTP 200, `application/json`, real array of area types (England, Region (E12), GP, MSOA, Ward, ICB, etc.).
- `/profiles` and `/indicator_metadata/by_indicator_id?indicator_ids=92313` both 200 with substantive JSON.
- `/all_data/csv/by_indicator_id?indicator_ids=92313&child_area_type_id=15&parent_area_type_id=15&parent_area_code=E92000001` returns 200 `text/csv` with real "Percentage of people in employment" data for England.
- **Gotcha**: the JSON `indicator_data` and `latest_data` endpoints recommended in some docs return HTTP 500 with a browser-not-supported HTML stub for many parameter combinations. The CSV bulk endpoint is the reliable path. Documented in the entry.

### 2. NHSBSA Open Data Portal (CKAN) — PASS

- `https://opendata.nhsbsa.net/api/3/action/package_search?q=prescribing&rows=2` -> 200, 612 datasets, OGL v3.0 confirmed in metadata.
- `package_show?id=english-prescribing-data-epd` -> 200, full resource list (one CSV per month, resource_id pattern `EPD_YYYYMM`).
- `datastore_search?resource_id=EPD_202401&limit=2` -> 200, returns real prescribing-row schema (YEAR_MONTH, ICB_CODE, PRACTICE_CODE, BNF_CHEMICAL_SUBSTANCE etc.). This is the most operationally useful UK NHS API in the set — it's the raw monthly EPD that drives most prescribing analysis.

### 3. UKHSA legacy coronavirus dashboard — REPLACED, PASS as ukhsa-dashboard

- `https://api.coronavirus.data.gov.uk/v1/data` -> **DNS NXDOMAIN**. The legacy COVID dashboard host has been fully retired.
- The successor `https://api.ukhsa-dashboard.data.gov.uk/themes` -> 200 JSON with three themes (climate_and_environment, immunisation, infectious_disease).
- Deep drill `/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19/geography_types/Nation/geographies/England/metrics/COVID-19_cases_casesByDay` -> 200 with 2,296 rows of daily case data going back to 2020-01-30.
- Catalogue entry uses the live UKHSA dashboard host, not the dead coronavirus host. Documented in gotchas so consumers don't waste a day on the dead DNS.

### 4. CQC Syndication API — FAIL (excluded)

- `https://api.cqc.org.uk/public/v1/providers?page=1&perPage=5` -> **HTTP 403** `{ "statusCode": 403, "message": "Forbidden" }`.
- `https://api.cqc.org.uk/public/v1/locations?page=1&perPage=5` -> same 403.
- CQC has fully gated the syndication API behind a primary/secondary subscription-key issued after registration. Anonymous calls now return 403, not the data they used to. Fails the no-auth bar; **EXCLUDED**.

### 5. NHS England Statistics open data — FAIL (excluded)

- `https://www.england.nhs.uk/api/` -> 404. `https://www.england.nhs.uk/statistics/api/` -> 404. `https://digital.nhs.uk/api/` -> 404. `https://digital.nhs.uk/api/odata` -> 404. `https://files.digital.nhs.uk/` and `/api/datasets` -> 403 (CDN ACL, not a public API).
- The expected `https://opendata.nhs.uk/` host does NOT resolve (DNS NXDOMAIN). The lexically similar `https://www.opendata.nhs.scot/` IS live (Public Health Scotland CKAN, 200) — but that's Scotland-only and outside the England remit specified for this curation pass.
- `api.nice.org.uk` resolves but returns either 401 (subscription required for `/services`) or 404 for guidance endpoints — NICE syndication is keyed.
- NHS England RTT, A&E, Mental Health Statistics etc. are published as flat XLS/CSV files at fixed URLs under `www.england.nhs.uk/statistics/...` with no documented programmatic API surface. **EXCLUDED with finding.**

### 6. HDR UK Health Data Gateway — PASS (after host correction)

- `https://api.www.healthdatagateway.org/api/v1/datasets?limit=2` -> **DNS NXDOMAIN** (the `api.www.` prefix variant does not resolve).
- `https://api.healthdatagateway.org/api/v1/datasets?perPage=1` -> 200, 1,600 datasets total, with structured nested metadata. Catalogue entry uses the working host.
- **Important caveat documented**: the API exposes catalogue metadata only. Access to the actual datasets requires a Data Access Request to each custodian. Useful for discovery, not for retrieval of patient records — flagged in the licence and gotcha fields so folder-builder agents don't oversell it.

## Extras added

### ODS Spine (NHS Organisation Data Service ORD API) — PASS, added

- `https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/RJ1` -> 200 with full record for Guy's and St Thomas' NHS Foundation Trust (name, OID, geo, contacts, status, dates).
- `/organisations?PrimaryRoleId=RO177&Limit=3` -> 200 with three GP practices (prescribing cost centres).
- `/roles` -> 200, full lookup of NHS organisation role codes (ICB = RO261, NHS Trust = RO197, GP Practice = RO177, Pharmacy = RO182, etc.).
- `/sync?LastChangeDate=2026-05-01` -> 200 with delta-change list.
- This is the **canonical reference data layer underneath nearly every other NHS dataset in this cluster.** NHSBSA prescribing rows reference ICB_CODE and PRACTICE_CODE here. Fingertips area codes at GP and ICB level resolve here. Anyone building anything multi-source NHS will need this — adding it was a no-brainer.

### Candidates explicitly rejected for the "extras" pool

- **Public Health Scotland CKAN** (`opendata.nhs.scot`) — works, fully no-auth, but scope is Scotland not England. Skipped to keep this cluster England-focused.
- **OpenPrescribing** (`openprescribing.net/api/1.0/...`) — blocked behind a Cloudflare browser-integrity challenge (HTTP 403 with `cf-challenge` HTML). Fails the strict bar.
- **NICE Syndication** (`api.nice.org.uk`) — 401 subscription-required.
- **NHS website Conditions API** (`api.nhs.uk/conditions/...`) — 401, Azure APIM key required.
- **NHS Digital files / OData** — all paths I tried return 403 or 404; no public no-auth surface found.
- **DLUHC Open Data Communities** (`opendatacommunities.org`) — out of scope for health-specific cluster; the catalogue already has UK CKAN coverage via `uk-data-gov-uk-ckan`. Did not deep-test.

## Surprises for downstream folder-builder agents

1. **Fingertips HTTP 500 quirk.** The expected JSON `indicator_data`/`latest_data` paths return 500 + an HTML browser-not-supported page rather than 4xx JSON for invalid parameter combinations. Folder builders should prefer the `/all_data/csv/by_indicator_id` endpoint, which behaves predictably and returns CSV. Don't surface the JSON 500 path as the primary example.

2. **NHSBSA monthly-resource pattern.** English Prescribing Data isn't one big dataset — each month is its own CKAN resource with id `EPD_YYYYMM`. Always do `package_show` first to discover the current month's resource_id, then `datastore_search` against it. Hard-coding a month will silently age.

3. **UKHSA deep hierarchical paths.** The dashboard API expects fully-qualified paths through theme/sub_theme/topic/geography_type/geography/metric. Don't construct these by hand from training data — follow the `link` fields returned at each level. Names change (e.g. "infectious_disease" not "infectious-disease" or "infectiousDisease"); the live `/themes` listing is the ground truth.

4. **HDR UK metadata depth.** The dataset metadata is wrapped three layers deep (`latest_metadata.metadata.metadata.summary.title`). That's not a typo in my entry — it's the actual versioned-wrapper schema. Filter by `status=ACTIVE` to skip DRAFT entries from custodians still onboarding.

5. **ODS cross-reference value.** OrgId codes from the Spine ORD API are the join key for almost every other NHS dataset (NHSBSA prescribing, Fingertips GP-level Fingertips data, CQC location codes back when CQC was open). Folder builders writing example workflows should chain "look up ICB by name in ODS -> get OrgId -> filter NHSBSA prescribing by ICB_CODE -> compare to Fingertips ICB-level indicator." That chain shows the catalogue's combined value.

6. **Dead hosts to warn users about.** `api.coronavirus.data.gov.uk` and `api.www.healthdatagateway.org` both NXDOMAIN — anyone copy-pasting from older blog posts will hit DNS failures. The catalogue entries point at the live hosts; if folder builders write troubleshooting docs, include "if your DNS lookup fails, you may be on the legacy host."

7. **CQC was open and isn't any more.** Several older curations and even NHS-internal references still treat CQC's syndication API as open. Confirm with a fresh curl — they introduced the subscription-key gate quietly. Treat any "CQC API" reference in legacy materials with suspicion.
