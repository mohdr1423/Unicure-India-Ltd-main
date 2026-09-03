import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { ShieldCheck, Lock, Eye, FileText, Bell, HelpCircle } from "lucide-react";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Read Unicure India Ltd's official Privacy Policy. Learn how we safeguard your data, protect pharmacovigilance reports, and comply with DPDP Act standards.",
      },
      { property: "og:title", content: "Privacy Policy — Unicure India Ltd" },
      {
        property: "og:description",
        content:
          "Official privacy and data protection policy of Unicure India Ltd, WHO-GMP certified pharmaceutical manufacturer.",
      },
      { property: "og:url", content: "https://unicureindialtd.vercel.app/privacy-policy" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://unicureindialtd.vercel.app/privacy-policy" }],
  }),
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <SiteLayout>
      <PageHero
        title="Privacy Policy"
        subtitle="Our commitment to transparency, data protection, and patient safety confidentiality."
        badge="Legal & Compliance"
      />

      <div className="container-x py-12 lg:py-16 max-w-4xl mx-auto">
        <ScrollReveal>
          <div className="bg-card border border-border/80 rounded-2xl p-6 sm:p-10 shadow-sm space-y-10 text-foreground/90 leading-relaxed">
            
            {/* Header info */}
            <div className="border-b border-border/60 pb-6">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span>Effective Date: September 2024 • Last Updated: September 2026</span>
              </div>
              <p className="text-sm text-muted-foreground">
                This Privacy Policy outlines how <strong>Unicure India Ltd</strong> (&ldquo;Unicure&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) collects, uses, protects, and discloses personal and organizational information collected through our official website (<a href="https://unicureindialtd.vercel.app" className="text-primary hover:underline">unicureindialtd.vercel.app</a>) and related digital services.
              </p>
            </div>

            {/* Section 1 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-primary shrink-0" />
                1. Information We Collect
              </h2>
              <p className="text-sm">
                We collect information necessary to facilitate pharmaceutical manufacturing partnerships, institutional inquiries, job applications, and regulatory drug safety reporting:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1.5 pl-2 text-muted-foreground">
                <li><strong>Business & Inquiry Data:</strong> Contact details, organization name, dosage form interests, and inquiry requirements submitted via our contact and contract manufacturing forms.</li>
                <li><strong>Career Applications:</strong> Résumés, employment background, educational qualifications, and contact information submitted through our Careers portal.</li>
                <li><strong>Pharmacovigilance & Adverse Drug Event Data:</strong> Patient initials, reporter contact, suspect medication batch numbers, and adverse event descriptions required by pharmaceutical regulatory authorities.</li>
                <li><strong>Technical & Log Data:</strong> Anonymized browser type, IP address, referral sources, and interaction timestamps utilized for site performance, security monitoring, and cyber-defense.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-primary shrink-0" />
                2. Advanced Data Security & Protection
              </h2>
              <p className="text-sm">
                As a WHO-GMP certified manufacturer, data integrity and confidentiality are integral to our operations. We maintain multi-layered technical safeguards:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1.5 pl-2 text-muted-foreground">
                <li><strong>256-Bit SSL/TLS Encryption:</strong> All data transmitted between your browser and our servers is secured with end-to-end transport encryption.</li>
                <li><strong>Anti-Scraping & Asset Protection:</strong> Proprietary formulations, technical dossiers, and client specifications are shielded with perimeter defense headers and anti-scraping controls.</li>
                <li><strong>Access Governance:</strong> Administrative databases are protected by strict role-based access control (RBAC), multi-factor authentication, and encrypted backups.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <Bell className="w-5 h-5 text-primary shrink-0" />
                3. Pharmacovigilance & Drug Safety Reporting
              </h2>
              <p className="text-sm text-muted-foreground">
                Information submitted through our <Link to="/pharmacovigilance" className="text-primary hover:underline font-medium">Pharmacovigilance</Link> portal is processed in strict compliance with the Central Drugs Standard Control Organisation (CDSCO), Pharmacovigilance Programme of India (PvPI), and international Good Pharmacovigilance Practices (GVP). Patient identifiers are pseudonymized, and safety records are preserved solely for public health vigilance and statutory regulatory filings.
              </p>
            </section>

            {/* Section 4 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <Eye className="w-5 h-5 text-primary shrink-0" />
                4. Cookies & Usage Analytics
              </h2>
              <p className="text-sm text-muted-foreground">
                We use essential cookies to ensure secure navigation, remember your preferences, and maintain session authenticity. We do not sell, rent, or lease personal visitor data to third-party data brokers or advertising networks.
              </p>
            </section>

            {/* Section 5 */}
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
                5. Legal Compliance & Rights under DPDP Act
              </h2>
              <p className="text-sm text-muted-foreground">
                In compliance with the Digital Personal Data Protection Act (DPDP) and international privacy frameworks, you hold the right to review, update, or request the deletion of your personal data submitted through non-statutory channels (e.g. sales inquiries or employment applications).
              </p>
            </section>

            {/* Section 6 - Contact */}
            <section className="space-y-3 border-t border-border/60 pt-6">
              <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-primary shrink-0" />
                6. Contact Our Grievance & Compliance Officer
              </h2>
              <p className="text-sm text-muted-foreground">
                For questions regarding this policy, data rights, or pharmacovigilance record handling, please reach out to our corporate office:
              </p>
              <div className="bg-muted/40 p-4 rounded-xl border border-border/60 text-sm space-y-1">
                <p className="font-semibold text-foreground">Unicure India Ltd — Corporate Grievance Officer</p>
                <p className="text-muted-foreground">C-21, 22 &amp; 23, Sector-3, Noida, Uttar Pradesh — 201301, India</p>
                <p className="text-muted-foreground">Email: <a href="mailto:unicure@unicureindia.com" className="text-primary hover:underline">unicure@unicureindia.com</a> | Tel: +91-120-4786786</p>
              </div>
            </section>

          </div>
        </ScrollReveal>
      </div>
    </SiteLayout>
  );
}
