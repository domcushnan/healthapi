# HAPI FHIR Public Test Server (R4) — Endpoints

Base URL: `https://hapi.fhir.org/baseR4`

All endpoints follow standard FHIR R4 REST conventions. Send `Accept: application/fhir+json` for JSON.

## `GET /metadata`

CapabilityStatement — what the server supports (resource types, search params, interactions).

**Parameters**

None.

**Example**

```bash
curl -H 'Accept: application/fhir+json' 'https://hapi.fhir.org/baseR4/metadata'
```

Returns: a `CapabilityStatement` resource listing every resource type supported and the search params allowed on each.

---

## `GET /Patient`

Search Patient resources. Standard FHIR search parameters apply (`name`, `family`, `given`, `identifier`, `birthdate`, `gender`).

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `_count` | query | no | Page size. |
| `name` | query | no | Match against any name. |
| `family` | query | no | Match against family (surname). |
| `birthdate` | query | no | ISO date. Supports prefixes like `gt2000-01-01`. |
| `_pretty` | query | no | `true` for pretty-printed JSON. |

**Example**

```bash
curl -H 'Accept: application/fhir+json' 'https://hapi.fhir.org/baseR4/Patient?_count=2'
```

Returns: a `Bundle` with `type: searchset`. Each `entry[].resource` is a Patient. `link[]` includes `self` and `next` for paging.

---

## `GET /Patient/{id}`

Read a single Patient resource by its server-assigned ID.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `id` | path | yes | The numeric or token ID from the `id` field of a Patient resource. |

**Example**

```bash
curl -H 'Accept: application/fhir+json' 'https://hapi.fhir.org/baseR4/Patient/90286136'
```

Returns: a single `Patient` resource (or 404 if no such ID exists).

---

## `GET /Observation`

Search Observation resources (vitals, labs, etc.). Use the FHIR `code` search parameter with a LOINC token to filter by observation type.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `code` | query | no | Token, e.g. `http://loinc.org\|29463-7` (body weight). |
| `subject` | query | no | Reference, e.g. `Patient/90286136`. |
| `_count` | query | no | Page size. |

**Example**

```bash
curl -H 'Accept: application/fhir+json' 'https://hapi.fhir.org/baseR4/Observation?_count=2'
```

Returns: a `Bundle` of Observation resources.
