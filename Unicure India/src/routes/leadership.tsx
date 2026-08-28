import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import {
  Quote,
  ArrowRight,
  ShieldCheck,
  Microscope,
  TrendingUp,
  Award,
  Linkedin,
  Mail,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import { EXECUTIVE_LEADERS, type ExecutiveLeader } from "@/data/leadership";

export const Route = createFileRoute("/leadership")({
  head: () => ({
    meta: [
      { title: "Executive Leadership — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Meet the executive leadership team driving Unicure India's four decades of pharmaceutical manufacturing excellence: Mr. Abdul Mateen, Mr. Amin Ul Aziz, and Dr. Kashish Aziz.",
      },
      { property: "og:title", content: "Executive Leadership — Unicure India Ltd" },
      {
        property: "og:description",
        content:
          "Guided by integrity, ingenuity, and an uncompromising commitment to patient safety and medicine quality.",
      },
      { property: "og:url", content: "/leadership" },
    ],
    links: [{ rel: "canonical", href: "/leadership" }],
  }),
  component: LeadershipPage,
});

/* Quality Principles for Dr. Kashish Aziz */
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

function LeadershipPage() {
  const [activeLeader, setActiveLeader] = useState<string>("all");

  const mateen = EXECUTIVE_LEADERS.find((l) => l.id === "abdul-mateen")!;
  const amin = EXECUTIVE_LEADERS.find((l) => l.id === "amin-ul-aziz")!;
  const kashish = EXECUTIVE_LEADERS.find((l) => l.id === "kashish-aziz")!;

  useEffect(() => {
    // Handle hash navigation (e.g. #amin, #kashish, #mateen)
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.replace("#", "");
      if (["mateen", "abdul-mateen"].includes(hash)) {
        setActiveLeader("abdul-mateen");
        const el = document.getElementById("abdul-mateen");
        if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      } else if (["amin", "amin-ul-aziz"].includes(hash)) {
        setActiveLeader("amin-ul-aziz");
        const el = document.getElementById("amin-ul-aziz");
        if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      } else if (["kashish", "kashish-aziz"].includes(hash)) {
        setActiveLeader("kashish-aziz");
        const el = document.getElementById("kashish-aziz");
        if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
      }
    }
  }, []);

  return (
    <SiteLayout>
      {/* Page Hero */}
      <PageHero
        eyebrow="Executive Leadership"
        title="The People Behind Four Decades of Unicure"
        subtitle="Guided by integrity, ingenuity and an uncompromising commitment to patient safety, pharmaceutical innovation, and global healthcare access."
      />

      {/* Quick Executive Navigation Pills */}
      <section
        className="py-4 sm:py-6 bg-secondary/80 border-b border-border sticky z-20 backdrop-blur-md overflow-hidden"
        style={{ top: "var(--header-height, 72px)" }}
      >
        <div className="container-x flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              setActiveLeader("all");
              window.history.replaceState(null, "", "/leadership");
            }}
            className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeLeader === "all"
                ? "bg-primary text-white shadow-glow"
                : "bg-white text-foreground/75 border border-border hover:bg-secondary"
            }`}
          >
            All Executives
          </button>
          {EXECUTIVE_LEADERS.map((l) => (
            <button
              key={l.id}
              onClick={() => {
                setActiveLeader(l.id);
                window.history.replaceState(null, "", `/leadership#${l.id}`);
                const el = document.getElementById(l.id);
                if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                activeLeader === l.id
                  ? "bg-primary text-white shadow-glow"
                  : "bg-white text-foreground/75 border border-border hover:bg-secondary"
              }`}
            >
              <span>{l.name}</span>
              <span className="text-[10px] opacity-75 hidden sm:inline">({l.designation})</span>
            </button>
          ))}
        </div>
      </section>

      {/* Main Leadership Profiles */}
      <div className="py-16 md:py-24 space-y-24 bg-background">
        {/* ============================================================ */}
        {/* 1. MR. ABDUL MATEEN — MANAGING DIRECTOR                      */}
        {/* ============================================================ */}
        {(activeLeader === "all" || activeLeader === "abdul-mateen") && (
          <section id="abdul-mateen" className="scroll-mt-32">
            <div className="container-x">
              <ScrollReveal>
                <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-10 md:p-14 shadow-card hover:shadow-elegant transition-all">
                  <div className="grid gap-10 lg:grid-cols-[300px_1fr] items-start">
                    {/* Portrait Column */}
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                      <div className="relative aspect-[4/5] sm:aspect-square w-52 sm:w-64 lg:w-full rounded-3xl overflow-hidden shadow-elegant ring-4 ring-[#C8102E]/80 shrink-0 bg-secondary">
                        <img
                          src={mateen.photo}
                          alt={mateen.altText}
                          className="h-full w-full object-cover object-center"
                          loading="eager"
                        />
                      </div>
                      <div className="mt-4 h-1 w-20 rounded-full bg-[#C8102E]" />
                      <h2 className="mt-4 text-2xl font-bold text-foreground">{mateen.name}</h2>
                      <div className="text-sm font-semibold text-primary mt-1">
                        {mateen.designation}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Founder, Unicure India Ltd (Est. 1984)
                      </div>

                      <div className="mt-6">
                        <Link
                          to="/md-message"
                          className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-xs font-semibold hover:bg-primary hover:text-white transition-all"
                        >
                          View Dedicated Desk Message <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Content & Complete Message Column */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                          <Quote className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            Managing Director's Statement
                          </span>
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                            Building a Resilient Global Pharmaceutical Entity
                          </h3>
                        </div>
                      </div>

                      {/* Complete Untruncated Quote with Proper Paragraph Spacing */}
                      <blockquote className="space-y-4 text-base sm:text-lg leading-relaxed text-foreground/85 border-l-4 border-primary/30 pl-5 sm:pl-6 my-4 italic">
                        <p>
                          "When I look back upon the last 4 decades, I feel proud to observe the
                          heights Unicure as a Company has achieved in the field of pharmaceuticals
                          manufacturing and innovations. With joint dedicated endeavours from our
                          team, we have realized the sole aim with which the company was established
                          - to serve the country and mankind at large."
                        </p>
                        <p>
                          "Integrity and ingenuity are the strength and core values of Unicure. By
                          upholding these principles throughout the decades, we simultaneously
                          function for the growth and value creation of our stakeholders. Working
                          aggressively towards exports, Unicure is marching forward steadfastly into
                          a brighter and wider horizon beyond the bounds of our Country."
                        </p>
                      </blockquote>

                      {/* Visually Separated Robert Frost Inspirational Card */}
                      <div className="rounded-2xl bg-secondary/50 border border-border/80 p-5 flex items-start gap-4">
                        <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Guiding Philosophy (Robert Frost)
                          </div>
                          <p className="mt-1 text-sm sm:text-base font-semibold text-primary italic">
                            "I have promises to keep and miles to go before I sleep."
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 2. MR. AMIN UL AZIZ — VP OF BUSINESS DEVELOPMENT              */}
        {/* ============================================================ */}
        {(activeLeader === "all" || activeLeader === "amin-ul-aziz") && (
          <section id="amin-ul-aziz" className="scroll-mt-32">
            <div className="container-x">
              <ScrollReveal>
                <div className="rounded-3xl bg-white border border-border/80 p-6 sm:p-10 md:p-14 shadow-card hover:shadow-elegant transition-all">
                  <div className="grid gap-10 lg:grid-cols-[300px_1fr] items-start">
                    {/* Portrait Column with Approved High-Res Headshot */}
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                      <div className="relative aspect-[4/5] sm:aspect-square w-52 sm:w-64 lg:w-full rounded-3xl overflow-hidden shadow-elegant ring-4 ring-primary/80 shrink-0 bg-secondary">
                        <img
                          src={amin.photo}
                          alt={amin.altText}
                          className="h-full w-full object-cover object-center"
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-4 h-1 w-20 rounded-full bg-primary" />
                      <h2 className="mt-4 text-2xl font-bold text-foreground">{amin.name}</h2>
                      <div className="text-sm font-semibold text-primary mt-1">
                        {amin.designation}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Commercial Strategy & International Growth
                      </div>

                      {/* Social & Contact Links */}
                      <div className="mt-6 flex items-center gap-2">
                        <a
                          href={amin.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn Profile"
                          title="LinkedIn Profile"
                          className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary hover:bg-primary hover:text-white transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                        <a
                          href={`mailto:${amin.email}`}
                          aria-label="Email Mr. Amin Ul Aziz"
                          title="Email Mr. Amin Ul Aziz"
                          className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-primary hover:bg-primary hover:text-white transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                          <Quote className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                            Strategic Perspective
                          </span>
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                            Focus, Execution, and Sustainable Value Creation
                          </h3>
                        </div>
                      </div>

                      {/* Complete Exact Quote — Untruncated */}
                      <blockquote className="text-base sm:text-lg leading-relaxed text-foreground/85 border-l-4 border-primary/30 pl-5 sm:pl-6 my-4 italic">
                        <p>
                          "Don't stress about not having it all figured out. Social media can make
                          us think that we're the only one not 'trending up and to the right.' Focus
                          intently on where you are now and use this as leverage while everyone else
                          is focused on projecting where they want to be rather than where they
                          actually are."
                        </p>
                      </blockquote>

                      {/* Key Focus Highlights */}
                      <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        {[
                          "Expansion into 20+ Regulated Export Markets",
                          "Institutional Supply across all 28 States in India",
                          "Turnkey Third-Party Formulation Partnerships",
                          "Transparent Stakeholder & Client Collaboration",
                        ].map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 rounded-xl bg-secondary/40 p-3.5 border border-border/50"
                          >
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-foreground/90">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* 3. DR. KASHISH AZIZ — VP OF QUALITY ASSURANCE                */}
        {/* ============================================================ */}
        {(activeLeader === "all" || activeLeader === "kashish-aziz") && (
          <section id="kashish-aziz" className="scroll-mt-32">
            <div className="container-x">
              <ScrollReveal>
                <div className="rounded-3xl bg-white border border-emerald-500/30 p-6 sm:p-10 md:p-14 shadow-card hover:shadow-elegant transition-all">
                  <div className="grid gap-10 lg:grid-cols-[300px_1fr] items-start">
                    {/* Portrait Column with Approved High-Res Headshot & Modern Green Quality Theme */}
                    <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                      <div className="relative aspect-[4/5] sm:aspect-square w-52 sm:w-64 lg:w-full rounded-3xl overflow-hidden shadow-elegant ring-4 ring-emerald-600/80 shrink-0 bg-emerald-50">
                        <img
                          src={kashish.photo}
                          alt={kashish.altText}
                          className="h-full w-full object-cover object-center"
                          loading="lazy"
                        />
                      </div>
                      <div className="mt-4 h-1 w-20 rounded-full bg-emerald-600" />
                      <h2 className="mt-4 text-2xl font-bold text-foreground">{kashish.name}</h2>
                      <div className="text-sm font-semibold text-emerald-700 mt-1">
                        {kashish.designation}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        cGMP, Regulatory Affairs & Pharmacovigilance
                      </div>

                      {/* Contact Links */}
                      <div className="mt-6 flex items-center gap-2">
                        <a
                          href={kashish.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn Profile"
                          title="LinkedIn Profile"
                          className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                        <a
                          href={`mailto:${kashish.email}`}
                          aria-label="Email Dr. Kashish Aziz"
                          title="Email Dr. Kashish Aziz"
                          className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      </div>
                    </div>

                    {/* Content Column */}
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
                          <ShieldCheck className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">
                            Quality Manifesto
                          </span>
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                            Quality or Quit — Uncompromising Standards
                          </h3>
                        </div>
                      </div>

                      {/* Complete Exact Quote — Untruncated */}
                      <blockquote className="text-base sm:text-lg leading-relaxed text-foreground/85 border-l-4 border-emerald-600/50 pl-5 sm:pl-6 my-4 italic">
                        <p>
                          "The entire pharmaceutical industry has a lot of work to do to restore
                          public health. Quality is never an accident; it is always the result of
                          high intention, sincere effort, intelligent direction and skillful
                          execution. It represents the wise choice of many alternatives. Only a
                          healthy horse can pull a sturdy wagon. Hence, my coherent message to team
                          Unicure is: Quality or Quit!"
                        </p>
                      </blockquote>

                      {/* Our Quality Principles Section */}
                      <div className="pt-4 border-t border-border/80">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-foreground mb-4">
                          Our Quality Principles
                        </h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {QUALITY_PRINCIPLES.map((qp, idx) => (
                            <div
                              key={idx}
                              className="rounded-2xl bg-emerald-50/50 border border-emerald-200/60 p-4 flex items-start gap-3.5 shadow-sm hover:shadow-md transition"
                            >
                              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600 text-white shrink-0 shadow-sm">
                                <qp.icon className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-foreground">{qp.title}</div>
                                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                  {qp.desc}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>
        )}
      </div>

      {/* ============================================================ */}
      {/* 4. EXECUTIVE LEADERSHIP CARDS (CONSISTENT CENTRALIZED GRID)  */}
      {/* ============================================================ */}
      <section className="py-20 bg-secondary/40 border-t border-border">
        <div className="container-x">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
                Executive Leadership
              </span>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                Meet Our Leadership Team
              </h2>
              <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-gradient-brand" />
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                Decades of specialized pharmaceutical expertise guiding production, quality, and
                commercial partnerships.
              </p>
            </div>
          </ScrollReveal>

          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {EXECUTIVE_LEADERS.map((leader) => (
              <StaggerItem key={leader.id}>
                <article className="group flex flex-col rounded-3xl bg-white border border-border p-6 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300 h-full justify-between">
                  <div>
                    {/* Portrait with Correct Focal Position and 4:3 / 5:4 aspect ratio */}
                    <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-secondary shadow-sm mb-5">
                      <img
                        src={leader.photo}
                        alt={leader.altText}
                        className="h-full w-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-xs font-bold uppercase tracking-wider text-primary">
                      {leader.designation}
                    </div>
                    <h3 className="mt-1 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {leader.name}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {leader.shortBio}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60">
                    <Link
                      to={leader.href as any}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                    >
                      Read More <ArrowRight className="h-4 w-4" />
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
