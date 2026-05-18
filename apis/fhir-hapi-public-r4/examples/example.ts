// HAPI FHIR Public Test Server (R4) — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://hapi.fhir.org/baseR4";

interface HumanName {
  family?: string;
  given?: string[];
}

interface Patient {
  resourceType: "Patient";
  id: string;
  name?: HumanName[];
  gender?: string;
  birthDate?: string;
}

interface BundleEntry {
  resource: Patient;
}

interface Bundle {
  resourceType: "Bundle";
  type: string;
  entry?: BundleEntry[];
}

async function fetchFhir<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  }
  const res = await fetch(url, { headers: { Accept: "application/fhir+json" } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return (await res.json()) as T;
}

function nameOf(patient: Patient): string {
  const n = patient.name?.[0];
  if (!n) return "(no name)";
  const given = (n.given ?? []).join(" ");
  const full = `${given} ${n.family ?? ""}`.trim();
  return full || "(no name)";
}

async function main() {
  const bundle = await fetchFhir<Bundle>("/Patient", { _count: "3" });
  const entries = bundle.entry ?? [];
  console.log(`FHIR Bundle type: ${bundle.type}`);
  console.log(`Patients returned: ${entries.length}\n`);
  for (const entry of entries) {
    const patient = entry.resource;
    console.log(`- Patient/${patient.id}`);
    console.log(`    name:       ${nameOf(patient)}`);
    console.log(`    gender:     ${patient.gender ?? "unknown"}`);
    console.log(`    birthDate:  ${patient.birthDate ?? "unknown"}`);
    console.log();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
