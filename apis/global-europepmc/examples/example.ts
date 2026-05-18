// Europe PMC REST API — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://www.ebi.ac.uk/europepmc/webservices/rest";

interface Record_ {
  id: string;
  pmid?: string;
  doi?: string;
  title?: string;
  journalTitle?: string;
  pubYear?: string;
}

interface SearchResponse {
  hitCount: number;
  nextCursorMark?: string;
  resultList: { result: Record_[] };
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
    query: "asthma AND long covid",
    format: "json",
    resultType: "lite",
    pageSize: "3",
  });

  console.log(`Total hits: ${data.hitCount}`);
  console.log();
  for (const record of data.resultList.result) {
    const title = (record.title ?? "").replace(/\.$/, "");
    const pmid = record.pmid ?? record.id;
    console.log(`PMID ${pmid} (${record.pubYear ?? "n/a"}) — ${record.journalTitle ?? "n/a"}`);
    console.log(`  ${title}`);
    if (record.doi) console.log(`  https://doi.org/${record.doi}`);
    console.log();
  }

  if (data.nextCursorMark) {
    console.log(`Next cursor: ${data.nextCursorMark}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
