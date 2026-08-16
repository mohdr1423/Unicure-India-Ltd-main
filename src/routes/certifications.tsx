import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Award, FileCheck2 } from "lucide-react";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";

export const Route = createFileRoute("/certifications")({
  head: () => ({
    meta: [
      { title: "Accreditations & Certifications — Unicure India Ltd" },
      { name: "description", content: "WHO cGMP, ISO and Form 25/26/28 approvals across Unicure India's Noida, Roorkee and Greater Noida units." },
      { property: "og:title", content: "Certifications — Unicure India Ltd" },
      { property: "og:description", content: "Our accreditations across all three manufacturing units." },
      { property: "og:url", content: "/certifications" },
    ],
    links: [{ rel: "canonical", href: "/certifications" }],
  }),
  component: CertificationsPage,
});

// Source: unicureindia.com — Our Accreditions page
const units = [
  {
    name: "Unit-I — Noida Sector-3",
    certs: ["Form 26", "WHO cGMP Certificate", "ISO Certificate"],
  },
  {
    name: "Unit-II — Roorkee",
    certs: ["Form 25", "Form 28", "WHO GMP Certificate"],
  },
  {
    name: "Unit-III — Greater Noida",
    certs: ["Form 25", "Form 28", "WHO GMP Certificate"],
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
                    <div key={c} className="flex items-center gap-3 rounded-2xl border border-border bg-secondary/40 px-5 py-4">
                      <FileCheck2 className="h-5 w-5 text-primary shrink-0" />
                      <span className="font-semibold text-sm">{c}</span>
                    </div>
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