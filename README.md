# healthapi

A curated catalogue of **public, no-authentication health and healthcare APIs**.

Every API listed here is genuinely public — no API key, no registration, no
OAuth, no "free tier with signup". Each folder contains a short description,
key endpoints, licence and rate-limit notes, and runnable examples in
**curl**, **Python**, and **TypeScript**.

All examples were captured against live endpoints on **2026-05-18**.

## Catalogue

### UK NHS data

| API | Provider | Region |
|-----|----------|--------|
| [NHS Business Services Authority Open Data Portal](apis/uk-nhsbsa-opendata/) | NHS Business Services Authority | UK-England |
| [NHS Organisation Data Service (ODS) ORD API](apis/uk-ods-spine/) | NHS England / Spine | UK |

### UK public health and surveillance

| API | Provider | Region |
|-----|----------|--------|
| [OHID Fingertips Public Health Data API](apis/uk-fingertips/) | Office for Health Improvement and Disparities (DHSC) | UK-England |
| [HDR UK Health Data Gateway API](apis/uk-hdr-gateway/) | Health Data Research UK | UK |
| [UKHSA Data Dashboard API](apis/uk-ukhsa-dashboard/) | UK Health Security Agency | UK-England |

### UK government statistics

| API | Provider | Region |
|-----|----------|--------|
| [data.gov.uk CKAN API](apis/uk-data-gov-uk-ckan/) | UK Cabinet Office / Central Digital and Data Office | UK |
| [Office for National Statistics Beta API](apis/uk-ons-beta-api/) | Office for National Statistics | UK |

### Clinical evidence and biomedical literature

| API | Provider | Region |
|-----|----------|--------|
| [ClinicalTrials.gov API v2](apis/global-clinicaltrials-gov-v2/) | U.S. National Library of Medicine | Global |
| [Europe PMC REST API](apis/global-europepmc/) | EMBL-EBI on behalf of the Europe PMC Funders' Group, with NLM | EU |
| [NCBI E-utilities (PubMed, PMC, MeSH)](apis/global-ncbi-eutils/) | U.S. National Library of Medicine / NCBI | US |

### Drug safety and medicines

| API | Provider | Region |
|-----|----------|--------|
| [openFDA (drugs, devices, food)](apis/global-openfda/) | U.S. Food and Drug Administration | US |
| [RxNav (RxNorm)](apis/global-rxnav-rxnorm/) | U.S. National Library of Medicine | US |

### Global and US public-health data

| API | Provider | Region |
|-----|----------|--------|
| [CDC Open Data (Socrata)](apis/us-cdc-socrata/) | U.S. Centers for Disease Control and Prevention | US |
| [WHO Global Health Observatory (GHO) OData](apis/global-who-gho-odata/) | World Health Organization | Global |

### Ontologies and code systems

| API | Provider | Region |
|-----|----------|--------|
| [Disease Ontology (DO)](apis/global-disease-ontology/) | Institute for Genome Sciences, University of Maryland | Global |
| [EBI Ontology Lookup Service (OLS4)](apis/global-ebi-ols4/) | EMBL-EBI | EU |
| [NLM Clinical Tables (ICD-10-CM, LOINC, RxTerms)](apis/global-nlm-clinical-tables/) | U.S. National Library of Medicine | US |

### FHIR sandboxes

| API | Provider | Region |
|-----|----------|--------|
| [HAPI FHIR Public Test Server (R4)](apis/fhir-hapi-public-r4/) | Smile Digital Health / HAPI FHIR project | Global |

## How to use the examples

Each API folder contains the same three example types. Pick whichever
matches your stack — they all hit the same endpoint and print real data.

```bash
# curl — no install required
bash apis/uk-fingertips/examples/curl.sh

# Python — standard library only, Python 3.11+
python3 apis/uk-fingertips/examples/example.py

# TypeScript — Node 20+ with native fetch
npx tsx apis/uk-fingertips/examples/example.ts
```

There is no project-level `package.json` or `requirements.txt` on purpose:
every example is intended to run on its own with zero setup.

## How the UK NHS folders fit together

`uk-ods-spine` is the join key for everything else: NHS Business Services
Authority prescribing rows reference ODS organisation codes; Fingertips
GP-level data and UKHSA geography are looked up against ODS area codes;
HDR UK Gateway dataset records link out to provider organisations via the
same identifiers. The five UK folders cross-link to each other where they
share fields, so a reader can move between them without rediscovering the
identifier graph each time.

## Repo layout

```
apis/
  <api-name>/
    README.md          What it is, who runs it, licence, rate limits, gotchas
    endpoints.md       Key endpoints with parameters
    examples/
      curl.sh          Shell, no dependencies
      example.py       Python 3.11+, standard library only
      example.ts       TypeScript, Node 20+ with native fetch
      sample-response.json   Real captured response, trimmed
_curation/             Build artefacts — catalogue source, curator notes, verification reports
```

## What we considered and rejected

The following candidate APIs were tested against the same bar and excluded.
The reasons are themselves a useful map of how the public health-data
landscape has shifted — particularly the UK NHS surface, where most named
APIs are now behind keys or have been retired.

| API | Status | Reason for exclusion |
|-----|--------|----------------------|
| OpenPrescribing | Blocked | Cloudflare browser-integrity check returns HTTP 403 to curl. The endpoints are notionally public but cannot be reached without a real browser. |
| NHS Website Content API (`api.nhs.uk`) | Key-gated | Returns 401 unless an `X-API-Key` is supplied. Confirmed again 2026-05-18. |
| NICE Evidence search API | Decommissioned | Service shut down; requests redirect to a closure notice. |
| NICE Syndication | Subscription | Returns 401, requires a NICE-issued subscription key. |
| MHRA Yellow Card / Drug Analysis Profiles | No public REST | DAPs are published as PDFs and CSVs through an interactive portal; no documented JSON API. |
| CQC Syndication API | Key-gated | `api.cqc.org.uk/public/v1/providers` and `/locations` return HTTP 403 with `Forbidden`. The historical no-key access has been removed. |
| NHS England statistics open data | No public REST | A&E waits, RTT, mental health stats are all flat-file (CSV/XLSX) only. `opendata.nhs.uk` does not resolve. No documented programmatic surface at `england.nhs.uk/api` or `digital.nhs.uk/api`. |
| ONS legacy timeseries API | Decommissioned | Retired 14 October 2024 per the `Sunset` response header. Replaced here by ONS Beta. |
| European Medicines Agency (EMA) | No public REST | Data is published as Excel/CSV through a portal; no public REST API. |
| OpenAQ v3 (air quality) | Key-gated | Mandatory API key as of v3. |
| Human Mortality Database | Account-gated | Every download requires an account agreement at the source. |
| Our World in Data | No stable API | Stable CSV grabs exist but the Grapher API surface is in flux and not documented for third-party reuse. |
| ChEMBL REST API | Flaky | Returned HTTP 500 on every verification attempt. Worth retesting in a future curation pass. |
| ONC HealthIT API | Empty responses | Returns 200 but an empty JSON array without undocumented parameters. |

Full verification evidence for both inclusions and exclusions is in
[`_curation/notes.md`](_curation/notes.md),
[`_curation/notes-uk.md`](_curation/notes-uk.md), and
[`_curation/catalogue.json`](_curation/catalogue.json).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The bar for inclusion is strict —
the API must be reachable without authentication, have a clear licence,
and have a working live example.

## Licence

This catalogue is published under the [MIT licence](LICENSE). Each upstream
API retains its own terms — see the per-API folder for details.
