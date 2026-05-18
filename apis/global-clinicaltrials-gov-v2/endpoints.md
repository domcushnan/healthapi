# ClinicalTrials.gov API v2 — Endpoints

Base URL: `https://clinicaltrials.gov/api/v2`

## `GET /studies`

Search studies by condition, intervention, location, status or free-text term. Returns paginated study records.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `query.cond` | query | no | Condition or disease (e.g. `asthma`). |
| `query.intr` | query | no | Intervention or treatment. |
| `query.term` | query | no | Free-text search across all fields. |
| `query.locn` | query | no | Location text (city, country). |
| `filter.overallStatus` | query | no | Comma-separated list, e.g. `RECRUITING,COMPLETED`. |
| `fields` | query | no | Comma-separated list of fields to return; reduces payload size. |
| `pageSize` | query | no | Results per page, max 1000. Default 10. |
| `pageToken` | query | no | Cursor returned as `nextPageToken` from the previous response. |
| `countTotal` | query | no | `true` to include `totalCount` in the response. |

**Example**

```bash
curl 'https://clinicaltrials.gov/api/v2/studies?query.cond=asthma&pageSize=2&fields=NCTId,BriefTitle,OverallStatus'
```

Returns: object with a `studies` array (each entry is a study's `protocolSection`) and a `nextPageToken` for paging.

---

## `GET /studies/{nctId}`

Fetch a single study by its NCT identifier with the full protocol, status timeline and (where posted) results modules.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `nctId` | path | yes | Study identifier, e.g. `NCT01168635`. |
| `fields` | query | no | Comma-separated list of fields to return. |
| `format` | query | no | `json` (default) or `csv`. |

**Example**

```bash
curl 'https://clinicaltrials.gov/api/v2/studies/NCT01168635?fields=NCTId,BriefTitle,OverallStatus,Phase,StartDate,CompletionDate'
```

Returns: a single study object with the requested modules.

---

## `GET /stats/size`

Aggregate counts and study-size statistics across the database, including totals by date posted.

**Parameters**

None required.

**Example**

```bash
curl 'https://clinicaltrials.gov/api/v2/stats/size'
```

Returns: object with `totalStudies`, average study record size and a breakdown of study sizes.
