import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Quote, ArrowRight, Sparkles, Building2, Globe2 } from "lucide-react";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import { getLeaderById, getOtherLeaders } from "@/data/leadership";

export const Route = createFileRoute("/md-message")({
  head: () => ({
    meta: [
      { title: "Managing Director's Message — Mr. Abdul Mateen | Unicure India Ltd" },
      {
        name: "description",
        content:
          "Read the official message from Mr. Abdul Mateen, Founder & Managing Director of Unicure India Ltd, reflecting on 40 years of pharmaceutical manufacturing.",
      },
      { property: "og:title", content: "MD's Message — Mr. Abdul Mateen | Unicure India Ltd" },
      {
        property: "og:description",
        content:
          "A personal message from Mr. Abdul Mateen, Founder & Managing Director of Unicure India Ltd.",
      },
      { property: "og:url", content: "/md-message" },
    ],
    links: [{ rel: "canonical", href: "/md-message" }],
  }),
  component: MDMessagePage,
});

function MDMessagePage() {
  const mateen = getLeaderById("abdul-mateen")!;
  const otherLeaders = getOtherLeaders("abdul-mateen");

  return (
    <SiteLayout>
      {/* Page Hero */}
      <PageHero
        eyebrow="Director's Desk"
        title="From the Desk of Mr. Abdul Mateen"
        subtitle="Founder & Managing Director, Unicure India Ltd."
      />

      {/* Main MD Message Content Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-[320px_1fr] items-start max-w-6xl mx-auto">
            {/* MD Portrait Card */}
            <ScrollReveal variant="slide-left">
              <div className="rounded-3xl bg-white border border-border/80 p-6 shadow-card text-center sm:text-left">
                <div className="relative aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden shadow-elegant ring-4 ring-[#C8102E]/80 bg-secondary">
                  <img
                    src={mateen.photo}
                    alt={mateen.altText}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    loading="eager"
                  />
                </div>
                <div className="mt-4 h-1 w-16 rounded-full bg-[#C8102E]" />
                <h2 className="mt-4 text-xl sm:text-2xl font-bold text-foreground">
                  {mateen.name}
                </h2>
                <div className="text-sm font-semibold text-primary mt-0.5">
                  {mateen.designation}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Founder, Unicure India Ltd (Est. 1984)
                </div>

                <div className="mt-6 pt-5 border-t border-border/60 space-y-2.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    <span>3 WHO-GMP Manufacturing Plants</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-primary shrink-0" />
                    <span>Exports to 20+ Global Markets</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Message Body */}
            <ScrollReveal variant="slide-right" delay={0.1}>
              <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-10 shadow-card space-y-6">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary shrink-0">
                    <Quote className="h-6 w-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                      Official Statement
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                      Four Decades of Purpose, Quality & Growth
                    </h3>
                  </div>
                </div>

                {/* Paragraph 1 */}
                <p className="text-base sm:text-lg leading-relaxed text-foreground/85">
                  "When I look back upon the last 4 decades, I feel proud to observe
                  the heights Unicure as a Company has achieved in the field of
                  pharmaceuticals manufacturing and innovations. With joint dedicated
                  endeavours from our team, we have realized the sole aim with which
                  the company was established - to serve the country and mankind at
                  large."
                </p>

                {/* Paragraph 2 */}
                <p className="text-base sm:text-lg leading-relaxed text-foreground/85">
                  "Integrity and ingenuity are the strength and core values of
                  Unicure. By upholding these principles throughout the decades, we
                  simultaneously function for the growth and value creation of our
                  stakeholders. Working aggressively towards exports, Unicure is
                  marching forward steadfastly into a brighter and wider horizon
                  beyond the bounds of our Country."
                </p>

                {/* Visually Separated Robert Frost Quote Card */}
                <div className="mt-8 rounded-2xl bg-secondary/50 border border-border/80 p-6 flex items-start gap-4 shadow-sm">
                  <Sparkles className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Inspirational Philosophy (Robert Frost)
                    </div>
                    <blockquote className="mt-2 text-base sm:text-lg font-semibold text-primary italic">
                      "I have promises to keep and miles to go before I sleep."
                    </blockquote>
                  </div>
                </div>

                {/* Action Links */}
                <div className="pt-4 flex flex-wrap gap-4">
                  <Link
                    to="/leadership"
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition"
                  >
                    Meet Executive Leadership <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3.5 text-sm font-semibold text-foreground/85 hover:bg-secondary transition"
                  >
                    Our Four-Decade Journey
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* OTHER EXECUTIVE LEADERSHIP CARDS (CENTRALIZED DATA)          */}
      {/* ============================================================ */}
      <section className="py-20 bg-secondary/40 border-t border-border">
        <div className="container-x">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Executive Team
              </span>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Other Executive Leaders
              </h2>
              <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-gradient-brand" />
            </div>
          </ScrollReveal>

          <StaggerGrid className="grid gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
            {otherLeaders.map((exec) => (
              <StaggerItem key={exec.id}>
                <article className="group flex flex-col rounded-3xl bg-white border border-border p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 h-full justify-between">
                  <div>
                    <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-secondary shadow-sm mb-5">
                      <img
                        src={exec.photo}
                        alt={exec.altText}
                        className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-primary">
                      {exec.designation}
                    </div>
                    <h3 className="mt-1 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {exec.name}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {exec.shortBio}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60">
                    <Link
                      to={exec.href as any}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                    >
                      Read Full Profile <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>
    </SiteLayout>
  );
}