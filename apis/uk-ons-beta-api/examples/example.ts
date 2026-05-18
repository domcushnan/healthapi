// Office for National Statistics Beta API — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://api.beta.ons.gov.uk/v1";

interface DimensionOption {
  option: { id: string; href: string };
}

interface ObservationsResponse {
  dimensions: Record<string, DimensionOption>;
  observations: Array<{ observation: string; metadata: Record<string, string> }>;
  total_observations: number;
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
  // Fetch one observation: deaths registered in England in week 52 of 2025, all causes.
  const data = await fetchJson<ObservationsResponse>(
    "/datasets/weekly-deaths-region/editions/time-series/versions/116/observations",
    {
      time: "2025",
      geography: "E92000001",
      week: "week-52",
      causeofdeath: "all-causes",
    },
  );
  const obs = data.observations[0];
  const dims = data.dimensions;
  console.log(`Geography:      ${dims.geography.option.id}`);
  console.log(`Time:           ${dims.time.option.id}`);
  console.log(`Week:           ${dims.week.option.id}`);
  console.log(`Cause of death: ${dims.causeofdeath.option.id}`);
  console.log(`Observation:    ${obs.observation} deaths`);
  console.log(`Total rows:     ${data.total_observations}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
