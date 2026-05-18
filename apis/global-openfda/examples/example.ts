// openFDA — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://api.fda.gov";

async function fetchJson<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

type EventTotal = { meta: { results: { total: number } } };
type Aggregation = { results: Array<{ term: string; count: number }> };

async function main() {
  const search = 'patient.drug.medicinalproduct:"ibuprofen"';

  // Total matching reports — plain search includes meta.results.total.
  const total = await fetchJson<EventTotal>("/drug/event.json", {
    search,
    limit: "1",
  });
  console.log(
    `Total ibuprofen adverse-event reports: ${total.meta.results.total.toLocaleString()}`,
  );

  // Top 10 reactions — aggregation responses do not include meta.results.total.
  const agg = await fetchJson<Aggregation>("/drug/event.json", {
    search,
    count: "patient.reaction.reactionmeddrapt.exact",
    limit: "10",
  });
  console.log("Top 10 reactions:");
  for (const row of agg.results) {
    console.log(`  ${row.count.toLocaleString().padStart(7)}  ${row.term}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
