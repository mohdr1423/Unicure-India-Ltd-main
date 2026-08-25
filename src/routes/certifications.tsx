import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import {
  Award,
  FileCheck2,
  FileDown,
  Eye,
  ShieldCheck,
  Building2,
  CheckCircle2,
  ExternalLink,
  Download,
  Factory,
} from "lucide-react";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import { Button } from "@/components/ui/button";
import {
  UNIT_CERTIFICATIONS,
  type UnitCertifications,
} from "@/data/certifications";
import {
  CertificateViewerModal,
  type CertificateDoc,
} from "@/components/site/CertificateViewerModal";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Accreditations & Certifications — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Download and preview official WHO-GMP certificates, Form 25, Form 28, and ISO accreditations across Unicure India's Noida, Roorkee, and Greater Noida manufacturing plants.",
      },
      { property: "og:title", content: "Accreditations & Certifications — Unicure India Ltd" },
      {
        property: "og:description",
        content:
          "Official regulatory licences and WHO-GMP certificates for Unit-I, Unit-II, and Unit-III available for instant preview and download.",
      },
      { property: "og:url", content: "/certifications" },
    ],
    links: [{ rel: "canonical", href: "/certifications" }],
  }),
  component: CertificationsPage,
});

export default function CertificationsPage() {
  const [selectedUnit, setSelectedUnit] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeCert, setActiveCert] = useState<CertificateDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenViewer = (cert: CertificateDoc) => {
    setActiveCert(cert);
    setIsModalOpen(true);
  };

  const handleDirectDownload = (e: React.MouseEvent, cert: CertificateDoc) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = cert.fileUrl;
    link.download = cert.name.replace(/[^a-zA-Z0-9_-]/g, "_") + ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredUnits = UNIT_CERTIFICATIONS.filter((u) => {
    if (selectedUnit !== "all" && u.id !== selectedUnit) return false;
    return true;
  }).map((u) => ({
    ...u,
    certificates: u.certificates.filter((c) => {
      if (selectedCategory === "all") return true;
      if (selectedCategory === "licence") return c.category === "licence";
      if (selectedCategory === "gmp") return c.category === "gmp";
      if (selectedCategory === "iso") return c.category === "iso";
      return true;
    }),
  })).filter((u) => u.certificates.length > 0);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our Accreditations & Licences"
        title="Held to the world's highest regulatory standards."
        subtitle="Every Unicure manufacturing facility operates under valid WHO-GMP certificates, state manufacturing licences (Form 25, Form 28, Form 26), and ISO certifications. All documents are available for instant online preview and verified download."
      />

      {/* Quick Summary Highlights Banner */}
      <section className="py-10 bg-secondary/50 border-b border-border">
        <div className="container-x">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-primary">WHO-GMP</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                All 3 Plants Approved
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-primary">Form 25 & 28</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Manufacturing Licences
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-primary">ISO 9001:2015</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Quality Management
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-border shadow-xs">
              <div className="text-2xl sm:text-3xl font-bold text-primary">20+ Countries</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                Global CTD/ACTD Dossiers
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Content Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-x space-y-10">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-secondary/60 border border-border">
            {/* Unit Selection Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1 hidden sm:inline">
                Unit:
              </span>
              {[
                { id: "all", label: "All 3 Units" },
                { id: "unit-1", label: "Unit-I (Noida)" },
                { id: "unit-2", label: "Unit-II (Roorkee)" },
                { id: "unit-3", label: "Unit-III (Greater Noida)" },
              ].map((u) => (
                <button
                  key={u.id}
                  onClick={() => setSelectedUnit(u.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    selectedUnit === u.id
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white text-foreground/80 hover:bg-slate-100 border border-border/80"
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full md:w-auto justify-start md:justify-end">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1 hidden sm:inline">
                Type:
              </span>
              {[
                { id: "all", label: "All Docs" },
                { id: "licence", label: "Form 25 / 28 Licences" },
                { id: "gmp", label: "WHO-GMP" },
                { id: "iso", label: "ISO Certs" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                    selectedCategory === c.id
                      ? "bg-[color:var(--brand-blue-dark)] text-white shadow-sm"
                      : "bg-white text-foreground/80 hover:bg-slate-100 border border-border/80"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Unit Sections */}
          <div className="space-y-16">
            {filteredUnits.map((u) => (
              <div key={u.id} className="space-y-6">
                {/* Unit Header Banner */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-border/80">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary">
                        <Factory className="h-3.5 w-3.5" /> Manufacturing Facility
                      </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mt-1">
                      {u.name}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {u.location} • <span className="font-medium text-foreground/80">{u.subtitle}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {u.certificates.length} Verified Certificates
                    </span>
                  </div>
                </div>

                {/* Certificates Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {u.certificates.map((cert) => (
                    <div
                      key={cert.id}
                      onClick={() => handleOpenViewer(cert)}
                      className="group flex flex-col justify-between rounded-3xl border border-border bg-white p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                    >
                      <div>
                        {/* Card Top Pill & Icon */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300 shrink-0">
                            <Award className="h-6 w-6" />
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                              cert.category === "gmp"
                                ? "bg-emerald-100 text-emerald-800"
                                : cert.category === "licence"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {cert.category.toUpperCase()}
                          </span>
                        </div>

                        {/* Title & Description */}
                        <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {cert.name}
                        </h3>
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {cert.description}
                        </p>

                        <div className="mt-4 pt-3 border-t border-border/60 text-[11px] text-muted-foreground flex items-center justify-between">
                          <span>{cert.issuingAuthority}</span>
                          <span className="font-semibold text-foreground/80">PDF ({cert.fileSize})</span>
                        </div>
                      </div>

                      {/* Action Buttons Bar */}
                      <div className="mt-5 pt-3 border-t border-border flex items-center justify-between gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenViewer(cert)}
                          className="text-xs font-semibold text-primary hover:text-primary hover:bg-primary/10 p-0 h-auto flex items-center gap-1.5"
                        >
                          <Eye className="h-3.5 w-3.5" /> View Certificate
                        </Button>

                        <Button
                          size="sm"
                          onClick={(e) => handleDirectDownload(e, cert)}
                          className="rounded-xl bg-primary text-white hover:bg-primary/90 h-8 px-3 text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <FileDown className="h-3.5 w-3.5" /> Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Regulatory Support CTA Card */}
          <div className="rounded-3xl bg-gradient-brand text-white p-8 sm:p-12 shadow-elegant flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
            <div className="space-y-3 max-w-2xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white">
                <ShieldCheck className="h-4 w-4" /> Global Dossiers & Regulatory Assistance
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Need CTD/ACTD Dossiers or Certified Notarized Copies?
              </h3>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light">
                Our in-house Regulatory Affairs and Quality Assurance team provides country-specific drug registration documentation, stability validation data, and Certificate of Pharmaceutical Product (COPP) files.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
              <Link
                to="/contact"
                className="w-full sm:w-auto text-center rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[color:var(--brand-blue-dark)] hover:bg-white/95 transition shadow-md hover:scale-105"
              >
                Contact QA Desk
              </Link>
              <Link
                to="/downloads"
                className="w-full sm:w-auto text-center rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white hover:bg-white/20 transition"
              >
                All Downloads
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Certificate Viewer Modal */}
      <CertificateViewerModal
        cert={activeCert}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </SiteLayout>
  );
}