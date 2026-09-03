import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ArrowRight, ShieldCheck, Factory, Award, FileCheck2, CheckCircle2 } from "lucide-react";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import { SafeImage } from "@/components/site/SafeImage";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";

export const Route = createFileRoute("/contract-manufacturing")({
  head: () => ({
    meta: [
      { title: "Co-Manufacturing & Third-Party Pharmaceutical Manufacturing — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Unicure India offers third-party and loan-licence contract manufacturing across all major dosage forms from three WHO-GMP approved manufacturing facilities.",
      },
      { property: "og:title", content: "Co-Manufacturing — Unicure India Ltd" },
      {
        property: "og:description",
        content:
          "Partnering with industry leaders to deliver quality pharmaceutical solutions across tablets, capsules, liquids, and dry syrups.",
      },
      { property: "og:url", content: "https://unicureindialtd.vercel.app/contract-manufacturing" },
    ],
    links: [
      { rel: "canonical", href: "https://unicureindialtd.vercel.app/contract-manufacturing" },
    ],
  }),
  component: CoMfgPage,
});

/* ------------------------------------------------------------------ */
/*  Verified Client Logos (14 Partner Companies)                       */
/* ------------------------------------------------------------------ */
interface ClientPartner {
  name: string;
  logo: string;
}

const ALL_CLIENTS: ClientPartner[] = [
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

/* 6 Featured Logos for the "Why brands choose Unicure" section */
const FEATURED_CLIENTS = ALL_CLIENTS.slice(0, 6);

function CoMfgPage() {
  return (
    <SiteLayout>
      {/* ============================================================ */}
      {/* 1. HERO SECTION WITH INDUSTRIAL PHARMACEUTICAL VISUAL        */}
      {/* ============================================================ */}
      <section
        className="relative pb-20 md:pb-28 overflow-hidden bg-[color:var(--brand-blue-dark)] text-white"
        style={{ paddingTop: "calc(var(--header-height, 108px) + 1.75rem)" }}
      >
        {/* Background Manufacturing Imagery with Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-manufacturing.jpg"
            alt="Pharmaceutical Manufacturing Facility"
            className="w-full h-full object-cover object-center opacity-30 scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--brand-blue-dark)] via-[color:var(--brand-blue-dark)]/90 to-[color:var(--brand-blue-dark)]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,16,46,0.3),transparent_70%)]" />
        </div>

        <div className="container-x relative z-10">
          <div className="max-w-3xl">
            <div className="mb-4 sm:mb-5">
              <Breadcrumbs theme="dark" />
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 border border-white/15">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> Contract & Third-Party
              Manufacturing
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Co-Manufacturing
            </h1>
            <p className="mt-5 text-lg md:text-xl text-white/85 leading-relaxed font-normal">
              Partnering with industry leaders to deliver quality pharmaceutical solutions across
              tablets, capsules, liquids, and dry syrups from three WHO-GMP approved plants.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition"
              >
                Discuss a Partnership <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/dosage-forms"
                className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition"
              >
                Explore Dosage Forms
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. WHY BRANDS CHOOSE UNICURE SECTION                          */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container-x grid gap-12 lg:grid-cols-[1.15fr_1fr] items-center">
          {/* Left Column: Heading & Value Points */}
          <ScrollReveal variant="slide-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Unicure Advantage
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Why brands choose Unicure
              </h2>
              <div className="mt-3 h-1 w-16 rounded-full bg-gradient-brand" />

              <ul className="mt-8 space-y-4">
                {[
                  "Three WHO-GMP approved plants across Noida, Roorkee and Greater Noida",
                  "Solid oral, liquid, dry syrup, dry powder and semi-solid capability",
                  "Beta-Lactam and Hormonal dedicated blocks",
                  "Ready CTD / ACTD / Dossier support across therapy areas",
                  "Approved supplier to institutional buyers and government tenders across India",
                ].map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3.5">
                    <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-brand shadow-sm ring-2 ring-primary/20" />
                    <span className="text-base text-foreground/85 font-medium leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition"
                >
                  Discuss a partnership <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>

          {/* Right Column: 2x3 Grid of 6 Selected Client Logos */}
          <ScrollReveal variant="slide-right" delay={0.1}>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-3.5 md:gap-4 bg-secondary/40 p-4 sm:p-6 rounded-3xl border border-border/80">
              {FEATURED_CLIENTS.map((client) => (
                <div
                  key={client.name}
                  className="group rounded-2xl bg-white border border-border/80 p-4 sm:p-5 h-24 sm:h-28 flex items-center justify-center shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-300"
                  title={client.name}
                >
                  <SafeImage
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="max-h-12 sm:max-h-14 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    fallback={
                      <span className="text-xs font-semibold text-center text-foreground/80 leading-tight">
                        {client.name}
                      </span>
                    }
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. OUR ESTEEMED CLIENTS SECTION (ALL 14 PARTNER LOGOS)       */}
      {/* ============================================================ */}
      <section className="py-20 md:py-28 bg-secondary/40 border-y border-border">
        <div className="container-x">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                OUR ESTEEMED CLIENTS
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Trusted by leading pharmaceutical companies
              </h2>
              <div className="mt-4 mx-auto h-1 w-16 rounded-full bg-gradient-brand" />
              <p className="mt-4 text-sm sm:text-base text-muted-foreground">
                Decades of contract manufacturing excellence serving India's top pharmaceutical
                innovators.
              </p>
            </div>
          </ScrollReveal>

          {/* Responsive Logo Grid: 5 cols on Desktop, 3/4 on Tablet, exactly 2 on Mobile */}
          <StaggerGrid className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5 max-w-7xl mx-auto">
            {ALL_CLIENTS.map((client) => (
              <StaggerItem key={client.name}>
                <div
                  className="group rounded-2xl bg-white border border-border/80 p-4 sm:p-6 min-h-[90px] sm:min-h-[110px] flex items-center justify-center shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 focus-within:ring-2 focus-within:ring-primary"
                  title={client.name}
                >
                  <SafeImage
                    src={client.logo}
                    alt={`${client.name} logo`}
                    className="max-h-12 sm:max-h-14 max-w-[85%] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    fallback={
                      <span className="text-xs font-semibold text-center text-foreground/80 leading-tight">
                        {client.name}
                      </span>
                    }
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. COMPLIANCE & CAPABILITIES PILLARS                          */}
      {/* ============================================================ */}
      <section className="py-20 md:py-24 bg-background">
        <div className="container-x">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Factory,
                title: "Scale & Capacity",
                desc: "Over 6,000 million tablets, 1,200 million capsules, and extensive liquid lines across three manufacturing units.",
              },
              {
                icon: Award,
                title: "WHO-GMP Standards",
                desc: "Fully validated HVAC Class 100,000 cleanrooms, water systems conforming to USP standards, and dedicated containment zones.",
              },
              {
                icon: FileCheck2,
                title: "Regulatory & Dossiers",
                desc: "Complete documentation support including CTD / ACTD dossiers, stability data, and validation protocols for turnkey launch.",
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-3xl bg-white border border-border p-7 shadow-card hover:shadow-elegant transition"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-white shrink-0 shadow-sm">
                  <pillar.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">{pillar.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. PROFESSIONAL CTA SECTION                                  */}
      {/* ============================================================ */}
      <section className="pb-20 md:pb-28 overflow-hidden">
        <div className="container-x">
          <ScrollReveal variant="scale">
            <div className="rounded-3xl bg-[color:var(--brand-blue-dark)] p-8 sm:p-12 md:p-16 text-white shadow-elegant text-center relative overflow-hidden">
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

              <div className="relative max-w-2xl mx-auto space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold text-white/90 backdrop-blur">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Loan Licence &
                  Third-Party Manufacturing
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Ready to build your next pharmaceutical partnership?
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
                  Let's discuss your manufacturing requirements with our commercial team. We provide
                  turnkey formulation, batch scale-up, and regulatory dossier support.
                </p>
                <div className="pt-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-8 py-3.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition"
                  >
                    Discuss a Partnership <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteLayout>
  );
}
