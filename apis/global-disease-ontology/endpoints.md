# Disease Ontology (DO) API — Endpoints

Base URL: `https://api.disease-ontology.org/v1`

## `GET /info`

Service metadata: API version, data release date, licence.

**Parameters**

None.

**Example**

```bash
curl 'https://api.disease-ontology.org/v1/info'
```

Returns: `{ "api": {...}, "data": { "version": "...", "release_url": "...", "license": "..." } }`.

---

## `GET /terms/{termId}`

Fetch a single disease term by its Disease Ontology ID (e.g. `DOID:14330`).

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `termId` | path | yes | A DOID, including the prefix — `DOID:14330` for Parkinson's disease. |

**Example**

```bash
curl 'https://api.disease-ontology.org/v1/terms/DOID:14330'
```

Returns: a term object with `id`, `name`, `definition`, `parents`, `children`, `synonyms`, `xrefs`, plus `imports` (related anatomy, evidence, symptoms, transmission).

---

## `GET /terms/label/{label}`

Look up a disease term by its human-readable label (case-insensitive). Returns the same shape as `/terms/{termId}`.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `label` | path | yes | Exact label, e.g. `asthma`. URL-encode any spaces. |

**Example**

```bash
curl 'https://api.disease-ontology.org/v1/terms/label/asthma'
```

Returns: the disease term object, including its `id` (e.g. `DOID:2841`) for use with `/terms/{termId}`.

---

## `GET /prefixes`

List the cross-reference prefixes that DO supports (ICD10CM, MESH, OMIM, SNOMEDCT_US, UMLS_CUI, etc.).

**Parameters**

None.

**Example**

```bash
curl 'https://api.disease-ontology.org/v1/prefixes'
```

Returns: a list of prefix records with their canonical URL pattern.
