# healthapi

A curated catalogue of **public, no-authentication health and healthcare APIs**.

Every API listed here is genuinely public — no API key, no registration, no
OAuth, no "free tier with signup". Each folder contains a short description,
key endpoints, licence and rate-limit notes, and runnable examples in
**curl**, **Python**, and **TypeScript**.

All examples were captured against live endpoints on **2026-05-18**.

## Catalogue

### Clinical evidence and biomedical literature

| API | Provider | Region |
|-----|----------|--------|
| [ClinicalTrials.gov API v2](apis/global-clinicaltrials-gov-v2/) | U.S. National Library of Medicine | Global |
| [Europe PMC REST API](apis/global-europepmc/) | Europe PMC consortium (EMBL-EBI, Wellcome, JISC) | EU |
| [NCBI E-utilities (PubMed, PMC, MeSH)](apis/global-ncbi-eutils/) | U.S. National Library of Medicine / NCBI | US |

### Drug safety and medicines

| API | Provider | Region |
|-----|----------|--------|
| [openFDA (drugs, devices, food)](apis/global-openfda/) | U.S. Food and Drug Administration | US |
| [RxNav (RxNorm)](apis/global-rxnav-rxnorm/) | U.S. National Library of Medicine | US |

### Ontologies and code systems

| API | Provider | Region |
|-----|----------|--------|
| [Disease Ontology (DO)](apis/global-disease-ontology/) | Institute for Genome Sciences, University of Maryland | Global |
| [EBI Ontology Lookup Service (OLS4)](apis/global-ebi-ols4/) | EMBL-EBI | EU |
| [NLM Clinical Tables (ICD-10-CM, LOINC, RxTerms)](apis/global-nlm-clinical-tables/) | U.S. National Library of Medicine | US |

### Public-health data and indicators

| API | Provider | Region |
|-----|----------|--------|
| [CDC Open Data (Socrata)](apis/us-cdc-socrata/) | U.S. Centers for Disease Control and Prevention | US |
| [WHO Global Health Observatory (GHO) OData](apis/global-who-gho-odata/) | World Health Organization | Global |

### UK government statistics

| API | Provider | Region |
|-----|----------|--------|
| [data.gov.uk CKAN API](apis/uk-data-gov-uk-ckan/) | UK Cabinet Office / Central Digital and Data Office | UK |
| [Office for National Statistics Beta API](apis/uk-ons-beta-api/) | Office for National Statistics | UK |

### FHIR sandboxes

| API | Provider | Region |
|-----|----------|--------|
| [HAPI FHIR Public Test Server (R4)](apis/fhir-hapi-public-r4/) | Smile Digital Health / HAPI FHIR project | Global |

## How to use the examples

Each API folder contains the same three example types. Pick whichever
matches your stack — they all hit the same endpoint and print real data.

```bash
# curl — no install required
bash apis/global-openfda/examples/curl.sh

# Python — standard library only, Python 3.11+
python3 apis/global-openfda/examples/example.py

# TypeScript — Node 20+ with native fetch
npx tsx apis/global-openfda/examples/example.ts
```

There is no project-level `package.json` or `requirements.txt` on purpose:
every example is intended to run on its own with zero setup.

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
_curation/             Build artefacts — catalogue source, curator notes, verification report
```

## What we considered and rejected

The following candidate APIs were tested against the same bar and excluded.
The reasons are themselves a useful map of how the public health-data
landscape has shifted.

| API | Status | Reason for exclusion |
|-----|--------|----------------------|
| OpenPrescribing | Blocked | Cloudflare browser-integrity check returns HTTP 403 to curl. The endpoints are notionally public but cannot be reached without a real browser. |
| NHS Website Content API | Key-gated | Now returns 401 unless an `X-API-Key` header is supplied (registration required). |
| ONS legacy timeseries API | Decommissioned | Retired 25 November 2024. Response body and `Sunset` header confirm. Replaced here by ONS Beta. |
| NICE Evidence search API | Decommissioned | Service shut down; requests redirect to a closure notice. |
| MHRA Yellow Card / Drug Analysis Profiles | No public REST | DAPs are published as PDFs and CSVs through an interactive portal; no documented JSON API. |
| European Medicines Agency (EMA) | No public REST | Data is published as Excel/CSV through a portal; no public REST API. |
| OpenAQ v3 (air quality) | Key-gated | Mandatory API key as of v3. |
| Human Mortality Database | Account-gated | Every download requires an account agreement at the source. |
| Our World in Data | No stable API | Stable CSV grabs exist but the Grapher API surface is in flux and not documented for third-party reuse. |
| ChEMBL REST API | Flaky | Returned HTTP 500 on every verification attempt. Worth retesting in a future curation pass. |
| ONC HealthIT API | Empty responses | Returns 200 but an empty JSON array without undocumented parameters. |

Full verification evidence for both inclusions and exclusions is in
[`_curation/notes.md`](_curation/notes.md) and
[`_curation/catalogue.json`](_curation/catalogue.json).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). The bar for inclusion is strict —
the API must be reachable without authentication, have a clear licence,
and have a working live example.

## Licence

This catalogue is published under the [MIT licence](LICENSE). Each upstream
API retains its own terms — see the per-API folder for details.
