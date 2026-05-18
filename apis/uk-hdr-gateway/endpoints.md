# HDR UK Health Data Gateway API — Endpoints

Base URL: `https://api.healthdatagateway.org/api/v1`

## `GET /datasets`

Paginated list of dataset catalogue entries. Each entry carries the full metadata block wrapped under `latest_metadata.metadata.metadata`.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `perPage` | query | no | Page size (default 25). |
| `page` | query | no | Page number, 1-indexed. |
| `status` | query | no | Filter by status, e.g. `ACTIVE`. |
| `sort` | query | no | Sort directive, e.g. `updated:desc`. |

**Example**

```
curl 'https://api.healthdatagateway.org/api/v1/datasets?perPage=5&status=ACTIVE'
```

Returns: `{ "current_page": <int>, "data": [<dataset>...], "per_page": <int>, "total": <int>, "last_page": <int> }`.

---

## `GET /datasets/{id}`

Full record for one dataset.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `id` | path | yes | Numeric dataset ID, e.g. `1717`. |

**Example**

```
curl 'https://api.healthdatagateway.org/api/v1/datasets/1717'
```

Returns: `{ "message": "success", "data": { "id": 1717, "status": "ACTIVE", "latest_metadata": { "metadata": { "metadata": { "summary": {...}, "coverage": {...}, "provenance": {...}, "accessibility": {...}, "structuralMetadata": [...] } } } } }`.

---

## `GET /collections`

Curated thematic collections (e.g. Secure Data Environment networks, regional collections).

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `perPage` | query | no | Page size (default 25). |

**Example**

```
curl 'https://api.healthdatagateway.org/api/v1/collections?perPage=5'
```

Returns: `{ "current_page": <int>, "data": [<collection>...], "total": <int> }`.

---

## `GET /collections/{id}`

Detail for one collection — the datasets and teams it groups together.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `id` | path | yes | Numeric collection ID. |

**Example**

```
curl 'https://api.healthdatagateway.org/api/v1/collections/94'
```

Returns: `{ "data": { "id": 94, "name": "...", "datasets": [...], "tools": [...] } }`.
