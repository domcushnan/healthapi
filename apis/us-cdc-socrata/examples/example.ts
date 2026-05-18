// CDC Open Data (Socrata) — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://data.cdc.gov";

// "Distribution of COVID-19 deaths and populations, by jurisdiction,
// age, and race and Hispanic origin" — a stable demo dataset.
const DATASET_ID = "pj7m-y5uh";

async function fetchJson<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

type Row = {
  state: string;
  indicator: string;
  non_hispanic_white?: string;
  hispanic_latino_total?: string;
};

async function main() {
  // Note: `group` is a SoQL reserved word, so we backtick-quote it in $where.
  const rows = await fetchJson<Row[]>(`/resource/${DATASET_ID}.json`, {
    $select: "state,indicator,non_hispanic_white,hispanic_latino_total",
    $where: "indicator='Count of COVID-19 deaths' AND `group`='By Total'",
    $order: "state",
    $limit: "5",
  });

  console.log(`Dataset ${DATASET_ID} — ${rows.length} rows:`);
  for (const r of rows) {
    const white = Number(r.non_hispanic_white ?? 0);
    const hispanic = Number(r.hispanic_latino_total ?? 0);
    const state = r.state.padEnd(25);
    console.log(
      `  ${state} white=${white.toLocaleString().padStart(7)}  hispanic=${hispanic.toLocaleString().padStart(7)}`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
