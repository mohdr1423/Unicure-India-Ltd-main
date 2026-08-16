import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import lab from "@/assets/lab-research.jpg";
import {
  Microscope,
  ShieldCheck,
  FlaskConical,
  BookOpenCheck,
  Quote,
  ArrowRight,
  TrendingUp,
  Award,
} from "lucide-react";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";

export const Route = createFileRoute("/quality")({
  head: () => ({
    meta: [
      { title: "Quality Assurance & R&D — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Multi-stage QA/QC, WHO-GMP compliance, and R&D-led product development at Unicure India Ltd under the leadership of Dr. Kashish Aziz.",
      },
      { property: "og:title", content: "Quality & R&D — Unicure India Ltd" },
      { property: "og:description", content: "Science-led pharmaceutical quality and compliance." },
      { property: "og:url", content: "/quality" },
    ],
    links: [{ rel: "canonical", href: "/quality" }],
  }),
  component: QualityPage,
});

const QUALITY_PRINCIPLES = [
  {
    icon: ShieldCheck,
    title: "GMP Compliance",
    desc: "Adherence to strict Good Manufacturing Practices in all processes",
  },
  {
    icon: Microscope,
    title: "Rigorous Testing",
    desc: "Comprehensive analytical testing at every production stage",
  },
  {
    icon: TrendingUp,
    title: "Continuous Improvement",
    desc: "Ongoing process optimization and quality enhancement",
  },
  {
    icon: Award,
    title: "Regulatory Excellence",
    desc: "Meeting and exceeding global regulatory standards",
  },
];

function QualityPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Quality & R&D"
        title="Quality Control & Quality Assurance"
        subtitle="Quality is the most important aspect of the company. Both QA and QC departments take proactive steps to ensure there are no defects before, during and after manufacturing."
      />

      {/* QA / QC Dual Pillars */}
      <section className="py-20 md:py-24 bg-background">
        <StaggerGrid className="container-x grid gap-8 md:grid-cols-2">
          <StaggerItem>
            <div className="rounded-3xl border border-border bg-white p-8 md:p-10 shadow-card hover:shadow-elegant transition-all h-full flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.25em] text-primary">QA</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold text-foreground">
                  Quality Assurance
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Quality Assurance involves the process of designing and includes the drafting and
                  implementation of SOPs (Standard Operating Procedures). It ensures the procedures
                  are in-line with prescribed guidelines and the end result is safe and effective. It
                  is a process-oriented step, and the team stays vigilant throughout — from the time
                  of validation of the product till the final output.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 text-xs font-semibold text-primary">
                Process Validation & SOP Governance
              </div>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="rounded-3xl border border-border bg-white p-8 md:p-10 shadow-card hover:shadow-elegant transition-all h-full flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.25em] text-primary">QC</div>
                <h2 className="mt-2 text-2xl md:text-3xl font-bold text-foreground">
                  Quality Control
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  Quality Control is the process of inspection carried out at every level — starting
                  from raw material procurement till the final product is packed for the market. It
                  involves conducting tests as per applicable Pharmacopoeias (IP, BP, USP) and checking
                  whether the in-process goods and final batches pass all prescribed parameters.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-border/60 text-xs font-semibold text-primary">
                Multi-Stage In-Process Testing & Release
              </div>
            </div>
          </StaggerItem>
        </StaggerGrid>
      </section>

      {/* Quality Manifesto & Leadership Spotlight */}
      <section className="py-20 bg-emerald-50/40 border-y border-emerald-200/60">
        <div className="container-x">
          <ScrollReveal>
            <div className="rounded-3xl bg-white border border-emerald-500/30 p-8 sm:p-12 shadow-card">
              <div className="grid gap-10 lg:grid-cols-[260px_1fr] items-center">
                <div className="flex flex-col items-center text-center">
                  <div className="relative aspect-[4/5] sm:aspect-square w-44 rounded-3xl overflow-hidden shadow-elegant ring-4 ring-emerald-600/80 bg-emerald-50 shrink-0">
                    <img
                      src="/images/executives/kashish-aziz.jpg"
                      alt="Dr. Kashish Aziz — Vice President of Quality Assurance"
                      className="h-full w-full object-cover object-top"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground">Dr. Kashish Aziz</h3>
                  <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mt-0.5">
                    Vice President of Quality Assurance
                  </div>
                  <Link
                    to="/leadership"
                    hash="kashish"
                    className="mt-4 text-xs font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
                  >
                    View Executive Profile <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                      <Quote className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                      Quality Leadership Perspective
                    </span>
                  </div>

                  <blockquote className="text-base sm:text-lg leading-relaxed text-foreground/85 italic border-l-4 border-emerald-600/40 pl-5 my-3">
                    "The entire pharmaceutical industry has a lot of work to do to restore public
                    health. Quality is never an accident; it is always the result of high intention,
                    sincere effort, intelligent direction and skillful execution. It represents the
                    wise choice of many alternatives. Only a healthy horse can pull a sturdy wagon.
                    Hence, my coherent message to team Unicure is: Quality or Quit!"
                  </blockquote>
                </div>
              </div>

              {/* Quality Principles 4-card grid */}
              <div className="mt-10 pt-8 border-t border-border/80">
                <div className="text-center max-w-xl mx-auto mb-8">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                    Framework
                  </span>
                  <h3 className="mt-1 text-2xl font-bold text-foreground">Our Quality Principles</h3>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {QUALITY_PRINCIPLES.map((qp, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl bg-emerald-50/60 border border-emerald-200/80 p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition"
                    >
                      <div>
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
                          <qp.icon className="h-5 w-5" />
                        </div>
                        <h4 className="mt-4 text-base font-bold text-foreground">{qp.title}</h4>
                        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {qp.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Regulatory Affairs */}
      <section className="py-20 bg-background">
        <div className="container-x">
          <ScrollReveal>
            <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] items-center rounded-3xl bg-secondary/50 border border-border p-8 sm:p-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                  Regulatory Affairs
                </span>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-foreground">
                  Ready dossiers for global registration
                </h2>
              </div>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                Our Regulatory Affairs department completes rigorous validation protocols, stability
                studies, and registration dossiers. We maintain ready CTDs / ACTDs / Dossiers for most
                of our molecules — including Cardio, NSAIDs, CNS, Anti-Infectives and more.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Research & Development Center */}
      <section className="py-20 md:py-24 bg-white border-t border-border">
        <div className="container-x grid gap-14 lg:grid-cols-2 items-center">
          <ScrollReveal variant="slide-left">
            <img
              src={lab}
              alt="Unicure Advanced R&D Laboratory"
              className="rounded-3xl shadow-elegant w-full object-cover"
              loading="lazy"
              width={1280}
              height={1280}
            />
          </ScrollReveal>
          <ScrollReveal variant="slide-right" delay={0.1}>
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Scientific Innovation
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Research & Development
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed text-base sm:text-lg">
                Our R&D centre houses formulation development, analytical R&D, and regulatory
                documentation teams — enabling us to develop custom products, optimize existing
                formulations, and support fast global market registrations.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {[
                  {
                    i: Microscope,
                    t: "Analytical R&D",
                    d: "HPLC, GC, UV, dissolution & stability studies.",
                  },
                  {
                    i: FlaskConical,
                    t: "Formulation",
                    d: "Solid, liquid, semi-solid & sterile development.",
                  },
                  {
                    i: ShieldCheck,
                    t: "Quality Assurance",
                    d: "SOP driven, audited, and continuously improved.",
                  },
                  {
                    i: BookOpenCheck,
                    t: "Regulatory Dossiers",
                    d: "Ready CTD/ACTD filings for 20+ countries.",
                  },
                ].map((c) => (
                  <div
                    key={c.t}
                    className="rounded-2xl bg-secondary/50 p-5 hover:bg-white border border-border/60 hover:shadow-card transition-all"
                  >
                    <c.i className="h-6 w-6 text-primary" />
                    <div className="mt-3 font-bold text-sm text-foreground">{c.t}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{c.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteLayout>
  );
}