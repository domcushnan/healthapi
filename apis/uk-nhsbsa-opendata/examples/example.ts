// NHS Business Services Authority Open Data Portal (CKAN) — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://opendata.nhsbsa.net/api/3";

interface PackageSearchResponse {
  result: {
    count: number;
    results: Array<{ name: string; title: string }>;
  };
}

interface Resource {
  id: string;
  name: string;
  url: string;
  format: string;
}

interface PackageShowResponse {
  result: {
    title: string;
    license_title: string;
    resources: Resource[];
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
  // 1. Discover.
  const search = await fetchJson<PackageSearchResponse>("/action/package_search", {
    q: "english prescribing dataset",
    rows: "5",
  });
  console.log(`Datasets matching 'english prescribing dataset': ${search.result.count.toLocaleString()}`);
  for (const ds of search.result.results.slice(0, 3)) {
    console.log(`  ${ds.name.padEnd(55)}  ${ds.title}`);
  }
  console.log();

  // 2. Show the active EPD dataset's most recent CSV resources.
  const show = await fetchJson<PackageShowResponse>("/action/package_show", {
    id: "english-prescribing-dataset-epd-with-snomed-code",
  });
  const { title, license_title, resources } = show.result;
  console.log(`Dataset: ${title}`);
  console.log(`Licence: ${license_title}`);
  console.log(`Total monthly resources: ${resources.length}`);
  console.log("Most recent three resources:");
  for (const r of resources.slice(-3)) {
    console.log(`  ${r.name.padEnd(30)}  resource_id=${r.id}`);
  }
  console.log();
  console.log("Direct CSV URL for the most recent month:");
  console.log(`  ${resources[resources.length - 1].url}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
