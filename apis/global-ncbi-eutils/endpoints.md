# NCBI E-utilities — Endpoints

Base URL: `https://eutils.ncbi.nlm.nih.gov/entrez/eutils`

All endpoints accept `tool=` and `email=` parameters for caller identification. Sending these is strongly encouraged.

## `GET /esearch.fcgi`

Search any Entrez database and return matching UIDs.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `db` | query | yes | Database: `pubmed`, `pmc`, `mesh`, `gene`, `clinvar`, etc. |
| `term` | query | yes | Entrez query syntax, e.g. `asthma[MeSH] AND review[ptyp]`. |
| `retmax` | query | no | UIDs to return, default 20, max 10000. |
| `retstart` | query | no | Offset for paging. |
| `retmode` | query | no | `json` or `xml`. Defaults to `xml`. |
| `sort` | query | no | e.g. `pub_date`, `relevance`. |
| `tool` | query | no | Your tool name (recommended). |
| `email` | query | no | Contact address (recommended). |

**Example**

```bash
curl 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=asthma&retmax=3&retmode=json&tool=healthapi-repo&email=example%40example.org'
```

Returns: object with `esearchresult.count`, `esearchresult.idlist[]` and a `querytranslation` showing how the term was expanded.

---

## `GET /esummary.fcgi`

Fetch document summaries (title, authors, journal, DOI) for one or more UIDs.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `db` | query | yes | Database matching the UIDs. |
| `id` | query | yes | Comma-separated UIDs, e.g. `42149595,42149274`. |
| `retmode` | query | no | `json` or `xml`. |
| `tool` | query | no | Your tool name. |
| `email` | query | no | Contact address. |

**Example**

```bash
curl 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=42149595&retmode=json&tool=healthapi-repo&email=example%40example.org'
```

Returns: object with `result.uids[]` and one key per UID containing the summary.

---

## `GET /efetch.fcgi`

Fetch full records (abstracts, MEDLINE XML, sequences) for one or more UIDs.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `db` | query | yes | Database. |
| `id` | query | yes | Comma-separated UIDs. |
| `rettype` | query | no | e.g. `abstract`, `medline`, `fasta`. |
| `retmode` | query | no | `text`, `xml`, `asn.1`. JSON not supported for most databases. |
| `tool` | query | no | Your tool name. |
| `email` | query | no | Contact address. |

**Example**

```bash
curl 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=42149595&rettype=abstract&retmode=text&tool=healthapi-repo&email=example%40example.org'
```

Returns: plain-text abstract block (or XML if `retmode=xml`).
