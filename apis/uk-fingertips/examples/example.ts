// OHID Fingertips Public Health Data API — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://fingertips.phe.org.uk/api";

interface IndicatorMetadata {
  [id: string]: {
    Descriptive: { Name: string; DataSource: string };
    Unit: { Label: string };
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

async function fetchText(path: string, params?: Record<string, string>): Promise<string> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return await res.text();
}

function splitCsvLine(line: string): string[] {
  // Minimal RFC 4180 split: handles double-quoted fields containing commas.
  const out: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"' && line[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (c === '"') {
        inQuotes = false;
      } else {
        cell += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ",") {
      out.push(cell);
      cell = "";
    } else {
      cell += c;
    }
  }
  out.push(cell);
  return out;
}

function parseCsv(text: string): Array<Record<string, string>> {
  const lines = text.trim().split(/\r?\n/);
  const header = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row: Record<string, string> = {};
    header.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}

async function main() {
  const indicatorId = "92313"; // Percentage of people in employment

  // 1. Metadata.
  const meta = await fetchJson<IndicatorMetadata>("/indicator_metadata/by_indicator_id", {
    indicator_ids: indicatorId,
  });
  const m = meta[indicatorId];
  console.log(`Indicator ${indicatorId}: ${m.Descriptive.Name}`);
  console.log(`  Source: ${m.Descriptive.DataSource}`);
  console.log(`  Unit:   ${m.Unit.Label}`);
  console.log();

  // 2. Bulk CSV for England at England area-type.
  const csv = await fetchText("/all_data/csv/by_indicator_id", {
    indicator_ids: indicatorId,
    child_area_type_id: "15",
    parent_area_type_id: "15",
    parent_area_code: "E92000001",
  });
  const rows = parseCsv(csv);
  console.log(`Rows returned: ${rows.length.toLocaleString()}`);

  const persons = rows
    .filter((r) => r["Sex"] === "Persons")
    .sort((a, b) => Number(b["Time period Sortable"]) - Number(a["Time period Sortable"]));

  console.log("Latest three persons-all-ages rows:");
  for (const r of persons.slice(0, 3)) {
    console.log(
      `  ${r["Time period"].padStart(8)}  ${r["Value"].padStart(6)}  (CI ${r["Lower CI 95.0 limit"]}–${r["Upper CI 95.0 limit"]})`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
