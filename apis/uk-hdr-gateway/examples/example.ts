// HDR UK Health Data Gateway API — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://api.healthdatagateway.org/api/v1";

interface Summary {
  title?: string;
  publisher?: { name?: string };
}

interface DatasetItem {
  id: number;
  status: string;
  latest_metadata?: { metadata?: { metadata?: { summary?: Summary } } };
}

interface DatasetsResponse {
  current_page: number;
  data: DatasetItem[];
  last_page: number;
  total: number;
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

function unwrapSummary(item: DatasetItem): Summary {
  return item.latest_metadata?.metadata?.metadata?.summary ?? {};
}

async function main() {
  const page = await fetchJson<DatasetsResponse>("/datasets", {
    perPage: "5",
    status: "ACTIVE",
  });
  console.log(`Total active datasets in the Gateway: ${page.total.toLocaleString()}`);
  console.log(`Pages: ${page.last_page}  |  Showing page ${page.current_page}`);
  console.log();
  console.log("First five ACTIVE datasets:");
  for (const item of page.data) {
    const summary = unwrapSummary(item);
    const title = (summary.title ?? "(untitled)").slice(0, 70);
    const publisher = summary.publisher?.name ?? "(unknown publisher)";
    console.log(`  [${item.id}]  ${title}`);
    console.log(`          publisher: ${publisher}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
