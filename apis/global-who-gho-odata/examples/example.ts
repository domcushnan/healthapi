// WHO GHO OData API — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://ghoapi.azureedge.net/api";

interface Observation {
  TimeDim: number;
  SpatialDim: string;
  Dim1?: string;
  Value?: string;
  NumericValue?: number;
}

interface ODataResponse<T> {
  "@odata.context": string;
  value: T[];
}

async function fetchJson<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    // OData $-prefixed keys are accepted percent-encoded as %24 by the
    // GHO endpoint (verified 2026-05-18). URLSearchParams handles this.
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

async function main() {
  // Life expectancy at birth (WHOSIS_000001) for the United Kingdom,
  // both sexes (SEX_BTSX).
  const data = await fetchJson<ODataResponse<Observation>>("/WHOSIS_000001", {
    $filter: "SpatialDim eq 'GBR' and Dim1 eq 'SEX_BTSX'",
    $top: "5",
    $format: "json",
  });

  console.log("Life expectancy at birth, United Kingdom (both sexes)");
  console.log("-".repeat(60));
  const rows = [...data.value].sort((a, b) => a.TimeDim - b.TimeDim);
  for (const row of rows) {
    console.log(`  ${row.TimeDim}: ${row.Value ?? "n/a"}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
