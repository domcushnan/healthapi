# RxNav (RxNorm) — Endpoints

Base URL: `https://rxnav.nlm.nih.gov/REST`

All examples request JSON explicitly. The host returns XML by default for several paths — append `.json` to the resource and send `Accept: application/json`.

## `GET /drugs.json`

Look up RxNorm concepts for a drug name. Returns concepts grouped by term type (TTY): brand-name pack (BPCK), semantic branded drug (SBD), semantic clinical drug (SCD), ingredient (IN), etc.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `name` | query | yes | Drug name, brand or generic |

**Example**

```bash
curl -H 'Accept: application/json' 'https://rxnav.nlm.nih.gov/REST/drugs.json?name=lipitor'
```

Returns: `{ drugGroup: { conceptGroup: [ { tty, conceptProperties: [...] }, ... ] } }`.

---

## `GET /rxcui.json`

Resolve a drug name to one or more RxCUIs (the canonical concept IDs).

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `name` | query | yes | Drug name |
| `search` | query | no | `0` (exact), `1` (normalised), `2` (best match) |

**Example**

```bash
curl -H 'Accept: application/json' 'https://rxnav.nlm.nih.gov/REST/rxcui.json?name=lipitor'
```

Returns: `{ idGroup: { rxnormId: ["153165", ...] } }`.

---

## `GET /rxcui/{rxcui}/properties.json`

Fetch the canonical properties of a single RxNorm concept.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `rxcui` | path | yes | RxNorm Concept Unique Identifier |

**Example**

```bash
curl -H 'Accept: application/json' 'https://rxnav.nlm.nih.gov/REST/rxcui/207106/properties.json'
```

Returns: `{ properties: { rxcui, name, synonym, tty, language, suppress, umlscui } }`.

---

## `GET /rxcui/{rxcui}/related.json`

Walk the concept graph from an RxCUI to related concepts of a chosen term type. Useful for fanning out from a brand to its ingredient, or from an ingredient to all dose forms.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `rxcui` | path | yes | RxNorm Concept Unique Identifier |
| `tty` | query | yes | Term type to expand into (e.g. `IN`, `BN`, `SCD`, `SBD`) |

**Example**

```bash
curl -H 'Accept: application/json' 'https://rxnav.nlm.nih.gov/REST/rxcui/207106/related.json?tty=IN'
```

Returns: `{ relatedGroup: { conceptGroup: [ { tty: "IN", conceptProperties: [...] } ] } }`.

---

## `GET /approximateTerm.json`

Fuzzy search across RxNorm concepts and ancillary vocabularies. Use when the input is misspelled or non-canonical.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `term` | query | yes | Free-text search term |
| `maxEntries` | query | no | Default 4 |

**Example**

```bash
curl -H 'Accept: application/json' 'https://rxnav.nlm.nih.gov/REST/approximateTerm.json?term=zocor&maxEntries=3'
```

Returns: `{ approximateGroup: { candidate: [ { rxcui, rxaui, score, rank, name, source }, ... ] } }`.

---

## `GET /ndcstatus.json`

Check whether an NDC (National Drug Code) is currently active and map it to its associated RxCUI.

**Parameters**

| Name | In | Required | Notes |
|------|----|----------|-------|
| `ndc` | query | yes | NDC in 10- or 11-digit form |

**Example**

```bash
curl -H 'Accept: application/json' 'https://rxnav.nlm.nih.gov/REST/ndcstatus.json?ndc=0093-7146-56'
```

Returns: `{ ndcStatus: { ndc11, status, active, rxcui, conceptName, ndcHistory: [...] } }`.
