// data.gov.uk CKAN API — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://ckan.publishing.service.gov.uk/api/3";

interface CkanResponse<T> {
  success: boolean;
  result: T;
}

interface Package {
  name: string;
  title: string;
  license_title?: string;
  num_resources: number;
  organization: { title: string };
}

interface SearchResult {
  count: number;
  results: Package[];
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
  const data = await fetchJson<CkanResponse<SearchResult>>(
    "/action/package_search",
    { q: "health", rows: "2" },
  );
  const { count, results } = data.result;
  console.log(`Total matching datasets: ${count}`);
  console.log(`Showing ${results.length} of them:\n`);
  for (const pkg of results) {
    console.log(`- ${pkg.title}`);
    console.log(`    name:         ${pkg.name}`);
    console.log(`    publisher:    ${pkg.organization.title}`);
    console.log(`    licence:      ${pkg.license_title ?? "unspecified"}`);
    console.log(`    resources:    ${pkg.num_resources} file(s)`);
    console.log();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
