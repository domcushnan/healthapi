# NLM Clinical Tables Search Service — Endpoints

Base URL: `https://clinicaltables.nlm.nih.gov/api`

Every code system follows the same `{system}/v3/search` shape. The three covered here are representative; the same pattern works for `icd10pcs`, `icd9cm_dx`, `conditions`, `procedures`, `npi_idv`, and the others listed at https://clinicaltables.nlm.nih.gov/.

All responses share the same positional structure:

```bash
[ total_count, [codes...], extra_data_or_null, [[display_field_values...], ...] ]
```

## `GET /icd10cm/v3/search`

Type-ahead search for ICD-10-CM diagnosis codes.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `terms` | query | yes | Substring to match against code and description. |
| `sf` | query | no | Comma-separated list of fields to search (e.g. `code,name`). |
| `df` | query | no | Comma-separated list of fields to return in the display array. |
| `maxList` | query | no | Maximum results to return (default 7). |

**Example**

```bash
curl 'https://clinicaltables.nlm.nih.gov/api/icd10cm/v3/search?sf=code,name&terms=asthma'
```

Returns: `[total, [codes], null, [[code, description], ...]]`.

---

## `GET /loinc_items/v3/search`

Type-ahead search for LOINC laboratory and clinical observation codes.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `terms` | query | yes | Substring to match. |
| `df` | query | no | Display fields (e.g. `LOINC_NUM,LONG_COMMON_NAME`). |
| `maxList` | query | no | Maximum results (default 7). |

**Example**

```bash
curl 'https://clinicaltables.nlm.nih.gov/api/loinc_items/v3/search?terms=haemoglobin&df=LOINC_NUM,LONG_COMMON_NAME'
```

Returns: `[total, [codes], null, [[loinc_num, long_common_name], ...]]`.

---

## `GET /rxterms/v3/search`

Type-ahead search for RxTerms — consumer-friendly drug names with strength and form. Backed by RxNorm.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `terms` | query | yes | Substring to match. |
| `ef` | query | no | Extra fields to include (e.g. `STRENGTHS_AND_FORMS`). |
| `maxList` | query | no | Maximum results (default 7). |

**Example**

```bash
curl 'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms=ibuprofen'
```

Returns: `[total, [display_names], extra_or_null, [[display_name], ...]]`.
