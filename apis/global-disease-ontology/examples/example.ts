// Disease Ontology (DO) API — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://api.disease-ontology.org/v1";

interface Synonym {
  pred: string;
  val: string;
}

interface Term {
  id: string;
  name: string;
  definition: string;
  parents: string[];
  children: string[];
  synonyms: Synonym[];
  xrefs: string[];
}

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
  const term = await fetchJson<Term>(`/terms/${encodeURIComponent("DOID:14330")}`);
  console.log(`${term.id}  ${term.name}\n`);
  console.log(`Definition:\n  ${term.definition}\n`);
  console.log("Parent DOIDs:");
  for (const parentId of term.parents ?? []) console.log(`  ${parentId}`);
  console.log("\nCross-references (first 10):");
  for (const xref of (term.xrefs ?? []).slice(0, 10)) console.log(`  ${xref}`);
  console.log("\nSynonyms:");
  for (const synonym of (term.synonyms ?? []).slice(0, 5)) {
    console.log(`  ${synonym.pred}\t${synonym.val}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
