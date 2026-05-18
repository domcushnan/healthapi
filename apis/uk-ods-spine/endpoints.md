# NHS Organisation Data Service (ODS) ORD API — Endpoints

Base URL: `https://directory.spineservices.nhs.uk/ORD/2-0-0`

## `GET /organisations`

Search organisations by name, postcode, primary role, secondary role, or status. Returns a list with `OrgId`, summary fields and an `OrgLink` to the full record.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `Name` | query | no | Substring match against organisation name (case-insensitive). |
| `PostCode` | query | no | Postcode prefix. |
| `PrimaryRoleId` | query | no | Match on primary role, e.g. `RO197` for NHS Trust. |
| `NonPrimaryRoleId` | query | no | Match on any non-primary role, e.g. `RO318` for ICB. |
| `Status` | query | no | `Active` or `Inactive`. |
| `Limit` | query | no | Max results (default 1000, hard cap 1000). |
| `Offset` | query | no | Pagination offset. |

**Example**

```
curl 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations?NonPrimaryRoleId=RO318&Limit=3'
```

Returns: `{ "Organisations": [{ "Name": "...", "OrgId": "...", "Status": "Active", "PrimaryRoleId": "...", "PrimaryRoleDescription": "...", "OrgLink": "..." }, ...] }`.

---

## `GET /organisations/{OrgId}`

Full record for one organisation — name, address, contact details, roles, relationships (parent, successor, predecessor), operational dates and status.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `OrgId` | path | yes | The five-character ODS code, e.g. `RJ1` for Guy's and St Thomas', `RXR` for East Lancashire Hospitals NHS Trust. |

**Example**

```
curl 'https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/RJ1'
```

Returns: `{ "Organisation": { "Name": "...", "OrgId": {...}, "Status": "Active", "GeoLoc": {...}, "Contacts": {...}, "Roles": {...}, "Rels": {...}, "Succs": {...} } }`.

---

## `GET /roles`

Lookup table of every NHS organisation role code in ODS.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| (none) | | | Returns the full list. |

**Example**

```
curl 'https://directory.spineservices.nhs.uk/ORD/2-0-0/roles'
```

Returns: `{ "Roles": [{ "id": "RO197", "code": "197", "displayName": "NHS TRUST", "primaryRole": "true" }, ...] }`.

---

## `GET /sync`

Delta-change feed — returns the organisations whose records have changed since the given `LastChangeDate`. Use this to maintain a local mirror.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `LastChangeDate` | query | yes | ISO date, e.g. `2026-05-01`. Without this you get HTTP 406. |

**Example**

```
curl 'https://directory.spineservices.nhs.uk/ORD/2-0-0/sync?LastChangeDate=2026-05-01'
```

Returns: `{ "Organisations": [{ "OrgLink": "https://directory.spineservices.nhs.uk/ORD/2-0-0/organisations/<OrgId>" }, ...] }`. Fetch each `OrgLink` for the full record.
