import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Globe2, ArrowRight, ShieldCheck, FileCheck, Truck, CheckCircle2 } from "lucide-react";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import { SafeImage } from "@/components/site/SafeImage";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/exports")({
  head: () => ({
    meta: [
      { title: "International Operations & Export Sales — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Unicure India Ltd operates globally with exports to 20+ countries across Africa, Middle East, CIS, Europe, Southeast Asia, and Latin America with WHO-GMP compliant facilities.",
      },
      { property: "og:title", content: "International Operations — Unicure India Ltd" },
      {
        property: "og:description",
        content:
          "Global pharmaceutical exports and distribution networks across 20+ countries worldwide.",
      },
      { property: "og:url", content: "/exports" },
    ],
    links: [{ rel: "canonical", href: "/exports" }],
  }),
  component: ExportsPage,
});

/* ------------------------------------------------------------------ */
/*  Country Data — Exact 10 Countries with Accurate Classifications    */
/* ------------------------------------------------------------------ */
interface CountryData {
  name: string;
  region: "CIS" | "Latin America" | "Europe" | "Middle East" | "Africa" | "Southeast Asia";
  flag: string;
  alt: string;
}

const COUNTRIES: CountryData[] = [
  {
    name: "Uzbekistan",
    region: "CIS",
    flag: "/images/flags/uz.svg",
    alt: "Flag of Uzbekistan",
  },
  {
    name: "Dominican Republic",
    region: "Latin America",
    flag: "/images/flags/do.svg",
    alt: "Flag of Dominican Republic",
  },
  {
    name: "Belgium",
    region: "Europe",
    flag: "/images/flags/be.svg",
    alt: "Flag of Belgium",
  },
  {
    name: "Iraq",
    region: "Middle East",
    flag: "/images/flags/iq.svg",
    alt: "Flag of Iraq",
  },
  {
    name: "Iran",
    region: "Middle East",
    flag: "/images/flags/ir.svg",
    alt: "Flag of Iran",
  },
  {
    name: "Tanzania",
    region: "Africa",
    flag: "/images/flags/tz.svg",
    alt: "Flag of Tanzania",
  },
  {
    name: "Yemen",
    region: "Middle East",
    flag: "/images/flags/ye.svg",
    alt: "Flag of Yemen",
  },
  {
    name: "Kenya",
    region: "Africa",
    flag: "/images/flags/ke.svg",
    alt: "Flag of Kenya",
  },
  {
    name: "Senegal",
    region: "Africa",
    flag: "/images/flags/sn.svg",
    alt: "Flag of Senegal",
  },
  {
    name: "Philippines",
    region: "Southeast Asia",
    flag: "/images/flags/ph.svg",
    alt: "Flag of Philippines",
  },
];

/* ------------------------------------------------------------------ */
/*  Region Filter Definitions with Brand-Tailored Colors               */
/* ------------------------------------------------------------------ */
const REGION_FILTERS = [
  { id: "ALL", name: "All Regions", color: "var(--brand-blue)" },
  { id: "Africa", name: "Africa", color: "#C8102E" },
  { id: "Middle East", name: "Middle East", color: "#D4451A" },
  { id: "CIS", name: "CIS", color: "#E67E22" },
  { id: "Europe", name: "Europe", color: "#0b3b8f" },
  { id: "Southeast Asia", name: "Southeast Asia", color: "#2b8ac9" },
  { id: "Latin America", name: "Latin America", color: "#16a34a" },
] as const;

function ExportsPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");

  // Filter countries based on selected tab
  const filteredCountries = useMemo(() => {
    if (selectedRegion === "ALL") return COUNTRIES;
    return COUNTRIES.filter((c) => c.region === selectedRegion);
  }, [selectedRegion]);

  return (
    <SiteLayout>
      {/* Hero Section */}
      <PageHero
        eyebrow="Global Presence"
        title="International Operations & Export Sales"
        subtitle="With manufacturing facilities and distribution networks spanning multiple countries, we ensure global access to high-quality pharmaceutical products."
      />

      {/* Main Operations Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-x">
          {/* Section Header */}
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Global Footprint
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Our International Operations
              </h2>
              <div className="mx-auto mt-4 h-1 w-20 rounded-full bg-gradient-brand" />
              <p className="mt-5 text-base md:text-lg leading-relaxed text-muted-foreground">
                With manufacturing facilities and distribution networks spanning multiple countries,
                we ensure global access to high-quality pharmaceutical products.
              </p>
            </div>
          </ScrollReveal>

          {/* Region Filters — Horizontally scrollable on mobile */}
          <ScrollReveal delay={0.1}>
            <div className="mt-10 md:mt-12 flex justify-start sm:justify-center overflow-x-auto pb-3 pt-1 px-1 -mx-4 sm:mx-0 px-4 sm:px-0 no-scrollbar gap-2 sm:gap-2.5">
              {REGION_FILTERS.map((r) => {
                const active = selectedRegion === r.id;
                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRegion(r.id)}
                    className={`inline-flex items-center gap-1.5 shrink-0 rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                      active
                        ? "bg-primary text-primary-foreground shadow-glow scale-105"
                        : "bg-white text-foreground/75 border border-border shadow-sm hover:border-primary/40 hover:text-foreground hover:bg-secondary/50"
                    }`}
                    aria-pressed={active}
                  >
                    <Globe2
                      className={`h-3.5 w-3.5 ${active ? "text-white" : "text-primary/70"}`}
                    />
                    <span>{r.name}</span>
                    {r.id !== "ALL" && (
                      <span
                        className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                          active ? "bg-white/25 text-white" : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {COUNTRIES.filter((c) => c.region === r.id).length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </ScrollReveal>

          {/* Country Cards Grid — 5 cols on desktop, 3 on tablet, exactly 2 on mobile */}
          <div className="mt-10 md:mt-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedRegion}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-6 max-w-7xl mx-auto">
                  {filteredCountries.map((c) => (
                    <article
                      key={c.name}
                      tabIndex={0}
                      className="group flex flex-col rounded-2xl bg-white border border-border/80 p-3.5 sm:p-4 md:p-5 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      {/* Flag Image Container */}
                      <div className="relative aspect-[3/2] w-full rounded-xl overflow-hidden bg-secondary/40 border border-border/50 shadow-sm shrink-0">
                        <SafeImage
                          src={c.flag}
                          alt={c.alt}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          fallback={
                            <div className="h-full w-full grid place-items-center bg-secondary/80 text-muted-foreground">
                              <Globe2 className="h-6 w-6 text-primary/60" />
                            </div>
                          }
                        />
                      </div>

                      {/* Country Info */}
                      <div className="mt-3 md:mt-4 flex flex-col flex-1 justify-between text-center">
                        <h3 className="font-bold text-sm sm:text-base text-foreground leading-snug tracking-tight">
                          {c.name}
                        </h3>
                        <div className="mt-1.5 sm:mt-2">
                          <span className="inline-block rounded-full bg-secondary/90 border border-border/60 px-2.5 py-0.5 text-[11px] sm:text-xs font-medium text-muted-foreground group-hover:text-primary group-hover:border-primary/30 transition-colors">
                            {c.region}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Global Capabilities Highlights */}
      <section className="py-16 bg-secondary/40 border-y border-border">
        <div className="container-x">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: ShieldCheck,
                title: "WHO-GMP Certified",
                desc: "Manufactured in accredited facilities complying with rigorous global pharmacopoeial standards.",
              },
              {
                icon: FileCheck,
                title: "CTD / ACTD Dossiers",
                desc: "Comprehensive regulatory dossier preparation for accelerated international market approvals.",
              },
              {
                icon: Truck,
                title: "Global Supply Chain",
                desc: "Robust logistics network with temperature-controlled transit across 20+ countries.",
              },
              {
                icon: Globe2,
                title: "Custom Formulations",
                desc: "Therapy-specific adaptations for regional regulatory requirements and patient preferences.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl bg-white border border-border p-6 shadow-card hover:shadow-elegant transition"
              >
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white shrink-0">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Export CTA Section */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="container-x">
          <ScrollReveal variant="scale">
            <div className="rounded-3xl bg-[color:var(--brand-blue-dark)] p-8 sm:p-12 md:p-16 text-white shadow-elegant text-center relative overflow-hidden">
              <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

              <div className="relative max-w-2xl mx-auto space-y-4">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold text-white/90 backdrop-blur">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Global Partnership
                  Inquiries
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                  Looking to import pharmaceutical products from India?
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
                  Our international business team handles product registrations, CTD/ACTD dossier
                  preparation, customized packaging, and global logistics for distributors
                  worldwide.
                </p>
                <div className="pt-4">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-8 py-3.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition"
                  >
                    Contact Export Team <ArrowRight className="h-4 w-4" />
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
