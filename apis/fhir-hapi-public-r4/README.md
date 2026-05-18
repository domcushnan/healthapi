# HAPI FHIR Public Test Server (R4)

> A free, world-writable FHIR R4 sandbox for learning the FHIR API shape. Synthetic and user-submitted data only — no real patient information.

| | |
|---|---|
| Provider | Smile Digital Health / HAPI FHIR project |
| Region | Global |
| Category | `fhir-sandbox` |
| Base URL | `https://hapi.fhir.org/baseR4` |
| Docs | https://hapifhir.io/hapi-fhir/docs/server_plain/test_server.html |
| Auth | None — public, no key required |
| Licence | Test server: data is synthetic / user-submitted. No real PHI. Apache-2.0 software; no formal data licence — treat as public test data. |
| Rate limits | Best-effort public sandbox; not for production load. Operator may rate-limit abusers. |
| Last verified | 2026-05-18 |

## What it is

This is a **sandbox**, not a data source. The HAPI FHIR project runs a public test server so that developers can learn the FHIR R4 REST API — search, read, create, update, delete — against a real server without setting one up. The server is open: anyone can POST. The Patient, Observation, and other resource tables contain a mix of test fixtures, tutorials, and whatever the wider community has submitted.

Use this when you want to understand what a FHIR Bundle looks like, how `_count` paging works, how search parameters interact, or how a `CapabilityStatement` describes a server's supported operations. The shape of every response here is exactly the shape you would expect from a real FHIR R4 server.

It is **not** useful as a data source — there are no real patients here, the data is junk, and anything you POST is visible to the world.

## Gotchas

- Data is public test data. Do not POST anything sensitive. Do not assume any record will still exist tomorrow.
- The default content type for some clients is XML. Send `Accept: application/fhir+json` (or `application/json`) for JSON.
- The server occasionally restarts and can be slow under load. If a single request hangs, retry with a longer timeout.

## Examples

Runnable copies live in [`examples/`](examples/):

- `examples/curl.sh` — shell, no dependencies
- `examples/example.py` — Python 3.11+, standard library only
- `examples/example.ts` — TypeScript, Node 20+ with native `fetch`

See [`endpoints.md`](endpoints.md) for a fuller list of endpoints.
