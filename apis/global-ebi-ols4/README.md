# EBI Ontology Lookup Service (OLS4)

> Search any of the 250+ biomedical ontologies hosted by EMBL-EBI — HPO, MONDO, EFO, GO, ChEBI, Uberon, and others — by term, label, or IRI.

| | |
|---|---|
| Provider | EMBL-EBI |
| Region | EU |
| Category | `ontology` |
| Base URL | `https://www.ebi.ac.uk/ols4/api` |
| Docs | https://www.ebi.ac.uk/ols4/help |
| Auth | None — public, no key required |
| Licence | OLS service is open; individual ontologies carry their own licences (mostly CC-BY, CC0, or Apache). |
| Rate limits | None documented |
| Last verified | 2026-05-18 |

## What it is

OLS4 is the fourth-generation Ontology Lookup Service at EMBL-EBI. It loads hundreds of biomedical ontologies into a single searchable index — the Human Phenotype Ontology (HPO), MONDO disease ontology, Experimental Factor Ontology (EFO), Gene Ontology, ChEBI chemicals, Uberon anatomy, and many others.

You can either search a single ontology by name (e.g. `?q=asthma&ontology=hp`), search across all loaded ontologies at once, or fetch a single term by IRI from a specific ontology.

It is most useful when you need a single API to resolve term identifiers across multiple biomedical vocabularies — particularly for phenotypes (HPO), diseases (MONDO/EFO), and genes (GO).

## Gotchas

- Responses follow HAL/HATEOAS conventions: lists are nested inside `_embedded` and `_links`, not at the top level.
- The term-lookup endpoint takes a **double-URL-encoded** IRI as the path segment (e.g. `http%253A%252F%252Fpurl.obolibrary.org%252Fobo%252FHP_0002099`). The browser-style IRI also works as a query parameter on `/terms?iri=...`.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
