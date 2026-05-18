// RxNav (RxNorm) — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://rxnav.nlm.nih.gov/REST";

async function fetchJson<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

type IdGroup = { idGroup: { rxnormId?: string[] } };
type ConceptProps = {
  properties: { rxcui: string; name: string; tty: string };
};
type RelatedGroup = {
  relatedGroup: {
    conceptGroup: Array<{
      tty: string;
      conceptProperties?: Array<{ rxcui: string; name: string }>;
    }>;
  };
};

async function main() {
  // 1. Resolve a brand name to an RxCUI.
  const resolved = await fetchJson<IdGroup>("/rxcui.json", { name: "lipitor" });
  const rxcui = resolved.idGroup.rxnormId?.[0];
  if (!rxcui) {
    console.log("No RxCUI found for 'lipitor'.");
    return;
  }
  console.log(`'lipitor' -> RxCUI ${rxcui}`);

  // 2. Fetch concept properties.
  const props = (await fetchJson<ConceptProps>(`/rxcui/${rxcui}/properties.json`)).properties;
  console.log(`  name: ${props.name}`);
  console.log(`  tty:  ${props.tty}`);

  // 3. Walk to the active ingredient(s).
  const related = await fetchJson<RelatedGroup>(`/rxcui/${rxcui}/related.json`, { tty: "IN" });
  console.log("  ingredients:");
  for (const g of related.relatedGroup.conceptGroup) {
    for (const c of g.conceptProperties ?? []) {
      console.log(`    RxCUI ${c.rxcui}: ${c.name}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
