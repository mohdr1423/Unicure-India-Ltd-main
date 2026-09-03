import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { ShieldAlert, BookOpen, AlertOctagon, Scale, FileCheck, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms of Service — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Official Terms of Service and Intellectual Property terms for Unicure India Ltd. Details on site use, data protection, and anti-scraping regulations.",
      },
      { property: "og:title", content: "Terms of Service — Unicure India Ltd" },
      {
        property: "og:description",
        content:
          "Official Terms of Service, Intellectual Property protections, and terms of use for Unicure India Ltd.",
      },
      { property: "og:url", content: "https://unicureindialtd.vercel.app/terms-of-service" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://unicureindialtd.vercel.app/terms-of-service" }],
  }),
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <SiteLayout>
      <PageHero
        title="Terms of Service"
        subtitle="Governing conditions for the use of Unicure India Ltd digital platforms and intellectual property."
        badge="Legal Agreement"
      />

      <div className="container-x py-12 lg:py-16 max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-10 shadow-sm space-y-10 text-foreground/90 leading-relaxed">
            {/* Header info */}
            <div className="border-b border-border/60 pb-6">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <Scale className="w-4 h-4 text-primary" />
                <span>Effective Date: September 2024 • Last Updated: September 2026</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Welcome to the digital portal of <strong>Unicure India Ltd</strong>. By accessing,
                browsing, or utilizing this website (
                <a
                  href="https://unicureindialtd.vercel.app"
                  className="text-primary hover:underline"
                >
                  unicureindialtd.vercel.app
                </a>
                ), you signify your agreement to be bound by these Terms of Service, all applicable
                laws, and regulations. If you do not agree with any of these terms, you are
                prohibited from accessing this platform.
              </p>
            </div>

            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-primary shrink-0" />
                1. Intellectual Property & Proprietary Rights
              </h2>
              <p className="text-sm">
                All visual interfaces, design assets, formulation catalogues, technical
                specifications, drug licence documentation, brand marks, logos, graphics, and code
                architectures are the proprietary intellectual property of Unicure India Ltd,
                protected by the Indian Copyright Act (1957), Trademarks Act (1999), and
                international WIPO copyright conventions.
              </p>
              <p className="text-sm text-muted-foreground">
                No content from this site may be duplicated, reproduced, modified, republished,
                uploaded, posted, or transmitted in any form without prior written authorization
                from Unicure India Ltd.
              </p>
            </section>

            {/* Section 2 - Anti-Theft & Anti-Scraping */}
            <section className="space-y-3 bg-red-500/5 dark:bg-red-950/10 border border-red-500/20 p-5 sm:p-6 rounded-xl">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400 flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                2. Prohibition of Automated Scraping & AI Ingestion
              </h2>
              <p className="text-sm font-medium text-foreground">
                To protect our proprietary pharmaceutical formulations, client confidentiality, and
                design assets, the following activities are strictly prohibited:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1.5 pl-2 text-muted-foreground">
                <li>
                  Automated data scraping, web crawling, extraction, harvesting, or spidering via
                  bots, headless browsers, or scripts without verified written consent.
                </li>
                <li>
                  Extraction or ingestion of site content, product listings, dosage specs, or design
                  layouts for training artificial intelligence, machine learning, or automated LLM
                  generation tools.
                </li>
                <li>
                  Decompilation, reverse-engineering, disassembling, or attempting to reconstruct
                  original application source code or API architectures.
                </li>
                <li>
                  Interfering with security headers, anti-theft deterrent scripts, or rate-limiting
                  protocols deployed on this domain.
                </li>
              </ul>
              <p className="text-xs text-red-600 dark:text-red-300/80 mt-2">
                Violations of this section constitute actionable offences under Section 43 &amp; 66
                of the Information Technology Act (2000) and are subject to immediate civil and
                criminal redress.
              </p>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <AlertOctagon className="w-5 h-5 text-primary shrink-0" />
                3. Pharmaceutical & Medical Disclaimer
              </h2>
              <p className="text-sm text-muted-foreground">
                The content on this website is provided solely for informational,
                business-to-business (B2B), and contract manufacturing evaluation purposes. Nothing
                contained on this site should be construed as medical advice, clinical diagnosis, or
                a prescription for therapy. Patients seeking treatment must consult qualified
                medical healthcare professionals.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <FileCheck className="w-5 h-5 text-primary shrink-0" />
                4. Commercial Inquiries & Manufacturing Contracts
              </h2>
              <p className="text-sm text-muted-foreground">
                Inquiry forms, quotation requests, and capability downloads do not constitute a
                binding supply contract. Commercial manufacturing engagements, loan-license
                agreements, and export orders are governed exclusively by executed Master Services
                Agreements (MSA), Quality Agreements, and formal purchase orders.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <Scale className="w-5 h-5 text-primary shrink-0" />
                5. Governing Law & Jurisdiction
              </h2>
              <p className="text-sm text-muted-foreground">
                These Terms of Service are governed by and construed in accordance with the laws of
                the Republic of India. Any disputes arising out of or related to the use of this
                website shall fall under the exclusive jurisdiction of the competent courts located
                in Gautam Buddha Nagar (Noida), Uttar Pradesh, India.
              </p>
            </section>

            {/* Section 6 - Contact */}
            <section className="space-y-3 border-t border-border/60 pt-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                6. Contact Legal Affairs
              </h2>
              <p className="text-sm text-muted-foreground">
                For legal inquiries, licensing requests, or intellectual property permissions,
                contact:
              </p>
              <div className="bg-muted/40 p-4 rounded-xl border border-border/60 text-sm space-y-1">
                <p className="font-semibold text-foreground">
                  Unicure India Ltd — Legal & Regulatory Department
                </p>
                <p className="text-muted-foreground">
                  C-21, 22 &amp; 23, Sector-3, Noida, Uttar Pradesh — 201301, India
                </p>
                <p className="text-muted-foreground">
                  Email:{" "}
                  <a
                    href="mailto:unicure@unicureindia.com"
                    className="text-primary hover:underline"
                  >
                    unicure@unicureindia.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </ScrollReveal>
      </div>
    </SiteLayout>
  );
}
