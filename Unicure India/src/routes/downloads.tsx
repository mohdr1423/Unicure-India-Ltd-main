import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FileDown } from "lucide-react";
import { StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — Unicure India Ltd" },
      { name: "description", content: "Download the Unicure India company brochure, manufacturing licences, WHO-GMP and ISO certificates." },
      { property: "og:title", content: "Downloads — Unicure India Ltd" },
      { property: "og:description", content: "Company brochure and regulatory documents." },
      { property: "og:url", content: "/downloads" },
    ],
    links: [{ rel: "canonical", href: "/downloads" }],
  }),
  component: DownloadsPage,
});

// Local documents stored in /public/downloads/
const files = [
  {
    name: "Company Brochure",
    href: "/downloads/brochure.pdf",
    type: "PDF (19.3 MB)",
  },
  {
    name: "WHO GMP Certificate — Unit I",
    href: "/downloads/WHO_GMP_Certificate_Unit_1.pdf",
    type: "PDF (350 KB)",
  },
  {
    name: "WHO cGMP Certificate",
    href: "/downloads/WHO_cGMP_certificate.pdf",
    type: "PDF (265 KB)",
  },
  {
    name: "Manufacturing Licence — Unit I",
    href: "/downloads/MANUFACTURING_LICENSE_Unit1.pdf",
    type: "PDF (1.0 MB)",
  },
  {
    name: "Manufacturing Licence — Roorkee",
    href: "/downloads/MANUFACTURING_ROORKEE.pdf",
    type: "PDF (1.6 MB)",
  },
  {
    name: "Manufacturing Licence — Form 25",
    href: "/downloads/Mfg._license_form_25.pdf",
    type: "PDF (403 KB)",
  },
  {
    name: "Manufacturing Licence — Form 28",
    href: "/downloads/Mfg._license_form_28.pdf",
    type: "PDF (403 KB)",
  },
  {
    name: "ISO Certificate",
    href: "/downloads/NEW_ISO_VALIDITY_24.05.2023__1_.pdf",
    type: "PDF (293 KB)",
  },
];

function DownloadsPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Downloads"
        title="Company brochure & regulatory documents."
        subtitle="Manufacturing licences, WHO-GMP certificates and our latest company brochure — available for direct download."
      />
      <section className="py-24">
        <div className="container-x">
          <StaggerGrid className="grid gap-4 md:grid-cols-2">
            {files.map((f) => (
              <StaggerItem key={f.name}>
                <a
                  href={f.href}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center gap-5 rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition h-full"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                    <FileDown className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{f.name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{f.type}</div>
                  </div>
                  <div className="text-sm font-semibold text-primary group-hover:underline">
                    Download →
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>
    </SiteLayout>
  );
}