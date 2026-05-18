# Contributing

Thanks for considering a contribution. The goal of this repo is to be the
clearest, most accurate index of public-domain health APIs available.

## Bar for inclusion

An API qualifies if **all** of the following are true:

1. **No authentication required.** No API key, no OAuth, no registration
   wall, no "free tier with signup". A reader must be able to copy the
   curl example and run it immediately.
2. **Clear licence.** The provider must publish terms that permit
   redistribution of sample responses for documentation purposes.
3. **Operationally stable.** The endpoint should have been available for
   at least 12 months and not be tagged as preview, beta, or deprecated
   on the provider's own documentation.
4. **Genuinely useful.** It should answer a real question someone in
   health, public health, clinical research, or health policy would ask.

## Folder layout

Every API folder follows the same shape. See an existing folder for the
exact template. The short version:

```
apis/<api-name>/
  README.md          What it is, who runs it, licence, rate limits, gotchas
  endpoints.md       Key endpoints with parameters and what they return
  examples/
    curl.sh          Copy-pasteable shell examples, one per endpoint
    example.py       Python 3.11+, standard library only
    example.ts       TypeScript using native fetch, Node 20+
    sample-response.json   Real captured response, trimmed to keep size sane
```

## Verifying an example

Before opening a PR, each example must actually run and return data:

```bash
# curl
bash apis/<api-name>/examples/curl.sh

# python
python3 apis/<api-name>/examples/example.py

# typescript
npx tsx apis/<api-name>/examples/example.ts
```

If the API has changed shape or gone offline, fix it or open an issue
rather than checking in a broken example.

## Adding to the catalogue table

When adding a new API, also add a row to the table in the top-level
[README.md](README.md). Keep the table alphabetical within each category.
