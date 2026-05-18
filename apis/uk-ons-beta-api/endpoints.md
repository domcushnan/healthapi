# Office for National Statistics Beta API — Endpoints

Base URL: `https://api.beta.ons.gov.uk/v1`

## `GET /datasets`

List all published ONS datasets. Pagination is via `limit` / `offset`. Filter client-side; there is no server-side topic filter on this endpoint.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `limit` | query | no | Page size, default 20. |
| `offset` | query | no | Page offset, default 0. |

**Example**

```bash
curl 'https://api.beta.ons.gov.uk/v1/datasets?limit=3'
```

Returns: `{ "items": [<dataset>...], "count": <int>, "total_count": <int>, "offset": <int>, "limit": <int> }`.

---

## `GET /datasets/{id}`

Metadata for a single dataset: contacts, description, taxonomy, latest version link, methodology references.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `id` | path | yes | Dataset slug, e.g. `weekly-deaths-region`, `suicides-in-the-uk`, `wellbeing-quarterly`. |

**Example**

```bash
curl 'https://api.beta.ons.gov.uk/v1/datasets/weekly-deaths-region'
```

Returns: `{ "id": "weekly-deaths-region", "title": "...", "links": { "editions": {...}, "latest_version": {...} }, ... }`.

---

## `GET /datasets/{id}/editions`

List the editions of a dataset (for example, a rolling `time-series` edition and capped `2010-19` / `covid-19` editions).

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `id` | path | yes | Dataset slug. |

**Example**

```bash
curl 'https://api.beta.ons.gov.uk/v1/datasets/weekly-deaths-region/editions'
```

Returns: `{ "items": [<edition>...], "count": <int>, "total_count": <int> }`.

---

## `GET /datasets/{id}/editions/{edition}/versions/{version}`

A specific version of a dataset edition. This is where you get the `dimensions` array (so you know what to query on the observations endpoint) and the `downloads` block with CSV, XLSX and CSV-W URLs.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `id` | path | yes | Dataset slug. |
| `edition` | path | yes | Edition slug, e.g. `time-series`. |
| `version` | path | yes | Version number (latest visible from `/datasets/{id}` → `links.latest_version.id`). |

**Example**

```bash
curl 'https://api.beta.ons.gov.uk/v1/datasets/weekly-deaths-region/editions/time-series/versions/116'
```

Returns: `{ "version": 116, "dimensions": [...], "downloads": { "csv": {...}, "xls": {...} }, ... }`.

---

## `GET /datasets/{id}/editions/{edition}/versions/{version}/observations`

Retrieve observation values for a version, filtered by dimension query parameters. Use `*` as a wildcard on any dimension.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `id` | path | yes | Dataset slug. |
| `edition` | path | yes | Edition slug. |
| `version` | path | yes | Version number. |
| `<dimension>` | query | yes | Filter on a dimension defined on the version (e.g. `time=2024`, `geography=K04000001`). Use `*` for all values on a dimension. |

**Example**

```bash
curl 'https://api.beta.ons.gov.uk/v1/datasets/weekly-deaths-region/editions/time-series/versions/116/observations?time=2025&geography=E92000001&week=week-52&causeofdeath=all-causes'
```

Returns: `{ "observations": [{ "observation": "<value>", "metadata": {...} }], "dimensions": {...}, "total_observations": <int>, ... }`. Dimension option codes must come from the relevant code list (e.g. `E92000001` for England in `administrative-geography`, `week-52` in `week-number`).
