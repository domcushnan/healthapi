# WHO GHO OData API — Endpoints

Base URL: `https://ghoapi.azureedge.net/api`

Standard OData query options apply on every collection: `$top`, `$skip`, `$select`, `$filter`, `$orderby`, `$format=json`.

## `GET /Indicator`

List every GHO indicator with its code and human-readable name. Use this to discover what indicators exist before querying their observations.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `$top` | query | no | Max records to return. The full list is ~2,000 entries. |
| `$skip` | query | no | Offset for paging. |
| `$filter` | query | no | OData filter, e.g. `contains(IndicatorName,'tobacco')`. |
| `$format` | query | no | `json`. The default returns JSON for this collection. |

**Example**

```bash
curl 'https://ghoapi.azureedge.net/api/Indicator?$top=3&$format=json'
```

Returns: `{ value: [ { IndicatorCode, IndicatorName, Language }, ... ] }`.

---

## `GET /{IndicatorCode}`

Fetch observations (data points) for a single indicator. Each row is one country–year–sex combination.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `IndicatorCode` | path | yes | Stable code, e.g. `WHOSIS_000001` (life expectancy at birth). Case-sensitive. |
| `$filter` | query | no | Filter by dimension, e.g. `SpatialDim eq 'GBR'` for the UK only. |
| `$top` | query | no | Cap on rows returned. |
| `$select` | query | no | Comma-separated field projection. |

**Example**

```bash
curl 'https://ghoapi.azureedge.net/api/WHOSIS_000001?$filter=SpatialDim%20eq%20%27GBR%27&$top=3&$format=json'
```

Returns: `{ value: [ { Id, IndicatorCode, SpatialDim, TimeDim, Dim1, NumericValue, Low, High, ... }, ... ] }`.

---

## `GET /DIMENSION/{DimensionCode}/DimensionValues`

Enumerate the allowed values of a dimension — useful for building drop-downs or validating filters.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `DimensionCode` | path | yes | `COUNTRY`, `REGION`, `SEX`, `YEAR`, `AGEGROUP`, etc. |
| `$top` | query | no | Cap on rows returned. |

**Example**

```bash
curl 'https://ghoapi.azureedge.net/api/DIMENSION/COUNTRY/DimensionValues?$top=3&$format=json'
```

Returns: `{ value: [ { Code, Title, Dimension, ParentDimension, ParentCode, ParentTitle }, ... ] }`.
