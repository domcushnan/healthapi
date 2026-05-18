# NHS Organisation Data Service (ODS) ORD API

> The canonical NHS reference data layer — every NHS trust, GP practice, pharmacy, ICB, commissioner and dentist as a stable code, name, address and set of operational dates.

| | |
|---|---|
| Provider | NHS England (Spine services, formerly NHS Digital) |
| Region | UK |
| Category | `uk-nhs` |
| Base URL | `https://directory.spineservices.nhs.uk/ORD/2-0-0` |
| Docs | https://digital.nhs.uk/services/organisation-data-service |
| Auth | None — public, no key required |
| Licence | Open Government Licence v3.0 (https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) |
| Rate limits | None documented |
| Last verified | 2026-05-18 |

## What it is

The Organisation Reference Data (ORD) API exposes every organisation registered in the NHS Organisation Data Service — every NHS trust, foundation trust, GP practice, pharmacy, dentist, optician, prescribing cost centre, ICB, sub-ICB location, commissioning hub, prison healthcare site, sexual assault referral centre, and several hundred more role categories. Each organisation has a stable code (the `OrgId`) like `RJ1` for Guy's and St Thomas', `RXR` for East Lancashire Hospitals NHS Trust, or `A81001` for The Densham Surgery.

For each organisation you get name, address, contact details, primary and secondary roles (with start and end dates), operational status, and the relationships that link it to other organisations (parent trust, commissioning ICB, predecessor organisation in a merger, etc.).

This is the canonical reference data layer that almost every other NHS dataset cross-references. NHSBSA prescribing rows (see [`uk-nhsbsa-opendata`](../uk-nhsbsa-opendata/)) carry `PRACTICE_CODE` and `ICB_CODE` values that resolve here. Fingertips indicators reported at GP-practice or ICB level (see [`uk-fingertips`](../uk-fingertips/)) use the same codes. The standard workflow for any multi-source NHS analysis is: resolve names ↔ codes through ODS, then pivot the data sources around that join key.

## Gotchas

- `PrimaryRoleId` and `NonPrimaryRoleId` behave differently. ICBs have `PrimaryRoleId=RO261` (labelled "STRATEGIC PARTNERSHIP" in `/roles`) and `NonPrimaryRoleId=RO318` ("INTEGRATED CARE BOARD"). The "ICB" label is on the secondary role, not the primary one — search with `NonPrimaryRoleId=RO318` to find every ICB.
- Useful role codes: `RO197` = NHS Trust, `RO57` = Foundation Trust, `RO76` = GP Practice, `RO177` = Prescribing Cost Centre (the code most NHSBSA prescribing data joins on), `RO182` = Pharmacy, `RO318` = Integrated Care Board (non-primary), `RO261` = Strategic Partnership (primary for ICBs). The full lookup is at `/roles`.
- The `/sync` endpoint requires a `LastChangeDate` query parameter; without it you get HTTP 406 ("Not Acceptable"), which is a parameter-validation error, not auth.
- `PostCode` is empty for many legacy records (closed organisations, abeyance entries). Defensive code should treat it as optional.
- This is the cross-reference table for every other NHS dataset in the catalogue. Use it to convert prescriber codes from NHSBSA, area codes from Fingertips, and provider codes from any NHS source into human-readable names.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

The captured sample at `examples/sample-response.json` is the record for East Lancashire Hospitals NHS Trust (`RXR`) with its relationship array trimmed.

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
