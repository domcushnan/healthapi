# NLM Clinical Tables Search Service (ICD-10-CM, LOINC, RxTerms)

> Type-ahead lookup for clinical code systems: ICD-10-CM diagnoses, LOINC lab codes, RxTerms drug names, and more.

| | |
|---|---|
| Provider | U.S. National Library of Medicine |
| Region | US |
| Category | `ontology` |
| Base URL | `https://clinicaltables.nlm.nih.gov/api` |
| Docs | https://clinicaltables.nlm.nih.gov/ |
| Auth | None — public, no key required |
| Licence | U.S. public domain (NLM). Underlying code systems (ICD-10-CM, LOINC) carry their own terms; ICD-10-CM is public, LOINC is free with a use agreement at the source. |
| Rate limits | None documented; long-cache headers indicate caching is encouraged |
| Last verified | 2026-05-18 |

## What it is

Clinical Tables is not a single endpoint but a family of search services hosted by the NLM. Each code system lives under its own path prefix — `/icd10cm/v3/search` for diagnoses, `/loinc_items/v3/search` for lab codes, `/rxterms/v3/search` for consumer-friendly drug names, plus others (ICD-10-PCS procedures, ICD-9-CM, SNOMED CT subset, conditions, allergies, NPI registry, etc.).

Every endpoint behaves the same way: it is a type-ahead service that takes a `terms=` substring and returns matching codes ranked by best fit. It is what powers many of the autocomplete widgets you see on US health-IT forms.

It is most useful when you need to translate a free-text symptom or drug name into the structured code your downstream system actually wants to store.

## Gotchas

- Responses are a positional JSON array, not an object: `[total, codes, extra, displayFields]`. Don't expect a typical `{ results: [...] }` envelope — see the examples for how to unpack it.
- Each code system has its own path. Hitting `/icd10cm/v3/search` only searches ICD-10-CM; you'll need to call each path you want to search.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
