# data.gov.uk CKAN API (health subset) — Endpoints

Base URL: `https://ckan.publishing.service.gov.uk/api/3`

## `GET /action/package_search`

Full-text search across the data.gov.uk dataset index. Filter to health with `q=health` or `fq=topic:health`.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `q` | query | no | Free-text query string. |
| `fq` | query | no | Filter query, e.g. `fq=organization:nhs-digital`. |
| `rows` | query | no | Page size (default 10, max 1000). Use small values — single packages can be tens of KB. |
| `start` | query | no | Result offset for pagination. |

**Example**

```bash
curl 'https://ckan.publishing.service.gov.uk/api/3/action/package_search?q=health&rows=2'
```

Returns: `{ "success": true, "result": { "count": <int>, "results": [<package>...] } }`.

---

## `GET /action/package_show`

Fetch a single dataset package by name or id, including its `resources` array of downloadable files.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `id` | query | yes | Either the human-readable `name` (e.g. `health`) or the UUID `id` from a search result. |

**Example**

```bash
curl 'https://ckan.publishing.service.gov.uk/api/3/action/package_show?id=health'
```

Returns: `{ "success": true, "result": <package with resources[]> }`. Each resource has a `url`, `format` and `description`.

---

## `GET /action/organization_show`

Show an organisation record and (optionally) its datasets. Useful for listing everything published by NHS Digital, Department of Health and Social Care, Public Health Scotland, etc.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `id` | query | yes | Organisation slug, e.g. `nhs-digital`, `department-of-health`. |
| `include_datasets` | query | no | Set `true` to embed the organisation's datasets in the response (large). |

**Example**

```bash
curl 'https://ckan.publishing.service.gov.uk/api/3/action/organization_show?id=nhs-digital'
```

Returns: `{ "success": true, "result": { "name": "nhs-digital", "package_count": <int>, ... } }`.

---

## `GET /action/organization_list`

List all publishing organisations on the portal. Handy for discovering the exact slug to pass to `organization_show`.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `all_fields` | query | no | Set `true` to return full organisation records instead of just slugs. |
| `limit` | query | no | Cap the result size. |

**Example**

```bash
curl 'https://ckan.publishing.service.gov.uk/api/3/action/organization_list?limit=5'
```

Returns: `{ "success": true, "result": ["nhs-digital", "department-of-health", ...] }`.
