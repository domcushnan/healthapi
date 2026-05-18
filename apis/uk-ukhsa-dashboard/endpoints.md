# UKHSA Data Dashboard API — Endpoints

Base URL: `https://api.ukhsa-dashboard.data.gov.uk`

The API is shaped as a tree. Collection endpoints (lists) sit at trailing-slash URLs; detail endpoints (single items) sit at non-trailing-slash URLs. Follow the `link` field returned at each level rather than constructing the next URL by hand.

## `GET /themes/`

Top-level navigation: the three themes the dashboard publishes today (`climate_and_environment`, `immunisation`, `infectious_disease`).

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| (none) | | | Returns the three themes. |

**Example**

```
curl 'https://api.ukhsa-dashboard.data.gov.uk/themes/'
```

Returns: `[ { "name": "infectious_disease", "link": "https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease" }, ... ]`.

(Note: `/themes` without the trailing slash issues a 301 to `/themes/`.)

---

## `GET /themes/{theme}`

Detail for a single theme — lists the sub-themes available beneath it.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `theme` | path | yes | e.g. `infectious_disease`. |

**Example**

```
curl 'https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease'
```

Returns: `{ "name": "infectious_disease", "sub_themes": { "link": ".../sub_themes" } }`.

---

## `GET /themes/{theme}/sub_themes/{sub_theme}/topics/{topic}`

Detail for a topic — gives you the geography types and metrics available for that topic.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `theme` | path | yes | e.g. `infectious_disease`. |
| `sub_theme` | path | yes | e.g. `respiratory`. |
| `topic` | path | yes | e.g. `COVID-19`. |

**Example**

```
curl 'https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19'
```

Returns: `{ "name": "COVID-19", "geography_types": { "link": ".../geography_types" }, "metrics": { "link": ".../metrics" } }`.

---

## `GET /themes/{theme}/sub_themes/{sub_theme}/topics/{topic}/geography_types/{geog_type}/geographies/{geog}/metrics/{metric}`

The actual time-series endpoint. Each row is one observation with `date`, `metric_value`, and the demographic stratifiers.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `theme` | path | yes | e.g. `infectious_disease`. |
| `sub_theme` | path | yes | e.g. `respiratory`. |
| `topic` | path | yes | e.g. `COVID-19`. |
| `geography_type` | path | yes | e.g. `Nation`. |
| `geography` | path | yes | e.g. `England`. |
| `metric` | path | yes | e.g. `COVID-19_cases_casesByDay`. |
| `page` | query | no | Pagination. Use the `next` URL from the previous response. |

**Example**

```
curl 'https://api.ukhsa-dashboard.data.gov.uk/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19/geography_types/Nation/geographies/England/metrics/COVID-19_cases_casesByDay'
```

Returns: `{ "count": <int>, "next": "...?page=2", "previous": null, "results": [{ "date": "YYYY-MM-DD", "metric_value": <float>, "geography_code": "E92000001", "stratum": "default", "sex": "all", "age": "all", "in_reporting_delay_period": false, ... }, ...] }`.
