# NHS Business Services Authority Open Data Portal (CKAN) — Endpoints

Base URL: `https://opendata.nhsbsa.net/api/3`

This is a standard CKAN action API: actions are POST-or-GET callable at `/action/<name>`. Every response is wrapped in `{ "help": ..., "success": bool, "result": <action-specific> }`.

## `GET /action/package_search`

Full-text search across all 600+ NHSBSA datasets.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `q` | query | no | Free-text query, e.g. `prescribing`. |
| `rows` | query | no | Number of results to return, default 10. |
| `start` | query | no | Pagination offset, default 0. |
| `fq` | query | no | Filter query, e.g. `fq=organization:community_prescribing_dispensing`. |

**Example**

```
curl 'https://opendata.nhsbsa.net/api/3/action/package_search?q=prescribing&rows=5'
```

Returns: `{ "result": { "count": <int>, "results": [<dataset>...] } }`.

---

## `GET /action/package_show`

Fetch the full metadata record for one dataset, including every monthly resource (`resources` array). Each resource has `id`, `name`, `format`, and a `url` you can download.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `id` | query | yes | Dataset slug, e.g. `english-prescribing-dataset-epd-with-snomed-code`. |

**Example**

```
curl 'https://opendata.nhsbsa.net/api/3/action/package_show?id=english-prescribing-dataset-epd-with-snomed-code'
```

Returns: `{ "result": { "name": "...", "notes": "...", "resources": [{ "id": "<uuid>", "name": "EPD_SNOMED_YYYYMM", "url": "...csv" }, ...] } }`.

---

## `GET /action/package_list`

Bare list of every dataset slug — useful for discovery without paging through `package_search`.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `limit` | query | no | Cap the list length. |
| `offset` | query | no | Pagination offset. |

**Example**

```
curl 'https://opendata.nhsbsa.net/api/3/action/package_list'
```

Returns: `{ "result": ["dataset-slug-1", "dataset-slug-2", ...] }`.

---

## `GET /action/datastore_search`

Query a specific resource's rows server-side (CKAN datastore). Useful in theory; in practice the EPD resources are too large for the datastore back-end and this endpoint returns HTTP 500 for them. Smaller resources may work. The recommended retrieval pattern is to use `package_show` to get the resource `url` and download the CSV directly.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `resource_id` | query | yes | The resource UUID from `package_show`. |
| `limit` | query | no | Default 100, max 32,000. |
| `q` | query | no | Free-text query across columns. |
| `filters` | query | no | JSON-encoded `{column: value}` exact-match filter. |

**Example**

```
curl 'https://opendata.nhsbsa.net/api/3/action/datastore_search?resource_id=<uuid>&limit=5'
```

Returns: `{ "result": { "fields": [...], "records": [...] } }` when the resource is small enough; otherwise `{ "success": false, "error": {...} }` with a 500 status.
