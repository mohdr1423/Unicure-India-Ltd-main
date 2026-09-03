import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import {
  Building2,
  Factory,
  Pill,
  ShieldCheck,
  Globe2,
  Users,
  FileCode,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/sitemap")({
  head: () => ({
    meta: [
      { title: "Sitemap & Website Directory — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Browse the complete directory of Unicure India Ltd pages: products, dosage forms, contract manufacturing, quality certifications, and corporate resources.",
      },
      { property: "og:title", content: "Sitemap & Website Directory — Unicure India Ltd" },
      {
        property: "og:description",
        content:
          "Complete index of all public pages, capabilities, and regulatory documents for Unicure India Ltd.",
      },
      { property: "og:url", content: "https://unicureindialtd.vercel.app/sitemap" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://unicureindialtd.vercel.app/sitemap" }],
  }),
  component: SitemapPage,
});

const SITEMAP_SECTIONS = [
  {
    title: "Corporate & Heritage",
    icon: Building2,
    links: [
      { label: "Home Page", path: "/", desc: "Overview of Unicure India Ltd and highlights" },
      {
        label: "About Us",
        path: "/about",
        desc: "40+ years history from 1984, mission, and vision",
      },
      {
        label: "Executive Leadership",
        path: "/leadership",
        desc: "Our board, founders, and technical directors",
      },
      {
        label: "Managing Director's Message",
        path: "/md-message",
        desc: "Address by Mr. Abdul Mateen, Founder & MD",
      },
      { label: "News & Media", path: "/news", desc: "Company updates, achievements, and gallery" },
    ],
  },
  {
    title: "Manufacturing & Capabilities",
    icon: Factory,
    links: [
      {
        label: "Manufacturing Facilities",
        path: "/manufacturing",
        desc: "Infrastructure across Noida, Roorkee, Greater Noida",
      },
      {
        label: "Dosage Forms",
        path: "/dosage-forms",
        desc: "Oral solids, liquids, dry syrups, and injectables",
      },
      {
        label: "Contract Manufacturing",
        path: "/contract-manufacturing",
        desc: "Third-party, loan license, and OEM manufacturing",
      },
      {
        label: "Global Exports",
        path: "/exports",
        desc: "Worldwide supply chain spanning 20+ countries",
      },
    ],
  },
  {
    title: "Products & Catalogue",
    icon: Pill,
    links: [
      {
        label: "Product Catalogue",
        path: "/products",
        desc: "500+ commercial formulations and active ingredients",
      },
      {
        label: "Product Downloads",
        path: "/downloads",
        desc: "Product brochures, dossiers, and spec sheets",
      },
    ],
  },
  {
    title: "Quality & Regulatory",
    icon: ShieldCheck,
    links: [
      {
        label: "Quality Assurance & R&D",
        path: "/quality",
        desc: "Testing laboratories, analytical QC, and compliance",
      },
      {
        label: "Certifications",
        path: "/certifications",
        desc: "WHO-GMP, ISO 9001/14001, Form 25, 26, 28 licences",
      },
      {
        label: "Pharmacovigilance",
        path: "/pharmacovigilance",
        desc: "Adverse drug event reporting and patient safety",
      },
    ],
  },
  {
    title: "Partnerships & Careers",
    icon: Users,
    links: [
      {
        label: "Institutional Clients",
        path: "/clients",
        desc: "AIIMS, BPPI, state corporations, and top pharma brands",
      },
      {
        label: "Careers Portal",
        path: "/careers",
        desc: "Life at Unicure, career pathways, and team culture",
      },
      {
        label: "Job Openings & Apply",
        path: "/careers/apply",
        desc: "Submit your CV for current vacancies",
      },
      {
        label: "Contact Us",
        path: "/contact",
        desc: "Get in touch with sales, exports, or corporate teams",
      },
    ],
  },
  {
    title: "Legal & Digital Governance",
    icon: Globe2,
    links: [
      {
        label: "Privacy Policy",
        path: "/privacy-policy",
        desc: "Data protection standards and DPDP compliance",
      },
      {
        label: "Terms of Service",
        path: "/terms-of-service",
        desc: "Intellectual property rules and anti-scraping policy",
      },
      {
        label: "XML Sitemap (Machine Feed)",
        path: "/sitemap.xml",
        desc: "Official XML sitemap for search crawlers",
        external: true,
      },
      {
        label: "AI Factsheet (llms.txt)",
        path: "/llms.txt",
        desc: "Structured knowledge for AI answer engines",
        external: true,
      },
    ],
  },
];

function SitemapPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Website Sitemap"
        subtitle="Explore the complete structure of Unicure India Ltd — find products, facilities, regulatory data, and services."
        badge="Directory"
      />

      <div className="container-x py-12 lg:py-16">
        <ScrollReveal>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {SITEMAP_SECTIONS.map((sec, idx) => {
              const IconComp = sec.icon;
              return (
                <div
                  key={idx}
                  className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm flex flex-col hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center gap-3 mb-5 border-b border-border/60 pb-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-foreground">{sec.title}</h2>
                  </div>

                  <ul className="space-y-3 flex-1">
                    {sec.links.map((item, lIdx) => (
                      <li key={lIdx}>
                        {item.external ? (
                          <a
                            href={item.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group block p-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center justify-between text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                              <span>{item.label}</span>
                              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                          </a>
                        ) : (
                          <Link
                            to={item.path as any}
                            className="group block p-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center justify-between text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                              <span>{item.label}</span>
                              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {/* Machine readable bottom info card */}
          <div className="mt-12 bg-muted/40 border border-border/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm">
              <FileCode className="w-5 h-5 text-primary shrink-0" />
              <div>
                <p className="font-semibold text-foreground">
                  Looking for machine-readable formats?
                </p>
                <p className="text-xs text-muted-foreground">
                  Access our official XML sitemap and AI LLM context documents.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-card border border-border text-xs font-semibold hover:border-primary transition-colors"
              >
                sitemap.xml
              </a>
              <a
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors"
              >
                llms.txt
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </SiteLayout>
  );
}
