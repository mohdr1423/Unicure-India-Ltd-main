import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import {
  Pill,
  Package,
  Droplets,
  FlaskConical,
  Sparkles,
  Syringe,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Layers,
  Award,
} from "lucide-react";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";

export const Route = createFileRoute("/dosage-forms")({
  head: () => ({
    meta: [
      { title: "Dosage Forms & Capacities — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Comprehensive pharmaceutical dosage forms: Tablets (6,000M), Capsules (1,200M), Oral Liquids (35.2M), Dry Syrups, Sachets, Ointments & Lotions.",
      },
      { property: "og:title", content: "Dosage Forms — Unicure India Ltd" },
      {
        property: "og:description",
        content: "High capacity WHO-GMP certified dosage form manufacturing capabilities.",
      },
      { property: "og:url", content: "/dosage-forms" },
    ],
    links: [{ rel: "canonical", href: "/dosage-forms" }],
  }),
  component: DosageFormsPage,
});

type DosageItem = {
  id: string;
  name: string;
  capacity: string;
  icon: any;
  category: string;
  image: string;
  description: string;
  variants: string[];
  equipment: string[];
  packaging: string[];
};

const dosageFormsData: DosageItem[] = [
  {
    id: "tablets",
    name: "Tablets (Solid Orals)",
    capacity: "6,000 Million Units / Year",
    icon: Pill,
    category: "Oral Solid Dosage",
    image: "/images/mfg-machine.webp",
    description:
      "State-of-the-art high-speed compression and automated coating technologies operating in Class 100,000 controlled environments across our Noida and Roorkee plants.",
    variants: [
      "Plain Uncoated Tablets",
      "Film Coated & Moisture Barrier",
      "Sugar Coated Tablets",
      "Enteric Coated & Delayed Release",
      "Sustained & Extended Release (SR/ER)",
      "Chewable & Dispersible Formulations",
      "Effervescent Tablets",
      "Bilayer Multi-API Tablets",
    ],
    equipment: [
      "High-speed 45/55/75 station rotary compression presses",
      "Auto-coaters with precision spray guns & dehumidified air handling",
      "High-shear rapid mixer granulators (RMG) and Fluid Bed Dryers (FBD)",
    ],
    packaging: [
      "Alu-Alu blister packaging with online camera inspection",
      "PVC / PVdC / Triplex blister sealing",
      "HDPE container packaging with induction sealing & silica desiccant inserters",
    ],
  },
  {
    id: "capsules",
    name: "Capsules (Hard Gelatin & Veg)",
    capacity: "1,200 Million Units / Year",
    icon: Package,
    category: "Oral Solid Dosage",
    image: "/images/plant-2.webp",
    description:
      "Fully automated capsule filling machines engineered to handle powder formulations, time-release pellets, and combination drug deliveries with stringent weight variation control.",
    variants: [
      "Hard Gelatin Capsules (Sizes 00, 0, 1, 2, 3, 4)",
      "Vegetarian / HPMC Capsules for global regulatory markets",
      "Modified-release sustained coated pellets in capsules",
      "Dual powder-plus-pellet combination fillings",
    ],
    equipment: [
      "Fully automatic high-speed capsule filling machines with vacuum de-dusting",
      "Precision checkweighers and capsule polisher units",
      "Humidity controlled filling suites (< 40% RH)",
    ],
    packaging: ["Alu-Alu blister", "PVC / PVdC blister", "Tamper-evident HDPE bottles"],
  },
  {
    id: "oral-liquids",
    name: "Liquid Orals & Syrups",
    capacity: "35.28 Million Bottles / Year",
    icon: Droplets,
    category: "Liquid Formulations",
    image: "/images/production-pic.webp",
    description:
      "Complete closed-loop manufacturing for cough syrups, tonics, suspensions, and antacids with sanitary SS 316L mixing tanks and automatic linear filling lines.",
    variants: [
      "Pediatric & Adult Cough Syrups",
      "Antacid Suspensions & Emulsions",
      "Multivitamin & Mineral Tonics",
      "Digestive Enzymes & Laxative Solutions",
      "Analgesic & Antipyretic Drops",
    ],
    equipment: [
      "SS 316L Jacketed mixing tanks with high-speed homogenizers & magnetic stirrers",
      "Automated bottle washing, nitrogen purging, filling, capping & labeling lines",
      "Online visual inspection and weight verification",
    ],
    packaging: [
      "PET / Amber glass bottles with measuring caps",
      "Pilfer-proof ROPP & screw closures",
    ],
  },
  {
    id: "dry-syrups",
    name: "Dry Syrups & Reconstitutables",
    capacity: "3.6 Million Units / Year",
    icon: Droplets,
    category: "Antibiotics & Pediatrics",
    image: "/images/plant.webp",
    description:
      "Dedicated airlocks and dehumidified cleanrooms specifically constructed for moisture-sensitive antibiotic suspensions (Beta-Lactam and Non-Beta-Lactam).",
    variants: [
      "Amoxicillin + Clavulanate Dry Syrups",
      "Cefixime / Cefpodoxime Reconstitutable Powders",
      "Azithromycin Pediatric Suspensions",
      "Dry Granules for Oral Reconstitution",
    ],
    equipment: [
      "Specialized dry powder auger filling machines with low humidity controls",
      "Purified Water / Diluent co-packaging lines",
      "Desiccant induction sealed capping systems",
    ],
    packaging: ["High-barrier HDPE bottles with graduated measuring cups / spoons"],
  },
  {
    id: "sachets",
    name: "Sachets & Granules",
    capacity: "23 Million Sachets & 4,000 MT Powders",
    icon: Sparkles,
    category: "Powders & Granules",
    image: "/images/qc-lab.webp",
    description:
      "High-speed form-fill-seal (FFS) multi-lane sachet packaging for electrolyte salts, probiotics, and effervescent formulations with airtight four-side sealing.",
    variants: [
      "Oral Rehydration Salts (WHO standard ORS)",
      "Probiotic & Prebiotic Granule Blends",
      "Effervescent Urinary Alkalizers",
      "Protein & Nutritional Dietary Powders",
    ],
    equipment: [
      "Multi-lane computerized rotary powder sachet packaging machines",
      "Fluidized bed processors & rotary cone vacuum dryers",
    ],
    packaging: ["Triple-laminate aluminum foil sachets", "Pouch containers & bulk drums"],
  },
  {
    id: "semi-solids",
    name: "Ointments, Creams & Gels",
    capacity: "500 Metric Tons / Year",
    icon: FlaskConical,
    category: "Topical Formulations",
    image: "/images/wet-lab.webp",
    description:
      "Advanced planetary vacuum mixer emulsifiers for topical medications, providing smooth rheology, uniform drug dispersion, and sterile packaging.",
    variants: [
      "Topical Antibiotic & Antifungal Creams",
      "Anti-inflammatory & Analgesic Gels",
      "Corticosteroid Ointments",
      "Emollient & Barrier Creams",
    ],
    equipment: [
      "Planetary vacuum homogenizer & mixing vessels with scraper blades",
      "Automated tube filling and ultrasonic / hot air sealing lines",
    ],
    packaging: ["Collapsible aluminum tubes", "Laminated plastic tubes with tamper-evident caps"],
  },
  {
    id: "lotions",
    name: "Medicated Lotions & External Solutions",
    capacity: "3 to 5 Million Bottles / Year",
    icon: Droplets,
    category: "External Preparations",
    image: "/images/hplc.webp",
    description:
      "Scalp and skin therapeutic formulations processed in dedicated suites with micro-filtration systems and precision liquid nozzles.",
    variants: [
      "Medicated Anti-dandruff Lotions",
      "Topical Disinfectants & Antiseptic Solutions",
      "Keratolytic & Dermatological Washes",
    ],
    equipment: ["Stainless steel storage tanks", "Automatic multi-head liquid fillers"],
    packaging: ["Dispensing bottles", "Flip-top bottles", "Pump applicator packs"],
  },
];

function DosageFormsPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredForms =
    activeTab === "all"
      ? dosageFormsData
      : dosageFormsData.filter((item) =>
          item.category.toLowerCase().includes(activeTab.toLowerCase()),
        );

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Dosage Forms & Capabilities"
        title="Comprehensive Dosage Form Manufacturing"
        subtitle="Unicure India Ltd. operates three world-class WHO-GMP approved plants delivering over 6 Billion tablets, 1.2 Billion capsules, and millions of oral liquid formulations annually."
      />

      {/* Production Metrics Banner */}
      <section className="py-12 bg-muted/40 border-b border-border">
        <div className="container-x">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 rounded-2xl bg-white border border-border shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-primary">6,000M+</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Tablets / Year
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-border shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-primary">1,200M+</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Capsules / Year
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-border shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-primary">35.28M+</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Liquid Orals / Year
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-border shadow-sm">
              <div className="text-3xl md:text-4xl font-bold text-primary">4,000 MT</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground font-semibold">
                Dry Powders & Granules
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="py-16">
        <div className="container-x">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-primary">
                Capabilities
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mt-1">
                Dosage Form Portfolio
              </h2>
            </div>

            <div className="flex flex-wrap gap-2 rounded-2xl bg-muted/50 p-1.5 border border-border">
              {[
                { label: "All Formulations", value: "all" },
                { label: "Oral Solid Dosage", value: "solid" },
                { label: "Liquid Orals", value: "liquid" },
                { label: "Topicals & Powders", value: "topical" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                    activeTab === tab.value
                      ? "bg-white text-primary shadow-sm border border-border/50"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-12">
            {filteredForms.map((item, idx) => {
              const Icon = item.icon;
              return (
                <ScrollReveal key={item.id}>
                  <div className="rounded-3xl border border-border bg-white p-8 md:p-12 shadow-card hover:shadow-elegant transition-all">
                    <div className="grid gap-8 lg:grid-cols-12 items-start">
                      {/* Left: Info */}
                      <div className="lg:col-span-7 space-y-6">
                        <div className="flex items-center gap-4">
                          <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                            <Icon className="h-7 w-7" />
                          </div>
                          <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                              {item.category}
                            </span>
                            <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                              {item.name}
                            </h3>
                          </div>
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          <Award className="h-4 w-4" /> Capacity: {item.capacity}
                        </div>

                        <p className="text-muted-foreground leading-relaxed">{item.description}</p>

                        {/* Variants */}
                        <div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-1.5">
                            <Layers className="h-4 w-4 text-primary" /> Key Formulations & Variants
                          </h4>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {item.variants.map((v) => (
                              <div
                                key={v}
                                className="flex items-center gap-2 text-sm text-foreground/90"
                              >
                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                                <span>{v}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Packaging Types */}
                        <div className="pt-4 border-t border-border">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2 flex items-center gap-1.5">
                            <Package className="h-4 w-4 text-primary" /> Packaging Options
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {item.packaging.map((pkg) => (
                              <span
                                key={pkg}
                                className="rounded-lg bg-muted/60 px-3 py-1 text-xs font-medium text-foreground/80"
                              >
                                {pkg}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Technical Specs Box */}
                      <div className="lg:col-span-5 space-y-6">
                        <div className="rounded-2xl border border-border bg-muted/30 p-6">
                          <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3 flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-primary" /> Machinery & Technology
                          </h4>
                          <ul className="space-y-2.5 text-xs text-muted-foreground leading-relaxed">
                            {item.equipment.map((eq, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                                <span>{eq}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between">
                          <div>
                            <div className="text-sm font-bold text-foreground">
                              Need Contract Manufacturing?
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Request batch quotation or technical dossier
                            </div>
                          </div>
                          <Link
                            to="/contract-manufacturing"
                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white hover:bg-primary/90 transition shadow-sm"
                          >
                            Explore Co-Mfg <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 bg-gradient-brand text-white">
        <div className="container-x text-center max-w-3xl">
          <ShieldCheck className="h-12 w-12 mx-auto text-white/90" />
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Partner With a Leading Pharmaceutical Manufacturer
          </h2>
          <p className="mt-4 text-white/85 text-base md:text-lg leading-relaxed">
            With 40+ years of manufacturing pedigree, Unicure India Ltd. delivers exceptional batch
            consistency, regulatory compliance, and rapid turnaround for domestic and international
            partners.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-lg hover:bg-white/90 transition"
            >
              Get in Touch
            </Link>
            <Link
              to="/products"
              className="rounded-xl border border-white/30 bg-white/10 px-8 py-3.5 text-sm font-bold text-white backdrop-blur hover:bg-white/20 transition"
            >
              Browse Full Product List
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
