import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Award, FileText, FileDown, ArrowDownToLine } from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Accreditations & Certifications — Unicure India Ltd" },
      {
        name: "description",
        content:
          "WHO cGMP, ISO and Form 25/26/28 approvals across Unicure India's Noida, Roorkee and Greater Noida units.",
      },
      { property: "og:title", content: "Certifications — Unicure India Ltd" },
      {
        property: "og:description",
        content: "Our accreditations across all three manufacturing units.",
      },
      { property: "og:url", content: "https://unicureindialtd.vercel.app/certifications" },
    ],
    links: [{ rel: "canonical", href: "https://unicureindialtd.vercel.app/certifications" }],
  }),
  component: CertificationsPage,
});

// Source: unicureindia.com — Our Accreditations page with working downloadable PDF links
const units = [
  {
    name: "Unit-I — Noida Sector-3",
    certs: [
      {
        name: "Form 26",
        href: "/downloads/form-26-unit1.pdf",
        downloadName: "Unicure_Unit_1_Form_26.pdf",
        size: "1.0 MB",
      },
      {
        name: "WHO cGMP Certificate",
        href: "/downloads/who-cgmp.pdf",
        downloadName: "Unicure_WHO_cGMP_Certificate.pdf",
        size: "265 KB",
      },
      {
        name: "ISO Certificate",
        href: "/downloads/iso-certificate.pdf",
        downloadName: "Unicure_ISO_Certificate.pdf",
        size: "293 KB",
      },
    ],
  },
  {
    name: "Unit-II — Roorkee",
    certs: [
      {
        name: "Form 25",
        href: "/downloads/form-25.pdf",
        downloadName: "Unicure_Unit_2_Form_25.pdf",
        size: "403 KB",
      },
      {
        name: "Form 28",
        href: "/downloads/form-28.pdf",
        downloadName: "Unicure_Unit_2_Form_28.pdf",
        size: "403 KB",
      },
      {
        name: "WHO GMP Certificate",
        href: "/downloads/who-gmp-roorkee.pdf",
        downloadName: "Unicure_Unit_2_WHO_GMP_Certificate.pdf",
        size: "1.6 MB",
      },
    ],
  },
  {
    name: "Unit-III — Greater Noida",
    certs: [
      {
        name: "Form 25",
        href: "/downloads/form-25.pdf",
        downloadName: "Unicure_Unit_3_Form_25.pdf",
        size: "403 KB",
      },
      {
        name: "Form 28",
        href: "/downloads/form-28.pdf",
        downloadName: "Unicure_Unit_3_Form_28.pdf",
        size: "403 KB",
      },
      {
        name: "WHO GMP Certificate",
        href: "/downloads/who-gmp-unit1.pdf",
        downloadName: "Unicure_Unit_3_WHO_GMP_Certificate.pdf",
        size: "350 KB",
      },
    ],
  },
];

function CertificationsPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our Accreditations"
        title="Held to the world's highest standards."
        subtitle="Every Unicure manufacturing unit operates under WHO-GMP approval and internationally recognised regulatory certifications."
      />
      <section className="py-24">
        <StaggerGrid className="container-x space-y-10">
          {units.map((u) => (
            <StaggerItem key={u.name}>
              <div className="rounded-3xl border border-border bg-white p-8 md:p-10 shadow-card hover:shadow-elegant transition-all">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                    <Award className="h-5 w-5" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">{u.name}</h2>
                </div>
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {u.certs.map((c) => (
                    <a
                      key={c.name}
                      href={c.href}
                      download={c.downloadName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/40 px-5 py-4 hover:bg-white hover:border-primary hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] transition-all cursor-pointer"
                      title={`Click to download ${c.name} (${c.size})`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileText className="h-5 w-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                          {c.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground group-hover:text-primary shrink-0 font-medium">
                        <span className="text-[11px] hidden sm:inline">{c.size}</span>
                        <ArrowDownToLine className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>
    </SiteLayout>
  );
}
