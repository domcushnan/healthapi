// NLM Clinical Tables Search Service — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://clinicaltables.nlm.nih.gov/api";

// Clinical Tables returns a positional array, not an object.
// Layout: [total_count, [codes], extra_or_null, [[display_fields], ...]]
type ClinicalTablesResponse = [number, string[], unknown, string[][]];

async function fetchJson<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

async function main() {
  const data = await fetchJson<ClinicalTablesResponse>("/icd10cm/v3/search", {
    sf: "code,name",
    terms: "asthma",
    maxList: "7",
  });
  const [total, codes, , display] = data;
  console.log(`ICD-10-CM matches for 'asthma': ${total} total`);
  console.log(`Showing top ${codes.length}:\n`);
  for (const [code, description] of display) {
    console.log(`  ${code}\t${description}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
