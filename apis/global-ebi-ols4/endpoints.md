# EBI Ontology Lookup Service (OLS4) — Endpoints

Base URL: `https://www.ebi.ac.uk/ols4/api`

## `GET /ontologies`

Paginated list of all ontologies loaded into OLS4 (HPO, MONDO, EFO, GO, ChEBI, Uberon, etc.).

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `page` | query | no | Zero-indexed page number. |
| `size` | query | no | Page size (default 20). |

**Example**

```bash
curl 'https://www.ebi.ac.uk/ols4/api/ontologies?size=2'
```

Returns: `{ "_embedded": { "ontologies": [...] }, "_links": {...}, "page": {...} }`.

---

## `GET /ontologies/{id}`

Details for one ontology, including term count, version, configuration and homepage.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `id` | path | yes | Ontology ID, lower-case (e.g. `hp`, `mondo`, `efo`, `go`). |

**Example**

```bash
curl 'https://www.ebi.ac.uk/ols4/api/ontologies/hp'
```

Returns: a single ontology record with `numberOfTerms`, `config.title`, `config.preferredPrefix`, and metadata.

---

## `GET /search`

Search terms across all loaded ontologies. Filter by ontology, type, or field.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `q` | query | yes | Search query. |
| `ontology` | query | no | Restrict to one ontology (e.g. `hp`). |
| `type` | query | no | `class`, `property`, `individual`, `ontology`. |
| `rows` | query | no | Page size (default 10). |
| `start` | query | no | Result offset. |

**Example**

```bash
curl 'https://www.ebi.ac.uk/ols4/api/search?q=asthma&ontology=hp&rows=3'
```

Returns: a Solr-style envelope `{ "response": { "numFound": <int>, "docs": [...] } }`. Each doc has `iri`, `label`, `obo_id`, `ontology_name`, `description`.

---

## `GET /ontologies/{id}/terms/{double-encoded-iri}`

Fetch a single term from a specific ontology by its full IRI. The IRI must be URL-encoded twice in the path (the gateway decodes once, the application decodes again).

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `id` | path | yes | Ontology ID, e.g. `hp`. |
| `iri` | path | yes | The term's IRI, double-URL-encoded. For `http://purl.obolibrary.org/obo/HP_0002099`, the path segment is `http%253A%252F%252Fpurl.obolibrary.org%252Fobo%252FHP_0002099`. |

**Example**

```bash
curl 'https://www.ebi.ac.uk/ols4/api/ontologies/hp/terms/http%253A%252F%252Fpurl.obolibrary.org%252Fobo%252FHP_0002099'
```

Returns: a term object with `label`, `description`, `synonyms`, `obo_id`, `obo_xref` (cross-references to SNOMED, UMLS, etc.), and HAL `_links` to parents, children, ancestors.
