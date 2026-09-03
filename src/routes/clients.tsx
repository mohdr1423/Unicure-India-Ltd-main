import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Building2 } from "lucide-react";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import { SafeImage } from "@/components/site/SafeImage";

export interface InstitutionalClient {
  name: string;
  fullName: string;
  logo: string;
}

// 25 Official Institutional Clients & Partners across India
const institutionalClients: InstitutionalClient[] = [
  {
    name: "AIIMS",
    fullName: "All India Institute of Medical Sciences (AIIMS)",
    logo: "/images/institutions/aiims.svg",
  },
  {
    name: "BPPI",
    fullName: "Bureau of Pharma PSUs of India / PMBI (BPPI)",
    logo: "/images/institutions/bppi.svg",
  },
  {
    name: "Safdarjung Hospital",
    fullName: "Vardhman Mahavir Medical College & Safdarjung Hospital Delhi",
    logo: "/images/institutions/safdarjung.svg",
  },
  {
    name: "Defence Supply",
    fullName: "Armed Forces Medical Services & Ministry of Defence Supply",
    logo: "/images/institutions/defence-supply.svg",
  },
  {
    name: "UPMSCL — Uttar Pradesh",
    fullName: "Uttar Pradesh Medical Supplies Corporation Limited (UPMSCL)",
    logo: "/images/institutions/upmscl.svg",
  },
  {
    name: "JKMSCL — J&K",
    fullName: "Jammu & Kashmir Medical Supplies Corporation Limited (JKMSCL)",
    logo: "/images/institutions/jkmscl.svg",
  },
  {
    name: "APMSIDC — Andhra Pradesh",
    fullName: "Andhra Pradesh Medical Services & Infrastructure Development Corporation (APMSIDC)",
    logo: "/images/institutions/apmsidc.svg",
  },
  {
    name: "BMSICL — Bihar",
    fullName: "Bihar Medical Services and Infrastructure Corporation Limited (BMSICL)",
    logo: "/images/institutions/bmsicl.svg",
  },
  {
    name: "CGMSCL — Chhattisgarh",
    fullName: "Chhattisgarh Medical Services Corporation Limited (CGMSCL)",
    logo: "/images/institutions/cgmscl.svg",
  },
  {
    name: "CPA (DHS Delhi, NCT Delhi)",
    fullName: "Central Procurement Agency, Directorate General of Health Services Delhi",
    logo: "/images/institutions/cpa-delhi.svg",
  },
  {
    name: "MCD Delhi",
    fullName: "Municipal Corporation of Delhi (MCD)",
    logo: "/images/institutions/mcd-delhi.svg",
  },
  {
    name: "GMSCL — Gujarat",
    fullName: "Gujarat Medical Services Corporation Limited (GMSCL)",
    logo: "/images/institutions/gmscl.svg",
  },
  {
    name: "HBCL — Maharashtra",
    fullName: "Haffkine Bio-Pharmaceutical Corporation Limited (HBCL Maharashtra)",
    logo: "/images/institutions/hbcl.svg",
  },
  {
    name: "HPSCSCL — Himachal Pradesh",
    fullName: "Himachal Pradesh State Civil Supplies Corporation Limited (HPSCSCL)",
    logo: "/images/institutions/hpscscl.svg",
  },
  {
    name: "KMSCL — Kerala",
    fullName: "Kerala Medical Services Corporation Limited (KMSCL)",
    logo: "/images/institutions/kmscl.svg",
  },
  {
    name: "KSMSCL — Karnataka",
    fullName: "Karnataka State Medical Supplies Corporation Limited (KSMSCL)",
    logo: "/images/institutions/ksmscl.svg",
  },
  {
    name: "MPPHSCL — Madhya Pradesh",
    fullName: "Madhya Pradesh Public Health Services Corporation Limited (MPPHSCL)",
    logo: "/images/institutions/mpphscl.svg",
  },
  {
    name: "OSMCL — Orissa",
    fullName: "Odisha State Medical Corporation Limited (OSMCL)",
    logo: "/images/institutions/osmcl.svg",
  },
  {
    name: "PHSC — Punjab",
    fullName: "Punjab Health Systems Corporation (PHSC)",
    logo: "/images/institutions/phsc.svg",
  },
  {
    name: "RMSCL — Rajasthan",
    fullName: "Rajasthan Medical Services Corporation Limited (RMSCL)",
    logo: "/images/institutions/rmscl.svg",
  },
  {
    name: "TNMSCL — Tamil Nadu",
    fullName: "Tamil Nadu Medical Services Corporation Limited (TNMSCL)",
    logo: "/images/institutions/tnmscl.svg",
  },
  {
    name: "TSMSIDC — Telangana",
    fullName: "Telangana State Medical Services & Infrastructure Development Corporation (TSMSIDC)",
    logo: "/images/institutions/tsmsidc.svg",
  },
  {
    name: "NHM — Assam",
    fullName: "National Health Mission Assam (NHM Assam)",
    logo: "/images/institutions/nhm-assam.svg",
  },
  {
    name: "NHM — Tripura",
    fullName: "National Health Mission Tripura (NHM Tripura)",
    logo: "/images/institutions/nhm-tripura.svg",
  },
  {
    name: "HMSCL — Haryana",
    fullName: "Haryana Medical Services Corporation Limited (HMSCL)",
    logo: "/images/institutions/hmscl.svg",
  },
];

const esteemedClients: { name: string; logo: string }[] = [
  { name: "Mankind Pharma", logo: "/images/clients/mankind.svg" },
  { name: "Jagsonpal Pharmaceuticals", logo: "/images/clients/jagsonpal.svg" },
  { name: "Obsurge Biotech", logo: "/images/clients/obsurge.svg" },
  { name: "Seagull Pharma", logo: "/images/clients/seagull.svg" },
  { name: "Wings Pharma", logo: "/images/clients/wings.svg" },
  { name: "DeVats", logo: "/images/clients/devats.svg" },
  { name: "Ornate", logo: "/images/clients/ornate.svg" },
  { name: "Mohrish Pharmaceuticals", logo: "/images/clients/mohrish.svg" },
  { name: "Iressia Life Sciences", logo: "/images/clients/iressia.svg" },
  { name: "Shifa Laboratories", logo: "/images/clients/shifa.svg" },
  { name: "Ravenbhel Healthcare", logo: "/images/clients/ravenbhel.svg" },
  {
    name: "Quality Innovations & Pharmaceuticals",
    logo: "/images/clients/quality-innovations.svg",
  },
  { name: "Cradel Pharmaceuticals", logo: "/images/clients/cradel.svg" },
  { name: "Adips Dermatek", logo: "/images/clients/adips-dermatek.svg" },
];

export const Route = createFileRoute("/clients")({
  head: () => ({
    meta: [
      { title: "Institutional Clients — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Unicure India supplies to AIIMS, BPPI, Safdarjung Hospital, state medical corporations and defence — across all 28 states of India.",
      },
      { property: "og:title", content: "Our Institutional Clients — Unicure India Ltd" },
      {
        property: "og:description",
        content:
          "Trusted supply partner to leading medical colleges, hospital networks, and state medical corporations across India.",
      },
      { property: "og:url", content: "https://unicureindialtd.vercel.app/clients" },
    ],
    links: [{ rel: "canonical", href: "https://unicureindialtd.vercel.app/clients" }],
  }),
  component: ClientsPage,
});

function ClientsPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Institutional Sales"
        title="One of the largest institutional suppliers in the country."
        subtitle="Unicure stands tall with net sales of approximately ₹2 billion, growing at 20% year-on-year — supplying to leading institutions and state medical corporations across all 28 states of India."
      />

      {/* Institutional Clients Grid */}
      <section className="py-24 bg-background">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
              Public Healthcare & Government Supply
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Institutional Clients & Government Partners
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-gradient-brand" />
          </div>

          <StaggerGrid className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {institutionalClients.map((c, i) => (
              <StaggerItem key={c.name}>
                <div
                  className="flex items-center gap-3.5 rounded-2xl border border-border bg-white px-5 py-4 shadow-card hover:shadow-elegant hover:border-primary/40 transition-all duration-300 group"
                  title={c.fullName}
                >
                  <div className="text-xs font-mono text-muted-foreground w-6 shrink-0 font-medium">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* Logo Container with Fallback */}
                  <div className="relative h-10 w-10 shrink-0 grid place-items-center rounded-xl bg-secondary/60 p-1 border border-border/50 group-hover:scale-105 transition-transform duration-300">
                    <SafeImage
                      src={c.logo}
                      alt={c.fullName}
                      className="h-8 w-8 object-contain"
                      loading="lazy"
                      fallback={<Building2 className="h-5 w-5 text-primary" />}
                    />
                  </div>

                  <div className="text-sm font-semibold text-foreground/90 leading-tight">
                    {c.name}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <p className="mt-12 text-center text-sm text-muted-foreground">
            Trusted supply partner across all 28 states and union territories of India.
          </p>
        </div>
      </section>

      {/* Co-manufacturing — Esteemed Clients */}
      <section className="py-24 bg-gradient-soft border-t border-border">
        <div className="container-x">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Co-Manufacturing
              </div>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
                Our Esteemed Clients
              </h2>
              <p className="mt-3 text-muted-foreground">
                Trusted by leading pharmaceutical multinational and domestic brands
              </p>
              <div className="mx-auto mt-5 h-1 w-16 rounded bg-primary" />
            </div>
          </ScrollReveal>

          <StaggerGrid className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {esteemedClients.map((c) => (
              <StaggerItem key={c.name}>
                <div
                  className="group flex h-28 items-center justify-center rounded-2xl bg-white border border-border shadow-card hover:shadow-elegant transition p-5 h-full"
                  title={c.name}
                >
                  <SafeImage
                    src={c.logo}
                    alt={c.name}
                    className="max-h-14 max-w-[85%] object-contain"
                    loading="lazy"
                    fallback={
                      <span className="text-center text-sm font-semibold text-foreground/80 leading-tight">
                        {c.name}
                      </span>
                    }
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>
    </SiteLayout>
  );
}
