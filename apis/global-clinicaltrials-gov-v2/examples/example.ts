// ClinicalTrials.gov API v2 — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://clinicaltrials.gov/api/v2";

interface Study {
  protocolSection: {
    identificationModule: { nctId?: string; briefTitle?: string };
    statusModule?: { overallStatus?: string };
    sponsorCollaboratorsModule?: { leadSponsor?: { name?: string } };
  };
}

interface SearchResponse {
  studies: Study[];
  nextPageToken?: string;
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
  const data = await fetchJson<SearchResponse>("/studies", {
    "query.cond": "asthma",
    pageSize: "2",
    fields: "NCTId,BriefTitle,OverallStatus,Phase,LeadSponsorName",
  });

  for (const study of data.studies) {
    const ident = study.protocolSection.identificationModule;
    const status = study.protocolSection.statusModule;
    const sponsor = study.protocolSection.sponsorCollaboratorsModule?.leadSponsor;
    console.log(`${ident.nctId} — ${status?.overallStatus ?? "UNKNOWN"}`);
    console.log(`  ${ident.briefTitle}`);
    console.log(`  Sponsor: ${sponsor?.name ?? "n/a"}`);
    console.log();
  }

  if (data.nextPageToken) {
    console.log(`Next page token: ${data.nextPageToken.slice(0, 20)}...`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
