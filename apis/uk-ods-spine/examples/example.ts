// NHS Organisation Data Service (ODS) ORD API — example using native fetch (Node 20+).
// Run: npx tsx examples/example.ts

const BASE_URL = "https://directory.spineservices.nhs.uk/ORD/2-0-0";

interface Organisation {
  Name: string;
  Status: string;
  OrgId: { extension: string };
  GeoLoc: {
    Location: { AddrLn1?: string; Town?: string; PostCode?: string };
  };
  Roles: { Role: Array<{ id: string; primaryRole?: boolean }> };
}

interface SearchHit {
  Name: string;
  OrgId: string;
  Status: string;
  PrimaryRoleDescription: string;
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
  // 1. Resolve one ODS code.
  const detail = await fetchJson<{ Organisation: Organisation }>("/organisations/RXR");
  const org = detail.Organisation;
  const loc = org.GeoLoc.Location;
  console.log(`OrgId:   ${org.OrgId.extension}`);
  console.log(`Name:    ${org.Name}`);
  console.log(`Status:  ${org.Status}`);
  console.log(`Address: ${loc.AddrLn1 ?? ""}, ${loc.Town ?? ""}, ${loc.PostCode ?? ""}`);
  const primary = org.Roles.Role.find((r) => r.primaryRole);
  if (primary) console.log(`Primary role: ${primary.id}`);
  console.log();

  // 2. List three ICBs.
  const icbs = await fetchJson<{ Organisations: SearchHit[] }>("/organisations", {
    NonPrimaryRoleId: "RO318",
    Limit: "3",
  });
  console.log("Three ICBs (NonPrimaryRoleId=RO318):");
  for (const entry of icbs.Organisations) {
    console.log(`  ${entry.OrgId}  ${entry.Name}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
