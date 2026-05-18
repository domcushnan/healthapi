# Europe PMC REST API

> Search biomedical literature across PubMed, PMC, preprints and patents, and fetch full-text XML for open-access articles.

| | |
|---|---|
| Provider | EMBL-EBI, on behalf of the Europe PMC Funders' Group, in collaboration with the U.S. National Library of Medicine |
| Region | EU |
| Category | `clinical-evidence` |
| Base URL | `https://www.ebi.ac.uk/europepmc/webservices/rest` |
| Docs | https://europepmc.org/RestfulWebService |
| Auth | None — public, no key required |
| Licence | The service is free; individual article rights vary (open access or restricted). Bibliographic metadata is generally free to reuse. |
| Rate limits | Documented fair-use; no hard published limit. Keep concurrent requests modest. |
| Last verified | 2026-05-18 |

## What it is

Europe PMC is a free repository of life-sciences literature run by a consortium led by EMBL-EBI. It indexes PubMed and PMC alongside preprint servers (bioRxiv, medRxiv), patents, theses and clinical guidelines, and exposes the lot through a single REST search interface.

The `/search` endpoint accepts the same Lucene-style query syntax used in the Europe PMC website (`AUTH:"smith"`, `JOURNAL:"BMJ"`, `OPEN_ACCESS:y`, etc.) and returns records with PubMed IDs, DOIs, abstracts and links to full text where available. For open-access articles you can pull the JATS XML directly via the `/article` endpoint.

It is the most comprehensive non-US biomedical literature index that works without an API key.

## Gotchas

- Pagination is cursor-based: pass the returned `nextCursorMark` as `cursorMark` on the next call. Page numbers (`page=`) are not supported in the modern API.
- Default response format is XML. Always pass `format=json` for JSON.
- `resultType=lite` returns much smaller records than `resultType=core` (which includes abstracts, MeSH terms and cross-references). Default is `lite`.
- The `pageSize` cap is 1000, but responses get large fast — start at 25.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
