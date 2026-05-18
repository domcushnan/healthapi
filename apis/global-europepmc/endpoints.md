# Europe PMC REST API — Endpoints

Base URL: `https://www.ebi.ac.uk/europepmc/webservices/rest`

## `GET /search`

Search biomedical literature across PubMed, PMC, preprints, patents, theses and clinical guidelines.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `query` | query | yes | Lucene-style query, e.g. `asthma AND (long covid)` or `AUTH:"smith" AND JOURNAL:"BMJ"`. |
| `format` | query | no | `json` or `xml`. Defaults to `xml`. Pass `json` for JSON. |
| `resultType` | query | no | `lite` (default, IDs and titles) or `core` (adds abstracts, MeSH terms, references metadata). |
| `pageSize` | query | no | Results per page, max 1000. Start at 25. |
| `cursorMark` | query | no | Cursor returned as `nextCursorMark`. Initial call: `*`. |
| `sort` | query | no | e.g. `P_PDATE_D desc` (publication date descending). |
| `synonym` | query | no | `true` to expand MeSH synonyms. |

**Example**

```bash
curl 'https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=asthma+AND+long+covid&format=json&pageSize=2&resultType=lite'
```

Returns: object with `hitCount`, `nextCursorMark` and `resultList.result[]` of records.

---

## `GET /article/{source}/{id}/fullTextXML`

Fetch full-text JATS XML for open-access articles.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `source` | path | yes | `PMC`, `MED` (PubMed), `PPR` (preprint), etc. |
| `id` | path | yes | Identifier in the chosen source (e.g. `PMC13063568`). |

**Example**

```bash
curl 'https://www.ebi.ac.uk/europepmc/webservices/rest/article/PMC/PMC13063568/fullTextXML'
```

Returns: JATS XML document. Only available for articles flagged `isOpenAccess=Y` and `inEPMC=Y`.

---

## `GET /{source}/{id}/references`

Retrieve cited references for an article.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `source` | path | yes | `MED`, `PMC`, `PPR`, etc. |
| `id` | path | yes | PubMed ID or other identifier. |
| `format` | query | no | `json` or `xml`. |
| `pageSize` | query | no | Default 25, max 1000. |
| `page` | query | no | 1-indexed page number. |

**Example**

```bash
curl 'https://www.ebi.ac.uk/europepmc/webservices/rest/MED/41776429/references?format=json&pageSize=5'
```

Returns: object with `hitCount` and `referenceList.reference[]`. Empty if `hasReferences=N` on the parent record.
