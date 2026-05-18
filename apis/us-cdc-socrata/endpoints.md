# CDC Open Data (Socrata) — Endpoints

Base URL: `https://data.cdc.gov`

Two endpoints do the work: one to browse the catalogue of datasets, one to query a specific dataset.

## `GET /api/views/metadata/v1`

Browse the dataset catalogue. Returns one record per dataset with id (four-by-four), name, description, category, owner, columns, and update timestamps.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `limit` | query | no | Page size (default 100, max 10,000) |
| `offset` | query | no | Pagination offset |

**Example**

```bash
curl 'https://data.cdc.gov/api/views/metadata/v1?limit=10'
```

Returns: a JSON array of dataset metadata objects.

---

## `GET /resource/{fourByFour}.json`

Query a specific dataset. Supports SoQL parameters for filtering, projection, aggregation, and ordering.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `fourByFour` | path | yes | Dataset ID, e.g. `pj7m-y5uh` |
| `$select` | query | no | Columns to return, comma-separated |
| `$where` | query | no | SQL-like predicate, e.g. `state='New York'` |
| `$group` | query | no | Group-by column(s) |
| `$order` | query | no | Sort column(s) with optional `ASC`/`DESC` |
| `$limit` | query | no | Page size (default 1,000, max 50,000) |
| `$offset` | query | no | Pagination offset |
| `$q` | query | no | Full-text search across all columns |

**Example**

```bash
curl 'https://data.cdc.gov/resource/pj7m-y5uh.json?$where=state=%27New%20York%27&$limit=5'
```

Returns: a JSON array of row objects. Numeric fields arrive as strings.

The dataset `pj7m-y5uh` is "Distribution of COVID-19 deaths and populations, by jurisdiction, age, and race and Hispanic origin". Replace it with any other four-by-four ID to query a different dataset.

See the full SoQL reference at https://dev.socrata.com/docs/queries/.
