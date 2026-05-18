# NCBI E-utilities (PubMed, PMC, MeSH, etc.)

> Search and fetch records from any NCBI Entrez database — PubMed citations, PMC full text, MeSH headings, GenBank sequences and 30+ other resources — through a single set of GET endpoints.

| | |
|---|---|
| Provider | U.S. National Library of Medicine / NCBI |
| Region | US |
| Category | `clinical-evidence` |
| Base URL | `https://eutils.ncbi.nlm.nih.gov/entrez/eutils` |
| Docs | https://www.ncbi.nlm.nih.gov/books/NBK25501/ |
| Auth | None — public, no key required (a free API key raises the limit) |
| Licence | U.S. public domain for NCBI-produced content. Embedded third-party content (e.g. publisher abstracts) retains its own copyright. |
| Rate limits | **3 requests/sec per IP anonymous**, 10/sec with a free API key. The cap is enforced — `X-RateLimit-Limit: 3` is returned on every response. |
| Last verified | 2026-05-18 |

## What it is

E-utilities ("Entrez Programming Utilities") is the long-standing API behind NCBI's family of databases. The same nine endpoints work across every Entrez database — you pick the database with the `db=` parameter, search it with `esearch`, summarise the results with `esummary`, and fetch full records with `efetch`.

For health work the most common targets are `pubmed` (citations and abstracts), `pmc` (full-text articles), `mesh` (Medical Subject Headings) and `clinvar` (genetic variants). The two-step pattern is `esearch` -> get UIDs -> `esummary` (or `efetch`) -> get records.

It is the lingua franca of biomedical informatics. Every reference manager, literature-mining tool and PubMed clone uses these endpoints under the hood.

## Gotchas

- Anonymous callers are strictly limited to **3 requests per second per IP**. Exceeding it returns HTTP 429. For any volume, register a free API key at https://www.ncbi.nlm.nih.gov/account/ and pass `api_key=`.
- NCBI request that every call include `tool=` (your tool name) and `email=` (a contact address). They use this to throttle abusive clients instead of blocking IPs.
- `retmode=json` works for `esearch` and `esummary` but `efetch` falls back to XML for most databases. For PubMed full records use `rettype=abstract&retmode=text` or parse the default XML.
- `esearch` returns a `count` (total hits), `retmax` (returned this call) and `idlist` (UIDs). Pass those UIDs to `esummary` or `efetch` in a comma-separated `id=` parameter.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only (chains `esearch` + `esummary`)
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
