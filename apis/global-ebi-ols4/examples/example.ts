// EBI Ontology Lookup Service (OLS4) — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://www.ebi.ac.uk/ols4/api";

interface SearchDoc {
  iri: string;
  label: string;
  obo_id: string;
  ontology_name: string;
  description?: string[];
  exact_synonyms?: string[];
}

interface SearchResponse {
  response: {
    numFound: number;
    docs: SearchDoc[];
  };
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
  const data = await fetchJson<SearchResponse>("/search", {
    q: "asthma",
    ontology: "hp",
    rows: "5",
  });
  const { numFound, docs } = data.response;
  console.log(`HPO matches for 'asthma': ${numFound} total`);
  console.log(`Showing top ${docs.length}:\n`);
  for (const doc of docs) {
    console.log(`- ${doc.obo_id}  ${doc.label}`);
    const description = doc.description?.[0];
    if (description) {
      const text = description.length <= 120 ? description : `${description.slice(0, 117)}...`;
      console.log(`    ${text}`);
    }
    const synonyms = doc.exact_synonyms ?? [];
    if (synonyms.length) {
      console.log(`    synonyms: ${synonyms.slice(0, 3).join(", ")}`);
    }
    console.log();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
