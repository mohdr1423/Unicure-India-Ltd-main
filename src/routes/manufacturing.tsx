import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";

import {
  Pill,
  Package,
  Droplets,
  FlaskConical,
  Sparkles,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { useSiteContent } from "@/hooks/use-site-content";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import { FacilityMap } from "@/components/site/FacilityMap";

export const Route = createFileRoute("/manufacturing")({
  head: () => ({
    meta: [
      { title: "Manufacturing Capabilities — Unicure India" },
      {
        name: "description",
        content:
          "WHO-GMP certified manufacturing across tablets, capsules, injectables, oral liquids, ointments, and sachets.",
      },
      { property: "og:title", content: "Manufacturing at Unicure India" },
      { property: "og:description", content: "End-to-end pharmaceutical dosage form expertise." },
      { property: "og:url", content: "https://unicureindialtd.vercel.app/manufacturing" },
    ],
    links: [{ rel: "canonical", href: "https://unicureindialtd.vercel.app/manufacturing" }],
  }),
  component: ManufacturingPage,
});

// Dosage form capacities (source: unicureindia.com — Dosage Form page)
const capacityIcons = [
  Pill,
  Droplets,
  Package,
  Sparkles,
  Droplets,
  FlaskConical,
  Droplets,
  Sparkles,
];
const defaultCapacities: { icon: typeof Pill; title: string; capacity: string }[] = [
  { icon: Pill, title: "Tablets", capacity: "6,000 Millions" },
  { icon: Droplets, title: "Liquid Orals", capacity: "35.28 Millions" },
  { icon: Package, title: "Capsules", capacity: "1,200 Millions" },
  { icon: Sparkles, title: "Sachets", capacity: "23 Millions" },
  { icon: Droplets, title: "Dry Syrups", capacity: "3.6 Millions" },
  { icon: FlaskConical, title: "Ointments & Creams", capacity: "500 Metric Tons" },
  { icon: Droplets, title: "Lotions", capacity: "3–5 Millions (avg 100ml)" },
  { icon: Sparkles, title: "Dry Powders", capacity: "4,000 Metric Tons" },
];

const defaultUnits = [
  {
    name: "Unit-I",
    location: "Noida, Sector-3",
    year: "Established 1984",
    text: "WHO-GMP approved plant manufacturing Solid Oral Dosage forms (Tablets & Capsules), Dry Syrups, Oral Liquid formulations, preparations for external application, Beta-Lactam (Tablets, Capsule & Dry Syrup) and Hormonal section (Tablet & Capsule).",
  },
  {
    name: "Unit-II",
    location: "Roorkee, Uttarakhand",
    year: "Established 2006",
    text: "WHO-GMP approved plant manufacturing Solid Oral Dosage forms (Tablets & Capsules), Dry Powders, Oral Liquid formulations, preparations for external application, and Sex Hormone section (Tablet & Capsule).",
  },
  {
    name: "Unit-III",
    location: "Greater Noida",
    year: "Established 2020",
    text: "WHO-GMP approved state-of-the-art OSD facility (Tablets & Capsules), designed and constructed as per international guidelines — PIC/S, EU and USFDA regulations.",
  },
];

function ManufacturingPage() {
  const c = useSiteContent<{
    hero: { eyebrow: string; title: string; subtitle: string };
    capacities: { eyebrow: string; title: string; items: { title: string; capacity: string }[] };
    units: {
      eyebrow: string;
      title: string;
      items: { name: string; location: string; year: string; text: string }[];
    };
  }>("page:services");
  const capacities = c?.capacities?.items?.length
    ? c.capacities.items.map((it, i) => ({
        icon: capacityIcons[i % capacityIcons.length],
        title: it.title,
        capacity: it.capacity,
      }))
    : defaultCapacities;
  const units = c?.units?.items?.length ? c.units.items : defaultUnits;
  return (
    <SiteLayout>
      <PageHero
        eyebrow={c?.hero?.eyebrow ?? "Manufacturing"}
        title={c?.hero?.title ?? "One of the largest OSD manufacturers in the country."}
        subtitle={
          c?.hero?.subtitle ??
          "Three WHO-GMP approved plants engineered around cGMP (Schedule M) standards — from raw material handling to final packaging."
        }
      />

      {/* Operational Units */}
      <section className="py-24">
        <div className="container-x">
          <ScrollReveal>
            <div className="max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {c?.units?.eyebrow ?? "Operational Units"}
              </div>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
                {c?.units?.title ?? "Three world-class facilities"}
              </h2>
            </div>
          </ScrollReveal>
          <StaggerGrid className="mt-12 grid gap-6 md:grid-cols-3">
            {units.map((u) => (
              <StaggerItem key={u.name}>
                <div className="rounded-2xl border border-border bg-card p-8 shadow-card hover:shadow-elegant transition h-full">
                  <Building2 className="h-8 w-8 text-primary" />
                  <div className="mt-4 text-2xl font-bold">{u.name}</div>
                  <div className="text-sm text-primary font-semibold">{u.location}</div>
                  <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                    {u.year}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{u.text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Dosage Form Capacities */}
      <section className="py-24 bg-gradient-soft">
        <div className="container-x">
          <ScrollReveal>
            <div className="max-w-2xl">
              <div className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {c?.capacities?.eyebrow ?? "Dosage Forms"}
              </div>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
                {c?.capacities?.title ?? "Annual production capacities"}
              </h2>
              <p className="mt-4 text-muted-foreground">
                Comprehensive capability across every major dosage form.
              </p>
            </div>
          </ScrollReveal>
          <StaggerGrid className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {capacities.map((c) => (
              <StaggerItem key={c.title}>
                <div className="rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-elegant transition h-full">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-5 text-sm text-muted-foreground">{c.title}</div>
                  <div className="mt-1 text-xl font-bold text-[color:var(--brand-blue-dark)]">
                    {c.capacity}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* Plants gallery */}
      <section className="py-24">
        <div className="container-x">
          <ScrollReveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-2xl">
                <div className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                  Our Manufacturing Units
                </div>
                <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
                  Inside our facilities
                </h2>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#C8102E] px-4 py-2 text-xs font-semibold text-white shadow-glow">
                <ShieldCheck className="h-4 w-4" /> WHO-GMP Certified
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <div className="mt-10 relative overflow-hidden rounded-3xl shadow-elegant">
              <img
                src="/images/dron-pic-unit3.webp"
                alt="Unicure India Ltd — Greater Noida facility"
                className="w-full h-[420px] md:h-[560px] object-cover"
                loading="lazy"
                width={1200}
                height={560}
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-6 md:p-8">
                <div className="text-white font-bold text-xl md:text-2xl">
                  Unit-III · Greater Noida
                </div>
                <div className="text-white/85 text-sm">
                  State-of-the-art OSD facility built to PIC/S, EU and USFDA standards.
                </div>
              </div>
            </div>
          </ScrollReveal>

          <StaggerGrid className="mt-6 grid gap-6 md:grid-cols-3">
            {[
              {
                src: "/images/plant.webp",
                title: "Unit-I · Noida, Sector-3",
                desc: "Plant C-21, 22 & 23 — established 1984.",
              },
              {
                src: "/images/admin-office.webp",
                title: "Corporate Admin Office",
                desc: "Long-standing manufacturing presence in Noida.",
              },
              {
                src: "/images/plant-2.webp",
                title: "Unit-II · Roorkee",
                desc: "Uttarakhand facility — established 2006.",
              },
            ].map((p) => (
              <StaggerItem key={p.title}>
                <figure className="overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-elegant transition h-full">
                  <img
                    src={p.src}
                    alt={p.title}
                    className="h-56 w-full object-cover"
                    loading="lazy"
                    width={400}
                    height={224}
                  />
                  <figcaption className="p-5">
                    <div className="font-semibold">{p.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <ScrollReveal delay={0.1}>
            <div className="mt-10 overflow-hidden rounded-3xl shadow-elegant">
              <img
                src="/images/mfg-machine.webp"
                alt="Technician operating pharmaceutical equipment on the manufacturing floor"
                className="w-full h-[360px] md:h-[500px] object-cover"
                loading="lazy"
                width={1200}
                height={500}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Facility Map */}
      <FacilityMap />
    </SiteLayout>
  );
}
