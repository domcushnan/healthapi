// UKHSA Data Dashboard API — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://api.ukhsa-dashboard.data.gov.uk";

interface Theme {
  name: string;
  link: string;
}

interface CaseRow {
  date: string;
  metric_value: number;
  in_reporting_delay_period: boolean;
}

interface MetricResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CaseRow[];
}

async function fetchJson<T>(path: string): Promise<T> {
  // Node fetch follows the 301 from /themes to /themes/ by default.
  const res = await fetch(`${BASE_URL}${path}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

async function main() {
  // 1. Top-level themes.
  const themes = await fetchJson<Theme[]>("/themes");
  console.log("Themes:");
  for (const t of themes) console.log(`  ${t.name}`);
  console.log();

  // 2. Daily COVID-19 cases for England, first page.
  const path =
    "/themes/infectious_disease/sub_themes/respiratory/topics/COVID-19" +
    "/geography_types/Nation/geographies/England" +
    "/metrics/COVID-19_cases_casesByDay";
  const page = await fetchJson<MetricResponse>(path);
  console.log(
    `Daily COVID-19 case counts for England — ${page.count.toLocaleString()} total observations`,
  );
  console.log(`First page contains ${page.results.length} rows.`);
  console.log("Earliest five observations on this page:");
  for (const r of page.results.slice(0, 5)) {
    console.log(
      `  ${r.date}  cases=${r.metric_value.toFixed(1).padStart(8)}  delay=${r.in_reporting_delay_period}`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
