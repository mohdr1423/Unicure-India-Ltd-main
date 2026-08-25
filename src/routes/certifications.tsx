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
  Printer,
  Sparkles,
} from "lucide-react";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Our Accreditations & Certifications — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Official WHO-GMP certificates, Form 25, Form 28, Form 26, and ISO accreditations across Unicure India's Noida, Roorkee, and Greater Noida manufacturing plants. Available for instant download and verification.",
      },
      { property: "og:title", content: "Our Accreditations — Unicure India Ltd" },
      {
        property: "og:description",
        content:
          "Held to the world's highest standards. Every Unicure manufacturing unit operates under WHO-GMP approval and internationally recognised regulatory certifications.",
      },
      { property: "og:url", content: "/certifications" },
    ],
    links: [{ rel: "canonical", href: "/certifications" }],
  }),
  component: CertificationsPage,
});

type CertItem = {
  id: string;
  name: string;
  fullName: string;
  unit: string;
  fileUrl: string;
  size: string;
  authority: string;
  description: string;
};

type UnitData = {
  id: string;
  name: string;
  subtitle: string;
  certs: CertItem[];
};

// Exact 3 units & exact 3 certificates per unit as requested
const unitsData: UnitData[] = [
  {
    id: "unit-1",
    name: "Unit-I — Noida Sector-3",
    subtitle: "Plant C-21, 22 & 23, Sector-3, Noida (U.P.) • Established 1984",
    certs: [
      {
        id: "u1-form-26",
        name: "Form 26",
        fullName: "Manufacturing Licence — Form 26 (Unit-I)",
        unit: "Unit-I — Noida Sector-3",
        fileUrl: "/downloads/MANUFACTURING_LICENSE_Unit1.pdf",
        size: "1.0 MB",
        authority: "Food & Drug Administration (FDA) UP",
        description:
          "Official State FDA Form 26 manufacturing licence for Unit-I covering tablets, capsules, liquids, dry syrups and ointments.",
      },
      {
        id: "u1-who-cgmp",
        name: "WHO cGMP Certificate",
        fullName: "WHO cGMP Compliance Certificate",
        unit: "Unit-I — Noida Sector-3",
        fileUrl: "/downloads/WHO_cGMP_certificate.pdf",
        size: "265 KB",
        authority: "World Health Organization / State FDA",
        description:
          "Current Good Manufacturing Practice certificate validating cleanrooms, HVAC BMS, and quality validation protocols.",
      },
      {
        id: "u1-iso",
        name: "ISO Certificate",
        fullName: "ISO 9001:2015 Quality Certificate",
        unit: "Unit-I — Noida Sector-3",
        fileUrl: "/downloads/NEW_ISO_VALIDITY_24.05.2023__1_.pdf",
        size: "293 KB",
        authority: "International Organization for Standardization (ISO)",
        description:
          "Quality Management Systems standard for formulation development, analytical QA/QC, and pharmaceutical manufacturing.",
      },
    ],
  },
  {
    id: "unit-2",
    name: "Unit-II — Roorkee",
    subtitle: "Roorkee, Uttarakhand • High-Speed Solid & Liquid Plant",
    certs: [
      {
        id: "u2-form-25",
        name: "Form 25",
        fullName: "Manufacturing Licence — Form 25 (Roorkee)",
        unit: "Unit-II — Roorkee",
        fileUrl: "/downloads/Mfg._license_form_25.pdf",
        size: "403 KB",
        authority: "State Drug Licensing Authority Uttarakhand",
        description:
          "Licence Form 25 to manufacture for sale or distribution of drugs other than those specified in Schedule C, C(1) and X.",
      },
      {
        id: "u2-form-28",
        name: "Form 28",
        fullName: "Manufacturing Licence — Form 28 (Roorkee)",
        unit: "Unit-II — Roorkee",
        fileUrl: "/downloads/Mfg._license_form_28.pdf",
        size: "403 KB",
        authority: "State Drug Licensing Authority Uttarakhand",
        description:
          "Licence Form 28 to manufacture for sale or distribution of specialized drugs specified in Schedule C and C(1).",
      },
      {
        id: "u2-who-gmp",
        name: "WHO GMP Certificate",
        fullName: "WHO-GMP Certificate — Roorkee Facility",
        unit: "Unit-II — Roorkee",
        fileUrl: "/downloads/MANUFACTURING_ROORKEE.pdf",
        size: "1.6 MB",
        authority: "Directorate of Health & Family Welfare / FDA",
        description:
          "Official WHO-GMP and manufacturing approval validating production standards and quality systems for Roorkee Unit-II.",
      },
    ],
  },
  {
    id: "unit-3",
    name: "Unit-III — Greater Noida",
    subtitle: "Ecotech Extension, Greater Noida (U.P.) • Modern PIC/S Standard Plant",
    certs: [
      {
        id: "u3-form-25",
        name: "Form 25",
        fullName: "Manufacturing Licence — Form 25 (Greater Noida)",
        unit: "Unit-III — Greater Noida",
        fileUrl: "/downloads/Mfg._license_form_25.pdf",
        size: "403 KB",
        authority: "State Licensing Authority & FDA India",
        description:
          "Licence to manufacture for sale or distribution of general pharmaceutical formulations and solid oral dosage forms.",
      },
      {
        id: "u3-form-28",
        name: "Form 28",
        fullName: "Manufacturing Licence — Form 28 (Greater Noida)",
        unit: "Unit-III — Greater Noida",
        fileUrl: "/downloads/Mfg._license_form_28.pdf",
        size: "403 KB",
        authority: "State Licensing Authority & FDA India",
        description:
          "Licence to manufacture for sale or distribution of Schedule C and C(1) advanced formulations.",
      },
      {
        id: "u3-who-gmp",
        name: "WHO GMP Certificate",
        fullName: "WHO-GMP Certificate — Unit III",
        unit: "Unit-III — Greater Noida",
        fileUrl: "/downloads/WHO_GMP_Certificate_Unit_1.pdf",
        size: "350 KB",
        authority: "World Health Organization Compliance Board",
        description:
          "WHO-GMP certificate verifying PIC/S design, Class 100,000 cleanrooms, and automated closed-loop processes.",
      },
    ],
  },
];

export default function CertificationsPage() {
  const [activeCert, setActiveCert] = useState<CertItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  // Trigger download and display certificate in viewer immediately
  const handleCertClick = (cert: CertItem) => {
    // 1. Programmatically trigger browser download
    const link = document.createElement("a");
    link.href = cert.fileUrl;
    link.download = `${cert.name.replace(/[^a-zA-Z0-9_-]/g, "_")}_${cert.unit.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 2. Open the document viewer modal so the visitor can view it on screen
    setActiveCert(cert);
    setIsModalOpen(true);

    // Show temporary toast notification
    setDownloadSuccessToast(cert.name);
    setTimeout(() => setDownloadSuccessToast(null), 4000);
  };

  const handlePrint = () => {
    if (activeCert) {
      window.open(activeCert.fileUrl, "_blank")?.print();
    }
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Our Accreditations"
        title="Held to the world's highest standards."
        subtitle="Every Unicure manufacturing unit operates under WHO-GMP approval and internationally recognised regulatory certifications."
      />

      {/* Download Feedback Banner if triggered */}
      {downloadSuccessToast && (
        <div className="bg-emerald-600 text-white text-center py-2.5 px-4 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2 duration-300 sticky top-18 z-30 shadow-md">
          <CheckCircle2 className="h-4 w-4" />
          <span>
            <strong>{downloadSuccessToast}</strong> is downloading to your device and opened in the viewer below!
          </span>
        </div>
      )}

      {/* Main Accreditations Section */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container-x max-w-6xl space-y-16">
          {unitsData.map((unit) => (
            <ScrollReveal key={unit.id}>
              <div className="rounded-3xl border border-border bg-white p-6 sm:p-10 md:p-12 shadow-card hover:shadow-elegant transition-all duration-300">
                {/* Unit Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border/80">
                  <div className="flex items-center gap-3.5">
                    <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow shrink-0">
                      <Award className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                        {unit.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                        {unit.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="self-start sm:self-auto rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-3.5 py-1 text-xs font-bold flex items-center gap-1.5 shrink-0">
                    <ShieldCheck className="h-4 w-4" /> Approved & Valid
                  </span>
                </div>

                {/* 3 Interactive Certificate Cards */}
                <div className="mt-8 grid gap-4 sm:gap-6 sm:grid-cols-3">
                  {unit.certs.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleCertClick(c)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleCertClick(c);
                        }
                      }}
                      className="group relative flex flex-col justify-between rounded-2xl border-2 border-border/90 bg-secondary/40 p-5 sm:p-6 hover:bg-white hover:border-primary hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 cursor-pointer select-none"
                    >
                      <div>
                        {/* Top Icon & Badge */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <FileCheck2 className="h-5 w-5" />
                          </div>
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                            <Download className="h-3 w-3" /> PDF ({c.size})
                          </span>
                        </div>

                        {/* Certificate Name */}
                        <h3 className="mt-4 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                          {c.name}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                          {c.description}
                        </p>
                      </div>

                      {/* Bottom Call to Action */}
                      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                        <span className="flex items-center gap-1.5 group-hover:underline">
                          <FileDown className="h-4 w-4" /> Download & View
                        </span>
                        <span className="text-muted-foreground group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}

          {/* Bottom Help & Downloads Footer Strip */}
          <div className="rounded-3xl bg-secondary/70 border border-border p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <h3 className="text-lg font-bold text-foreground">
                Looking for Corporate Brochures & Additional Documents?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Explore our full downloads center for product catalogs, facility maps, and regulatory filing checklists.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to="/downloads"
                className="rounded-full bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-primary/90 transition shadow-sm"
              >
                Go to Downloads Center →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Certificate Viewer & Download Modal */}
      {activeCert && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[92vh] w-[95vw] sm:w-[90vw] p-0 overflow-hidden flex flex-col rounded-3xl border border-border shadow-2xl bg-background">
            {/* Modal Header */}
            <div className="bg-[color:var(--brand-blue-dark)] text-white p-5 sm:p-6 border-b-2 border-[#C8102E] shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-6">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8102E] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                      <ShieldCheck className="h-3.5 w-3.5" /> Official Certificate
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-300 font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified Document
                    </span>
                  </div>
                  <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1.5 truncate">
                    {activeCert.fullName}
                  </DialogTitle>
                  <DialogDescription className="text-white/80 text-xs sm:text-sm flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 text-red-400" />
                      <strong>{activeCert.unit}</strong>
                    </span>
                    <span>•</span>
                    <span>Issuing Authority: {activeCert.authority}</span>
                  </DialogDescription>
                </div>

                {/* Direct Download Button */}
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = activeCert.fileUrl;
                      link.download = `${activeCert.name}_${activeCert.unit}.pdf`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="rounded-xl bg-[#C8102E] text-white hover:bg-red-700 shadow-md font-semibold text-xs sm:text-sm h-10 px-4 flex items-center gap-2 cursor-pointer"
                  >
                    <FileDown className="h-4 w-4" /> Download PDF ({activeCert.size})
                  </Button>
                  <a
                    href={activeCert.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                    title="Open in new tab"
                    aria-label="Open in new tab"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Document Details Strip */}
            <div className="bg-secondary/60 px-5 py-2.5 border-b border-border text-xs sm:text-sm flex items-center justify-between gap-3 shrink-0">
              <div className="text-muted-foreground truncate">
                <strong>Description:</strong> {activeCert.description}
              </div>
              <button
                onClick={handlePrint}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
            </div>

            {/* Embedded PDF Viewer */}
            <div className="flex-1 bg-slate-100 p-2 sm:p-4 overflow-hidden min-h-[380px] sm:min-h-[480px] flex flex-col">
              <div className="w-full flex-1 rounded-2xl overflow-hidden border border-border shadow-inner bg-white relative">
                <iframe
                  src={`${activeCert.fileUrl}#toolbar=1&navpanes=0`}
                  title={activeCert.fullName}
                  className="w-full h-full min-h-[380px] sm:min-h-[480px] border-0"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-border flex items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-muted-foreground hidden sm:block">
                Official document maintained by Unicure India Ltd Quality Assurance Department.
              </div>
              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border-border px-5 text-xs sm:text-sm cursor-pointer"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = activeCert.fileUrl;
                    link.download = `${activeCert.name}_${activeCert.unit}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="rounded-xl bg-[color:var(--brand-blue-dark)] text-white hover:bg-slate-900 px-6 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <FileDown className="h-4 w-4" /> Download PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </SiteLayout>
  );
}