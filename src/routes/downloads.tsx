import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import {
  FileDown,
  Eye,
  ShieldCheck,
  Award,
  FileCheck2,
  BookOpen,
  Building2,
  ExternalLink,
} from "lucide-react";
import { StaggerGrid, StaggerItem, ScrollReveal } from "@/components/site/ScrollReveal";
import { Button } from "@/components/ui/button";
import {
  CertificateViewerModal,
  type CertificateDoc,
} from "@/components/site/CertificateViewerModal";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — Regulatory Licences, WHO-GMP & Brochure — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Download official Unicure India company brochure, Form 25 and Form 28 manufacturing licences, WHO-GMP certificates, and ISO compliance documents.",
      },
      { property: "og:title", content: "Downloads — Unicure India Ltd" },
      {
        property: "og:description",
        content:
          "Official downloadable company brochure, manufacturing licences, and regulatory certifications.",
      },
      { property: "og:url", content: "https://unicureindialtd.vercel.app/downloads" },
    ],
    links: [{ rel: "canonical", href: "https://unicureindialtd.vercel.app/downloads" }],
  }),
  component: DownloadsPage,
});

type DownloadItem = {
  id: string;
  name: string;
  category: "brochure" | "licence" | "gmp" | "iso";
  categoryLabel: string;
  unit?: string;
  href: string;
  size: string;
  desc: string;
  certDoc?: CertificateDoc;
};

const DOWNLOAD_ITEMS: DownloadItem[] = [
  {
    id: "brochure",
    name: "Unicure India — Corporate Brochure",
    category: "brochure",
    categoryLabel: "Company Brochure",
    unit: "All Facilities (Noida, Roorkee, Greater Noida)",
    href: "/downloads/brochure.pdf",
    size: "PDF (19.3 MB)",
    desc: "Comprehensive overview of Unicure India's manufacturing units, formulation capabilities, therapeutic segments, R&D laboratories, and global export presence.",
    certDoc: {
      id: "brochure",
      name: "Unicure India — Corporate Brochure",
      unit: "Corporate Headquarters & Manufacturing Units",
      category: "compliance",
      fileUrl: "/downloads/brochure.pdf",
      fileSize: "19.3 MB",
      issuingAuthority: "Unicure India Ltd Corporate Desk",
      description: "Official Corporate Presentation & Capabilities Catalog",
    },
  },
  {
    id: "form-25",
    name: "Manufacturing Licence — Form 25",
    category: "licence",
    categoryLabel: "Drug Licence",
    unit: "Unit-I, Unit-II & Unit-III",
    href: "/downloads/Mfg._license_form_25.pdf",
    size: "PDF (403 KB)",
    desc: "Official drug manufacturing licence Form 25 granted by the State Licensing Authority for non-Schedule X pharmaceutical dosage forms.",
    certDoc: {
      id: "form-25",
      name: "Manufacturing Licence — Form 25",
      unit: "Manufacturing Facilities (Unit-I, Unit-II & Unit-III)",
      category: "licence",
      fileUrl: "/downloads/Mfg._license_form_25.pdf",
      fileSize: "403 KB",
      issuingAuthority: "State Licensing Authority & FDA India",
      description:
        "Form 25 licence for commercial production of general pharmaceutical formulations.",
    },
  },
  {
    id: "form-28",
    name: "Manufacturing Licence — Form 28",
    category: "licence",
    categoryLabel: "Drug Licence",
    unit: "Unit-I, Unit-II & Unit-III",
    href: "/downloads/Mfg._license_form_28.pdf",
    size: "PDF (403 KB)",
    desc: "Official drug manufacturing licence Form 28 for specialized formulations specified in Schedule C and Schedule C(1).",
    certDoc: {
      id: "form-28",
      name: "Manufacturing Licence — Form 28",
      unit: "Manufacturing Facilities (Unit-I, Unit-II & Unit-III)",
      category: "licence",
      fileUrl: "/downloads/Mfg._license_form_28.pdf",
      fileSize: "403 KB",
      issuingAuthority: "State Licensing Authority & FDA India",
      description: "Form 28 licence for Schedule C & C(1) drug formulations.",
    },
  },
  {
    id: "who-gmp-unit-1",
    name: "WHO-GMP Certificate — Unit I",
    category: "gmp",
    categoryLabel: "WHO-GMP Certificate",
    unit: "Unit-I (Noida, Sector-3)",
    href: "/downloads/WHO_GMP_Certificate_Unit_1.pdf",
    size: "PDF (350 KB)",
    desc: "World Health Organization Good Manufacturing Practices (WHO-GMP) compliance certificate for Unit-I formulation operations.",
    certDoc: {
      id: "who-gmp-unit-1",
      name: "WHO-GMP Certificate — Unit I",
      unit: "Unit-I — Noida Sector-3 (U.P.)",
      category: "gmp",
      fileUrl: "/downloads/WHO_GMP_Certificate_Unit_1.pdf",
      fileSize: "350 KB",
      issuingAuthority: "World Health Organization & State FDA",
      description: "Certificate of Good Manufacturing Practices for Unit-I.",
    },
  },
  {
    id: "who-cgmp",
    name: "WHO cGMP Certificate",
    category: "gmp",
    categoryLabel: "WHO-GMP Certificate",
    unit: "All Manufacturing Blocks",
    href: "/downloads/WHO_cGMP_certificate.pdf",
    size: "PDF (265 KB)",
    desc: "Certificate of current Good Manufacturing Practices (cGMP) confirming continuous quality assurance across all manufacturing units.",
    certDoc: {
      id: "who-cgmp",
      name: "WHO cGMP Certificate",
      unit: "Manufacturing Operations",
      category: "gmp",
      fileUrl: "/downloads/WHO_cGMP_certificate.pdf",
      fileSize: "265 KB",
      issuingAuthority: "Drug Control Department & WHO Compliance Panel",
      description: "Current Good Manufacturing Practices (cGMP) compliance certificate.",
    },
  },
  {
    id: "mfg-license-unit1",
    name: "Manufacturing Licence (Form 26) — Unit I",
    category: "licence",
    categoryLabel: "Drug Licence",
    unit: "Unit-I (Noida, Sector-3)",
    href: "/downloads/MANUFACTURING_LICENSE_Unit1.pdf",
    size: "PDF (1.0 MB)",
    desc: "Official State FDA Form 26 manufacturing licence for Unit-I covering tablets, capsules, liquid orals, ointments, and dry syrups.",
    certDoc: {
      id: "mfg-license-unit1",
      name: "Manufacturing Licence (Form 26) — Unit I",
      unit: "Unit-I — Noida Sector-3 (U.P.)",
      category: "licence",
      fileUrl: "/downloads/MANUFACTURING_LICENSE_Unit1.pdf",
      fileSize: "1.0 MB",
      issuingAuthority: "Food & Drug Administration UP",
      description: "Form 26 manufacturing license for Unit-I operations.",
    },
  },
  {
    id: "mfg-license-roorkee",
    name: "Manufacturing Licence & WHO-GMP — Roorkee",
    category: "licence",
    categoryLabel: "Drug Licence & GMP",
    unit: "Unit-II (Roorkee, Uttarakhand)",
    href: "/downloads/MANUFACTURING_ROORKEE.pdf",
    size: "PDF (1.6 MB)",
    desc: "Official State Drug Controller and WHO-GMP manufacturing licence documentation for Roorkee Unit-II.",
    certDoc: {
      id: "mfg-license-roorkee",
      name: "Manufacturing Licence & WHO-GMP — Roorkee",
      unit: "Unit-II — Roorkee (Uttarakhand)",
      category: "licence",
      fileUrl: "/downloads/MANUFACTURING_ROORKEE.pdf",
      fileSize: "1.6 MB",
      issuingAuthority: "State Drug Controller Uttarakhand",
      description: "Roorkee plant manufacturing licence and GMP compliance certificate.",
    },
  },
  {
    id: "iso-certificate",
    name: "ISO 9001:2015 Quality Certificate",
    category: "iso",
    categoryLabel: "ISO Accreditation",
    unit: "Corporate & Manufacturing Operations",
    href: "/downloads/NEW_ISO_VALIDITY_24.05.2023__1_.pdf",
    size: "PDF (293 KB)",
    desc: "International Organization for Standardization (ISO) certificate for pharmaceutical formulation, development, QA/QC testing, and supply chain governance.",
    certDoc: {
      id: "iso-certificate",
      name: "ISO 9001:2015 Quality Certificate",
      unit: "Unicure India Ltd Operations",
      category: "iso",
      fileUrl: "/downloads/NEW_ISO_VALIDITY_24.05.2023__1_.pdf",
      fileSize: "293 KB",
      issuingAuthority: "International Organization for Standardization (ISO)",
      description: "Quality Management Systems standard certification.",
    },
  },
];

export default function DownloadsPage() {
  const [filter, setFilter] = useState<string>("all");
  const [activeCert, setActiveCert] = useState<CertificateDoc | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenViewer = (cert: CertificateDoc) => {
    setActiveCert(cert);
    setIsModalOpen(true);
  };

  const handleDirectDownload = (e: React.MouseEvent, item: DownloadItem) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = item.href;
    link.download = item.name.replace(/[^a-zA-Z0-9_-]/g, "_") + ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredItems = DOWNLOAD_ITEMS.filter((item) => {
    if (filter === "all") return true;
    return item.category === filter;
  });

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Download Center"
        title="Company brochure & regulatory documents."
        subtitle="Official manufacturing licences (Form 25, Form 28, Form 26), WHO-GMP certificates, ISO accreditations, and our latest corporate brochure — available for instant online preview and direct download."
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container-x space-y-10">
          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-secondary/60 border border-border">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1 hidden sm:inline">
                Category:
              </span>
              {[
                { id: "all", label: "All Files (8)" },
                { id: "licence", label: "Form 25 & 28 Licences" },
                { id: "gmp", label: "WHO-GMP Certificates" },
                { id: "iso", label: "ISO Certs" },
                { id: "brochure", label: "Company Brochure" },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFilter(c.id)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                    filter === c.id
                      ? "bg-primary text-white shadow-sm"
                      : "bg-white text-foreground/80 hover:bg-slate-100 border border-border/80"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-muted-foreground">
              Showing <strong>{filteredItems.length}</strong> official documents
            </div>
          </div>

          {/* Download Grid */}
          <StaggerGrid className="grid gap-6 md:grid-cols-2">
            {filteredItems.map((item) => (
              <StaggerItem key={item.id}>
                <div
                  onClick={() => item.certDoc && handleOpenViewer(item.certDoc)}
                  className="group flex flex-col justify-between rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 h-full cursor-pointer"
                >
                  <div>
                    {/* Header Pill & Icon */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                        {item.category === "brochure" ? (
                          <BookOpen className="h-6 w-6" />
                        ) : item.category === "gmp" ? (
                          <ShieldCheck className="h-6 w-6" />
                        ) : item.category === "iso" ? (
                          <Award className="h-6 w-6" />
                        ) : (
                          <FileCheck2 className="h-6 w-6" />
                        )}
                      </div>
                      <span className="rounded-full bg-secondary px-3 py-1 text-[11px] font-bold text-foreground/80 border border-border/60 uppercase tracking-wider">
                        {item.categoryLabel}
                      </span>
                    </div>

                    {/* Title & Unit */}
                    <h3 className="mt-5 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    {item.unit && (
                      <div className="text-xs font-semibold text-primary/90 mt-1 flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5" />
                        <span>{item.unit}</span>
                      </div>
                    )}

                    <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Footer Actions */}
                  <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
                    <span className="text-xs font-semibold text-muted-foreground">{item.size}</span>

                    <div className="flex items-center gap-2">
                      {item.certDoc && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenViewer(item.certDoc!)}
                          className="rounded-xl border-border hover:bg-secondary text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5" /> Preview
                        </Button>
                      )}

                      <Button
                        size="sm"
                        onClick={(e) => handleDirectDownload(e, item)}
                        className="rounded-xl bg-primary text-white hover:bg-primary/90 text-xs font-semibold flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <FileDown className="h-3.5 w-3.5" /> Download
                      </Button>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          {/* Direct Link to Unit Accreditations */}
          <div className="rounded-3xl bg-secondary/70 border border-border p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-lg font-bold text-foreground">
                Looking for Unit-specific Compliance Overviews?
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Explore our full accreditations page featuring unit-by-unit regulatory approvals for
                Noida, Roorkee, and Greater Noida.
              </p>
            </div>
            <Link
              to="/certifications"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs sm:text-sm font-semibold text-white hover:bg-primary/90 transition shadow-sm shrink-0"
            >
              View Accreditations by Plant →
            </Link>
          </div>
        </div>
      </section>

      {/* Interactive Certificate Viewer Modal */}
      <CertificateViewerModal cert={activeCert} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </SiteLayout>
  );
}
