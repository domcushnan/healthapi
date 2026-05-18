// NCBI E-utilities — example using native fetch (Node 20+).
// Chains esearch -> esummary in one run.
// Run: npx tsx examples/example.ts

const BASE_URL = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

// NCBI ask every caller to identify themselves. Replace these in your own code.
const TOOL = "healthapi-repo";
const EMAIL = "[email protected]";

async function fetchJson<T>(path: string, params: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  for (const [k, v] of Object.entries({ ...params, tool: TOOL, email: EMAIL })) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

interface EsearchResponse {
  esearchresult: { count: string; idlist: string[] };
}

interface Author {
  name: string;
}

interface SummaryRecord {
  source?: string;
  pubdate?: string;
  title?: string;
  authors?: Author[];
}

interface EsummaryResponse {
  result: Record<string, SummaryRecord | string[]>;
}

async function main() {
  // Step 1: search PubMed for the three most recent records on asthma.
  const search = await fetchJson<EsearchResponse>("/esearch.fcgi", {
    db: "pubmed",
    term: "asthma",
    retmax: "3",
    retmode: "json",
  });
  const uids = search.esearchresult.idlist;
  console.log(`PubMed reports ${search.esearchresult.count} total hits for 'asthma'`);
  console.log(`First ${uids.length} UIDs: ${uids.join(", ")}`);
  console.log();

  // Be polite — anonymous limit is 3 req/sec.
  await new Promise((r) => setTimeout(r, 400));

  // Step 2: pull document summaries in a single call.
  const summary = await fetchJson<EsummaryResponse>("/esummary.fcgi", {
    db: "pubmed",
    id: uids.join(","),
    retmode: "json",
  });

  for (const uid of uids) {
    const record = summary.result[uid] as SummaryRecord;
    const allAuthors = record.authors ?? [];
    let authors = allAuthors.slice(0, 3).map((a) => a.name).join(", ");
    if (allAuthors.length > 3) authors += " et al.";
    console.log(`PMID ${uid} — ${record.source ?? "n/a"} (${record.pubdate ?? "n/a"})`);
    console.log(`  ${(record.title ?? "").replace(/\.$/, "")}`);
    console.log(`  ${authors}`);
    console.log();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
