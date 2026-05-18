# Code and provenance review — 2026-05-18

## Summary

- Files reviewed: 39 example files (13 × `curl.sh`, 13 × `example.py`, 13 × `example.ts`) plus 13 × `README.md` and 13 × `endpoints.md`.
- Code issues found: 6 (high: 0, medium: 1, low: 5)
- Provenance issues found: 4 (high: 1, medium: 1, low: 2)
- Folders where provenance is fully clean: 9 / 13

Overall the code is of a high standard: stdlib-only Python, native `fetch` in TypeScript, no third-party imports, sensible types, bounded output via `head -c`, every script has a non-zero exit on error. The provenance picture is mostly clean — one folder has a docs link that does not point at the named provider, and one factual claim about a sunset date is off by six weeks against a live HTTP header.

## Code findings

### High

None.

### Medium

- **`apis/global-rxnav-rxnorm/examples/` — curl vs Python/TS demonstrate different first calls.** `curl.sh` line 9 hits `/drugs.json?name=lipitor`. `example.py` line 27 and `example.ts` line 31 hit `/rxcui.json?name=lipitor`. Both resolve Lipitor but to different shapes (`drugGroup` vs `idGroup`). A reader who switches language sees a different demo, not the same demo in a new tongue. The brief asks the three example types to hit comparable endpoints. Fix: either start `curl.sh` with `/rxcui.json?name=lipitor` first, or start Python/TS with `/drugs.json?name=lipitor` and walk into properties from there. (`drugs.json` is the better demonstration of the API's grouping behaviour, so aligning curl is the stronger choice.)

### Low / nitpicks

- **`apis/global-ebi-ols4/examples/example.py` and `example.ts` cover only one of the three operations in `curl.sh`.** Curl demonstrates `/search`, `/ontologies/{id}`, and term-by-IRI (the double-URL-encoded path segment that is the genuine OLS4 trap). Python/TS show only the search. The example IRI snippet in curl is the most useful pedagogical bit and there is no language-parity copy of it. Optional: add an IRI-fetch step to Python/TS, or trim curl to one operation to match. Not a blocker — the search is the primary call and parity exists there.

- **`apis/global-ebi-ols4/examples/curl.sh:10` quotes the URL containing `&` with double quotes.** This is functionally safe (double quotes prevent `&` from being parsed as background by bash) but the review brief asks for single quotes around URLs containing `&` or `?`. Most other folders (e.g. `global-clinicaltrials-gov-v2/examples/curl.sh:8`, `global-europepmc/examples/curl.sh:8,14`, `global-openfda/examples/curl.sh:8,14,20`, `us-cdc-socrata/examples/curl.sh:14,20`) use single quotes around the full URL — adopt that style here too for consistency.

- **`apis/uk-data-gov-uk-ckan/examples/curl.sh:18` includes a redundant `-H 'Accept: application/json'`.** The CKAN endpoint returns JSON regardless of Accept header (it is path-typed via `/action/...`). The header costs nothing but is inconsistent with the other two examples in the same file which omit it. Either add it everywhere or remove it — current state is mixed inside one script.

- **`apis/global-ncbi-eutils/examples/example.py:21` uses a literal `[email protected]`.** This is fine as a placeholder, and the inline comment on line 19 explicitly says "replace these in your own code". A copy-paste user who forgets will send NCBI an address NCBI cannot use to contact them — which is exactly the failure NCBI documented this parameter to avoid. Consider making the placeholder more obviously unusable, e.g. `[email protected]`, so the bad copy-paste is at least addressed to the right place.

- **`apis/global-disease-ontology/examples/example.py:9` imports `urlencode` from `urllib.parse` but never uses it.** `fetch()` only calls `urlencode` inside an `if params:` branch and `main()` always passes `path` with no params. Either drop the import or actually exercise it (e.g. pass `params={"format": "json"}` somewhere). Cosmetic.

- **`apis/global-disease-ontology/examples/example.ts:15-19` declares `parents`, `children`, `synonyms`, `xrefs` as non-optional on the `Term` interface, but `example.py:30` defensively does `term.get("parents", [])`.** The Python is hedged but the TS will throw on `term.parents.map(...)` if the upstream ever omits a field. Mark them optional in TS for symmetry (`parents?: string[]` etc.) — the data shape is curated by an external party and could shift.

## Provenance findings

| Folder | Severity | Issue | Evidence |
|---|---|---|---|
| `uk-data-gov-uk-ckan` | High | `Docs` link does not point at the named provider's documentation. README line 11 cites `https://docs.ckan.org/en/latest/api/index.html` while the README's stated Provider is "UK Cabinet Office / Central Digital and Data Office". `docs.ckan.org` is the upstream open-source CKAN project's documentation, operated by the wider CKAN community (under Open Knowledge Foundation lineage), not by UK Government. WebFetch of the linked page confirms it uses `demo.ckan.org` as the example host and contains no UK Government branding. | `WebFetch https://docs.ckan.org/en/latest/api/index.html` → "Based on the content provided, this documentation is for the upstream open-source CKAN project, not the data.gov.uk deployment. … maintained by the Open Knowledge Foundation as part of the open-source CKAN project." A genuine provider-side doc lives at `https://guidance.data.gov.uk/` (the Data Standards Authority's CKAN guidance) or the CKAN deployment's own `/api/3/action/help_show` introspection. |
| `uk-ons-beta-api` | Medium | README line 27 claims the legacy host was "fully retired on 25 November 2024". Live HTTP headers from `api.ons.gov.uk/timeseries/...` return `Sunset: Mon, 14 Oct 2024 00:00:00 UTC` and `Deprecation: @1725962400` (= 2024-09-10 10:00 UTC). The README date is roughly six weeks later than the upstream-declared sunset. | `curl -D - https://api.ons.gov.uk/timeseries/wkly_deaths/dataset/weekly-deaths` (run 2026-05-18) → `HTTP/2 404 … sunset: Mon, 14 Oct 2024 00:00:00 UTC, deprecation: @1725962400`. Suggested replacement: "retired on 14 October 2024 (per the Sunset response header on the legacy host)". |
| `fhir-hapi-public-r4` | Low | README line 7 names the Provider as "Smile Digital Health / HAPI FHIR project". The linked docs page at `hapifhir.io/hapi-fhir/docs/server_plain/test_server.html` does not explicitly attribute operation of the public test server to Smile Digital Health — it mentions "Smile CDR" only as a commercial-support entity. The relationship is real (Smile Digital Health, formerly Smile CDR, is the project sponsor and originator) but is not stated by the linked page itself. | `WebFetch https://hapifhir.io/hapi-fhir/docs/server_plain/test_server.html` → "the documentation does not specify who runs the test server. The page lists 'Smile CDR' under a 'SUPPORT' section". This is defensible from the wider HAPI FHIR project history but is not a one-click substantiation from the docs URL given. Either add a second link (e.g. `https://hapifhir.io/` which credits Smile CDR / Smile Digital Health as project lead) or trim the provider claim to "HAPI FHIR project". |
| `global-europepmc` | Low | README line 7 names the Provider as "Europe PMC consortium (EMBL-EBI, Wellcome Trust, JISC, et al.)". The linked docs page attributes the service to "EMBL-EBI with support from the Europe PMC Funders' Group, in collaboration with the National Library of Medicine (NLM)". Wellcome Trust and JISC are members of the Funders' Group historically but are not named directly on the linked page. | `WebFetch https://europepmc.org/RestfulWebService` → "developed by EMBL-EBI with support from the Europe PMC Funders' Group, in collaboration with the National Library of Medicine (NLM). The document does not mention Wellcome Trust or JISC consortium as operators." Tighten the Provider line to match what the linked docs actually claim, e.g. "EMBL-EBI, on behalf of the Europe PMC Funders' Group, in collaboration with NLM". |

## Folders that pass cleanly (provenance)

1. `global-clinicaltrials-gov-v2` — Provider, Base URL, Docs link, licence all match the upstream `clinicaltrials.gov/data-api/api` page. Examples call `clinicaltrials.gov/api/v2/`, exactly matching the README's Base URL.
2. `global-disease-ontology` — After this session's catalogue fix, Base URL `api.disease-ontology.org/v1` and Docs URL `disease-ontology.org/do-kb/api_doc` both resolve. The upstream copyright statement on the docs page names the University of Maryland Baltimore School of Medicine, of which the Institute for Genome Sciences is part — the README's "Institute for Genome Sciences, University of Maryland" is consistent.
3. `global-ebi-ols4` — Docs link is the live OLS4 help page. Examples call `www.ebi.ac.uk/ols4/api`, matching Base URL.
4. `global-ncbi-eutils` — Docs link `NBK25501` is the NCBI book chapter, the canonical reference. Rate-limit claim ("3 req/sec anonymous, X-RateLimit headers returned") confirmed by live HTTP: a fresh GET returns `x-ratelimit-limit: 3, x-ratelimit-remaining: 2`. The README's factual rate-limit claim is fully substantiated.
5. `global-nlm-clinical-tables` — Docs link to the service's own landing page. Base URL `clinicaltables.nlm.nih.gov/api` matches examples.
6. `global-openfda` — Docs link `open.fda.gov/apis/` is the canonical FDA dev portal. Rate-limit claim ("1,000/day anonymous, 120,000/day with free key, 240/min burst") matches the published openFDA documentation. Base URL `api.fda.gov` matches examples.
7. `global-rxnav-rxnorm` — Docs link `lhncbc.nlm.nih.gov/RxNav/APIs/RxNormAPIs.html` is the NLM Lister Hill Center's canonical RxNav docs. The "DDI endpoint returns 404" claim was verified live this session: `curl -I https://rxnav.nlm.nih.gov/REST/interaction/interaction.json?rxcui=88014` → `HTTP/2 404`.
8. `global-who-gho-odata` — Docs link is the WHO's own GHO OData page. Base URL `ghoapi.azureedge.net/api` matches both the docs page and the examples. The licence claim ("CC BY-NC-SA 3.0 IGO") is the WHO's standard publishing licence; the docs page itself defers to the broader WHO publishing policy without restating the licence inline, so the README hedge "verify per indicator" is appropriate.
9. `us-cdc-socrata` — Docs link `dev.socrata.com/foundry/data.cdc.gov` is the foundry view for the CDC instance on Socrata's documentation site. The platform is Socrata-operated (Tyler Technologies) on behalf of the CDC; the README names CDC as Provider (which is correct for the data) and links to the Socrata foundry page (which is correct for the API surface). Defensible split.

## Recommendations

### Fix now

1. **Replace the CKAN docs link** in `apis/uk-data-gov-uk-ckan/README.md` (line 11) and `_curation/catalogue.json` (the `docs_url` field for `uk-data-gov-uk-ckan`). The link should point to the data.gov.uk-operated documentation, not the upstream CKAN open-source project. Two candidates that are both UK-Gov-operated:
   - `https://guidance.data.gov.uk/` — the Data Standards Authority's broader guidance hub.
   - `https://ckan.publishing.service.gov.uk/api/3/action/help_show?name=package_search` — the CKAN instance's own `help_show` introspection endpoint, which IS upstream-provider-operated and returns parameter docs for any action.
   The latter is preferable because it is operated by the actual API host. If `docs.ckan.org` is kept as a secondary reference (it IS useful for CKAN newcomers), call it out as "underlying CKAN software documentation" rather than the Docs link.

2. **Correct the ONS sunset date** in `apis/uk-ons-beta-api/README.md` (line 27) from "25 November 2024" to "14 October 2024", and add a parenthetical "(per the `Sunset` header on the legacy host)" so a future reader can verify the claim with one `curl -I`. The current date is contradicted by the live HTTP header.

3. **Align the RxNav curl.sh demo with Python/TS** in `apis/global-rxnav-rxnorm/examples/`. Either change curl Example 1 to `/rxcui.json?name=lipitor` (matches Python/TS line 1) or change Python/TS step 1 to `/drugs.json?name=lipitor` (matches curl Example 1). Pick whichever you prefer pedagogically — what matters is that all three examples open with the same call.

### Consider for v2

4. **Tighten the HAPI FHIR provider claim** so the Docs link substantiates it on one click. Options: (a) change Provider to "HAPI FHIR project (sponsored by Smile Digital Health)" and link to `hapifhir.io` as a second source, or (b) leave the Provider as-is and add a clarifying note in the body that the project is led by Smile Digital Health (formerly Smile CDR).

5. **Tighten the Europe PMC provider claim** to match the upstream wording: "EMBL-EBI, on behalf of the Europe PMC Funders' Group, in collaboration with the U.S. National Library of Medicine". Wellcome and JISC are real funders but listing them inline implies they are operators.

6. **Make the OLS4 examples a full triple**. Either add the term-by-IRI fetch to `example.py` and `example.ts` (because the double-URL-encoded path segment IS the part of OLS4 most likely to trip up readers), or trim `curl.sh` to one demo so the triple-by-language parity is exact.

7. **Standardise the bash style** across `curl.sh` files: single quotes around URLs that contain `&` or `?`. Only `global-ebi-ols4/examples/curl.sh` currently uses double quotes around such a URL (line 10); every other folder uses single quotes.

8. **Replace the dead-letter NCBI placeholder email** (`[email protected]` → `[email protected]`) in `global-ncbi-eutils/examples/example.py` line 21 and `example.ts` line 9. The current value is a valid-looking email; the suggested form is RFC-reserved and obviously a placeholder.

9. **Optional, cosmetic only**: drop the unused `urlencode` import from `global-disease-ontology/examples/example.py` (line 9), or pass a query parameter somewhere to use it.

### Out of scope (no action)

- The provenance call on `us-cdc-socrata` linking to `dev.socrata.com` rather than a CDC-operated page is defensible: there is no CDC-operated dev portal for the Socrata surface — the Socrata foundry page is the canonical machine-readable docs for that instance.
- The WHO docs page does not restate the licence inline; the README's hedge "verify per indicator" is correct.
- The HAPI FHIR test server data quirk (Latin-1-encoded "ñ" rendering as `NuÃ±ez`) is real upstream data, not a folder defect, and is already noted in the verification report.
