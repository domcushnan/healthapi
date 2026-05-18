# Disease Ontology (DO) API

> Look up a human disease by its DOID, get the canonical definition, parents, synonyms, and cross-references to ICD-10, SNOMED, MeSH and other vocabularies.

| | |
|---|---|
| Provider | Institute for Genome Sciences, University of Maryland |
| Region | Global |
| Category | `ontology` |
| Base URL | `https://api.disease-ontology.org/v1` |
| Docs | https://disease-ontology.org/do-kb/api_doc |
| Auth | None — public, no key required |
| Licence | CC0 1.0 (public domain dedication) |
| Rate limits | None documented |
| Last verified | 2026-05-18 |

## What it is

The Human Disease Ontology is a curated, open vocabulary of human disease terms. Each term has a stable identifier (e.g. `DOID:14330` for Parkinson's disease), a definition, parent terms, synonyms, and cross-references to ICD-10-CM, ICD-9-CM, SNOMED CT, MeSH, OMIM, KEGG, UMLS and others.

The API is a thin REST wrapper over the underlying graph. The two GET endpoints worth knowing about are `terms/{DOID}` for fetching a disease by ID and `terms/label/{label}` for resolving a name (e.g. "asthma") to its term.

It is most useful when you have a disease name in one vocabulary and need its identifier in another — DO acts as a bridge.

## Gotchas

- The legacy host `disease-ontology.org/api/metadata/{DOID}/` still responds but is not the documented surface; the API has moved to `api.disease-ontology.org/v1`. Use the new host.
- Free-text search across diseases is exposed as `POST /terms/search` with a JSON body, not a GET. For simple name-to-DOID lookup, `GET /terms/label/{label}` is easier.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
