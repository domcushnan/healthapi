# OHID Fingertips Public Health Data API — Endpoints

Base URL: `https://fingertips.phe.org.uk/api`

Fingertips is organised around three concepts: **area types** (England, region, ICB, GP, ward, etc.), **profiles and indicator groups** (Smoking, Cardiovascular, etc.), and **indicators** (numeric IDs like 92313). The endpoints below cover the four reliable JSON discovery calls plus the CSV bulk-data call that most analysts will actually use.

## `GET /area_types`

List every geographic area type Fingertips supports, with the numeric `Id` you pass to other endpoints.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| (none) | | | Returns the full list. |

**Example**

```
curl 'https://fingertips.phe.org.uk/api/area_types'
```

Returns: `[ { "Id": 15, "Name": "England", "Short": "England", ... }, ... ]`.

---

## `GET /profiles`

List every public-health profile (Smoking Profile, Cardiovascular Profile, Child and Maternal Health, etc.) with the indicator-group IDs that belong to each.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| (none) | | | Returns the full list. |

**Example**

```
curl 'https://fingertips.phe.org.uk/api/profiles'
```

Returns: `[ { "Id": 18, "Name": "Smoking Profile", "Key": "tobacco-control", "GroupIds": [...], "GroupMetadata": [...] }, ... ]`.

---

## `GET /indicator_metadata/by_indicator_id`

Metadata for one or more indicators — name, data source, unit, value type, year type, confidence-interval method, and most-recent upload timestamp.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `indicator_ids` | query | yes | Comma-separated indicator IDs, e.g. `92313` or `92313,93088`. |

**Example**

```
curl 'https://fingertips.phe.org.uk/api/indicator_metadata/by_indicator_id?indicator_ids=92313'
```

Returns: `{ "92313": { "Descriptive": { "Name": "...", "DataSource": "..." }, "Unit": { ... }, ... } }`.

---

## `GET /areas/by_area_type`

List every area of a given area type — e.g. all upper-tier local authorities, all ICBs, all GP practices.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `area_type_id` | query | yes | Numeric area-type ID from `/area_types`. |

**Example**

```
curl 'https://fingertips.phe.org.uk/api/areas/by_area_type?area_type_id=15'
```

Returns: `[ { "Name": "England", "Short": "England", "AreaTypeId": 15, "Code": "E92000001" } ]`.

---

## `GET /all_data/csv/by_indicator_id`

Bulk download of every value for an indicator at one area type, contained within a parent area. Returns `text/csv` with value, both confidence-interval bands, count, denominator, time period, recent-trend flag, and comparator labels.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `indicator_ids` | query | yes | Indicator ID, e.g. `92313`. |
| `child_area_type_id` | query | yes | The area-type IDs you want rows for. |
| `parent_area_type_id` | query | yes | The area-type ID that contains them. |
| `parent_area_code` | query | yes | The code of the parent area, e.g. `E92000001` for England. |

**Example**

```
curl 'https://fingertips.phe.org.uk/api/all_data/csv/by_indicator_id?indicator_ids=92313&child_area_type_id=15&parent_area_type_id=15&parent_area_code=E92000001'
```

Returns: CSV with one row per (area, time period, sex, age) combination. The example fetches the indicator 92313 (Percentage of people in employment) for England at England area-type.
