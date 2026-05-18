# openFDA — Endpoints

Base URL: `https://api.fda.gov`

openFDA exposes several "scopes" (drug, device, food, animal, tobacco). The three most useful for safety and labelling work are below.

## `GET /drug/label.json`

Structured Product Labeling (SPL) — indications, dosage, warnings, ingredients, and `openfda` cross-walk identifiers (RxCUI, NDC, UNII).

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `search` | query | no | Lucene query, e.g. `openfda.brand_name:"ADVIL"` |
| `limit` | query | no | 1–1000; default 1 |
| `skip` | query | no | Pagination offset; max 25,000 |
| `count` | query | no | Aggregate counts by a field, e.g. `count=openfda.manufacturer_name.exact` |

**Example**

```bash
curl 'https://api.fda.gov/drug/label.json?search=openfda.brand_name:%22ADVIL%22&limit=1'
```

Returns: `{ meta, results: [ { ...label sections, openfda: {...} } ] }`.

---

## `GET /drug/event.json`

FDA Adverse Event Reporting System (FAERS) — drug-related adverse-event reports submitted by clinicians, consumers, and manufacturers.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `search` | query | no | Lucene query, e.g. `patient.drug.medicinalproduct:"ibuprofen"` |
| `limit` | query | no | 1–1000; default 1 |
| `count` | query | no | Aggregate, e.g. `count=patient.reaction.reactionmeddrapt.exact` |

**Example**

```bash
curl 'https://api.fda.gov/drug/event.json?search=patient.drug.medicinalproduct:%22ibuprofen%22&limit=1'
```

Returns: `{ meta, results: [ { patient: { drug: [...], reaction: [...] }, ... } ] }`. Records are large; prefer `count=` for cohort-level analysis.

---

## `GET /food/enforcement.json`

Food recall enforcement reports — every classified food recall, with reason, distribution pattern, and recall classification (I, II, III).

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `search` | query | no | Lucene query, e.g. `classification:"Class I"` |
| `limit` | query | no | 1–1000; default 1 |

**Example**

```bash
curl 'https://api.fda.gov/food/enforcement.json?limit=1'
```

Returns: `{ meta, results: [ { recalling_firm, reason_for_recall, classification, ... } ] }`.

---

## `GET /device/event.json`

Medical device adverse-event reports from the MAUDE database.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `search` | query | no | Lucene query against device fields |
| `limit` | query | no | 1–1000; default 1 |

**Example**

```bash
curl 'https://api.fda.gov/device/event.json?limit=1'
```

Returns: `{ meta, results: [ { device: [...], event_type, mdr_text: [...], ... } ] }`.
