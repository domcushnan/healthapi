# healthapi

A curated catalogue of **public, no-authentication health and healthcare APIs**.

Every API listed here is genuinely public domain — no API key, no registration,
no rate-limit-after-signup walls. Each folder contains a short description,
key endpoints, licence and rate-limit notes, and runnable examples in **curl**,
**Python**, and **TypeScript**.

> Population in progress. The table below will be filled in as each API folder lands.

## Catalogue

| API | Provider | Region | Category | Folder |
|-----|----------|--------|----------|--------|

## How this repo is organised

```
apis/
  <api-name>/
    README.md          # what it is, who runs it, licence, rate limits
    endpoints.md       # key endpoints with parameters
    examples/
      curl.sh          # copy-pasteable shell examples
      example.py       # Python (stdlib only, no extra installs)
      example.ts       # TypeScript (uses native fetch, Node 20+)
      sample-response.json   # captured real response (trimmed)
```

## Contributing

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). The bar for
inclusion is strict: the API must be reachable without authentication, have
a clear licence permitting redistribution of example responses, and be
operationally stable.

## Licence

This catalogue is published under the [MIT licence](LICENSE). Each upstream
API retains its own terms — see the per-API folder for details.
