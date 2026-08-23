import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  HeartHandshake,
  ArrowRight,
  Award,
  Factory,
  Globe2,
  Building2,
  Calendar,
  Layers,
  FlaskConical,
} from "lucide-react";
import { EXECUTIVE_LEADERS } from "@/data/leadership";
import { SafeImage } from "@/components/site/SafeImage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Unicure India Ltd | Our Journey & Mission" },
      {
        name: "description",
        content:
          "Discover Unicure India's 40+ year journey from 1984 to the present. Committed to pharmaceutical manufacturing excellence, quality, innovation, and global healthcare needs.",
      },
      { property: "og:title", content: "About Unicure India Ltd — Our Journey & Mission" },
      {
        property: "og:description",
        content:
          "Established in 1984, Unicure India provides high-quality pharmaceutical manufacturing, co-manufacturing, and global exports.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

/* ------------------------------------------------------------------ */
/*  Verified Chronological Timeline (1984 → Present)                  */
/* ------------------------------------------------------------------ */
const journeyMilestones = [
  {
    period: "1984",
    title: "The Beginning",
    subtitle: "Inception & Foundation",
    description:
      "Unicure India was established in 1984, beginning its journey in pharmaceutical manufacturing with a commitment to serving healthcare needs.",
    icon: Calendar,
    accent: "from-blue-600 to-indigo-700",
  },
  {
    period: "Expansion",
    title: "Manufacturing Excellence & Quality Evolution",
    subtitle: "WHO-GMP & Institutional Scale",
    description:
      "Expanded formulation capabilities across high-speed oral solid dosage, liquids, dry syrups, and sterile parenterals. Earned WHO-GMP certifications and became a major institutional supply partner across 28 Indian states.",
    icon: Factory,
    accent: "from-blue-700 to-slate-800",
  },
  {
    period: "Growth",
    title: "Global Reach & Strategic Co-Manufacturing",
    subtitle: "Alliances & Global Footprint",
    description:
      "Formed trusted contract and co-manufacturing partnerships with leading multinational and domestic pharmaceutical brands, while expanding direct exports to over 20 countries across Africa, Southeast Asia, CIS, and the Middle East.",
    icon: Globe2,
    accent: "from-slate-800 to-blue-900",
  },
  {
    period: "Present",
    title: "Our Journey Continues",
    subtitle: "Decades of Trust & Future Innovation",
    description:
      "Today, Unicure India continues to grow as a pharmaceutical manufacturing company, building on decades of experience while focusing on quality, innovation, manufacturing capabilities and global opportunities.",
    icon: Sparkles,
    accent: "from-[#C8102E] to-red-600",
    highlight: true,
  },
];

/* ------------------------------------------------------------------ */
/*  Mission Core Values                                               */
/* ------------------------------------------------------------------ */
const missionValues = [
  {
    title: "Quality",
    description:
      "Maintaining high standards across our pharmaceutical manufacturing and quality processes.",
    icon: ShieldCheck,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    title: "Integrity",
    description:
      "Building relationships through transparency, responsibility and ethical business practices.",
    icon: CheckCircle2,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    title: "Innovation",
    description:
      "Continuously improving our products, processes and capabilities.",
    icon: Sparkles,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    title: "Trust",
    description:
      "Creating long-term value for customers, partners, employees and the communities we serve.",
    icon: HeartHandshake,
    color: "text-rose-600 bg-rose-50 border-rose-100",
  },
];

function AboutPage() {
  return (
    <SiteLayout>
      {/* 1. Page Hero */}
      <PageHero
        eyebrow="About Unicure India"
        title="Four decades of scientific rigor and pharmaceutical excellence."
        subtitle="Unicure India is a fully integrated pharmaceutical manufacturer headquartered in India, supplying trusted medicines to premier institutions, leading brand partners, and healthcare networks across the world."
      />

      {/* 2. Company Overview / Our Story */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Image Column */}
            <div className="lg:col-span-6">
              <ScrollReveal variant="slide-left">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border group">
                  <img
                    src="/images/admin-office.png"
                    alt="Unicure India Corporate & Manufacturing Facilities"
                    className="w-full h-auto aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--brand-blue-dark)]/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="inline-flex items-center gap-2 rounded-full bg-[#C8102E] px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md mb-2">
                      Established 1984
                    </div>
                    <p className="text-sm font-medium text-white/90">
                      Four decades of dedicated pharmaceutical innovation and manufacturing excellence.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Story Text Column */}
            <div className="lg:col-span-6 space-y-6">
              <ScrollReveal variant="slide-right">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                  <span className="h-px w-6 bg-primary" />
                  Our Story & Heritage
                </div>
                <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  Building trusted healthcare for over four decades.
                </h2>
                <div className="mt-4 space-y-4 text-muted-foreground leading-relaxed text-base">
                  <p>
                    What began in 1984 as a vision by our Managing Director, Mr. Abdul Mateen, has grown into one of India's most respected pharmaceutical manufacturing enterprises. From the outset, Unicure India was established with a singular commitment: to serve the country and mankind at large with uncompromised integrity and ingenuity.
                  </p>
                  <p>
                    Today, Unicure India operates three state-of-the-art manufacturing facilities in North India, employing over 600 dedicated team members including more than 100 qualified scientists, formulation chemists, microbiologists, and regulatory experts.
                  </p>
                  <p>
                    Our operations span high-volume oral solids, liquid orals, dry syrups, sterile parenterals, and topical formulations — delivering quality medicines to institutional buyers, multinational co-manufacturing partners, and healthcare distribution networks across 20+ international markets.
                  </p>
                </div>

                {/* Quick Highlight Stats */}
                <div className="mt-8 grid grid-cols-3 gap-4 pt-6 border-t border-border">
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-primary">1984</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-medium">Year Established</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-primary">3 Plants</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-medium">Modern Facilities</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-primary">20+</div>
                    <div className="text-xs text-muted-foreground mt-0.5 font-medium">Export Countries</div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR JOURNEY CONTINUES — 1984 to Present Timeline */}
      <section className="py-20 md:py-28 bg-gradient-soft border-y border-border">
        <div className="container-x">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                <span className="h-px w-6 bg-primary" />
                1984 → Present
                <span className="h-px w-6 bg-primary" />
              </div>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Our Journey Continues
              </h2>
              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
                From our beginnings in 1984 to our continued growth today, Unicure India has remained committed to pharmaceutical quality, innovation and serving healthcare needs.
              </p>
              <div className="mt-5 mx-auto h-1 w-20 rounded-full bg-gradient-brand" />
            </ScrollReveal>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative max-w-5xl mx-auto">
            {/* Center Timeline Spine Line */}
            <div className="absolute left-6 md:left-1/2 top-4 bottom-8 w-1 -translate-x-1/2 bg-gradient-to-b from-blue-300 via-primary/60 to-[#C8102E] rounded-full hidden sm:block" />
            <div className="absolute left-6 top-4 bottom-8 w-1 -translate-x-1/2 bg-gradient-to-b from-blue-300 via-primary/60 to-[#C8102E] rounded-full sm:hidden" />

            <div className="space-y-12 sm:space-y-16">
              {journeyMilestones.map((m, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <div
                    key={m.period + m.title}
                    className={`relative flex flex-col sm:flex-row items-start ${
                      isEven ? "sm:flex-row" : "sm:flex-row-reverse"
                    } gap-6 sm:gap-12`}
                  >
                    {/* Milestone Card */}
                    <div
                      className={`w-full sm:w-[calc(50%-2rem)] pl-12 sm:pl-0 ${
                        isEven ? "sm:text-right" : "sm:text-left"
                      }`}
                    >
                      <ScrollReveal variant={isEven ? "slide-left" : "slide-right"} delay={idx * 0.1}>
                        <div
                          className={`rounded-3xl border ${
                            m.highlight
                              ? "border-[#C8102E]/40 bg-white shadow-xl ring-2 ring-[#C8102E]/20"
                              : "border-border bg-white shadow-card hover:shadow-elegant"
                          } p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1`}
                        >
                          <div
                            className={`flex items-center gap-2.5 mb-2 ${
                              isEven ? "sm:justify-end" : "sm:justify-start"
                            }`}
                          >
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-black tracking-wider uppercase ${
                                m.highlight
                                  ? "bg-[#C8102E] text-white"
                                  : "bg-primary/10 text-primary"
                              }`}
                            >
                              {m.period}
                            </span>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                              {m.subtitle}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                            {m.title}
                          </h3>

                          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                            {m.description}
                          </p>

                          {m.highlight && (
                            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-xs font-bold text-[#C8102E]">
                              <span>1984 → Today</span>
                              <span className="flex items-center gap-1">
                                Growing Forward <ArrowRight className="h-3.5 w-3.5" />
                              </span>
                            </div>
                          )}
                        </div>
                      </ScrollReveal>
                    </div>

                    {/* Timeline Node Point */}
                    <div className="absolute left-6 sm:left-1/2 -translate-x-1/2 top-6 z-10">
                      <div
                        className={`grid h-10 w-10 place-items-center rounded-full ${
                          m.highlight
                            ? "bg-[#C8102E] text-white ring-4 ring-red-100 shadow-glow"
                            : "bg-primary text-white ring-4 ring-blue-100 shadow-md"
                        }`}
                      >
                        <m.icon className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Spacer Column for Opposite Side (Desktop) */}
                    <div className="hidden sm:block sm:w-[calc(50%-2rem)]" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 4. OUR MISSION SECTION */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container-x">
          <div className="grid gap-14 lg:grid-cols-12 lg:items-center">
            {/* Left Image Column */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <ScrollReveal variant="slide-left">
                <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl group">
                  <img
                    src="/images/production-pic.png"
                    alt="Unicure India Pharmaceutical Production & Quality"
                    className="w-full h-auto aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[color:var(--brand-blue-dark)]/90 via-transparent to-transparent" />
                  
                  {/* Overlay Badge */}
                  <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-white border border-white/30">
                      <Award className="h-3.5 w-3.5 text-amber-300" /> WHO-GMP Certified
                    </div>
                    <p className="text-sm font-medium text-white/95 leading-snug">
                      Engineered for zero-defect compliance, patient safety, and global reliability.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right Mission & Values Column */}
            <div className="lg:col-span-7 order-1 lg:order-2 space-y-8">
              <ScrollReveal variant="slide-right">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                  <span className="h-px w-6 bg-primary" />
                  Core Purpose & Commitment
                </div>
                <h2 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  Our Mission
                </h2>

                {/* Main Mission Statement (Verbatim Required Copy) */}
                <div className="mt-6 rounded-2xl bg-secondary/50 border-l-4 border-primary p-6 sm:p-7 shadow-sm">
                  <p className="text-lg sm:text-xl font-semibold text-foreground/90 leading-relaxed italic">
                    "Our mission is to serve healthcare needs through high-quality pharmaceutical products and reliable manufacturing solutions, while continuously improving our capabilities, upholding integrity and building lasting trust with our customers and partners."
                  </p>
                </div>

                {/* 4 Mission Values Cards */}
                <div className="mt-8">
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    Our Guiding Values
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {missionValues.map((val) => (
                      <div
                        key={val.title}
                        className="rounded-2xl border border-border bg-white p-5 shadow-card hover:shadow-elegant hover:border-primary/40 transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border ${val.color}`}>
                            <val.icon className="h-5 w-5" />
                          </div>
                          <h4 className="text-base font-bold text-foreground">{val.title}</h4>
                        </div>
                        <p className="mt-3 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {val.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Executive Leadership Section */}
      <section className="py-20 md:py-28 bg-gradient-soft border-t border-border">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
                <span className="h-px w-6 bg-primary" />
                Guiding Leadership
                <span className="h-px w-6 bg-primary" />
              </div>
              <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Our Executive Leadership
              </h2>
              <p className="mt-3 text-muted-foreground text-base">
                Guided by experienced pharmaceutical pioneers driving innovation, compliance, and global reach.
              </p>
              <div className="mt-4 mx-auto h-1 w-16 rounded-full bg-gradient-brand" />
            </ScrollReveal>
          </div>

          <StaggerGrid className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
            {EXECUTIVE_LEADERS.map((leader) => (
              <StaggerItem key={leader.id}>
                <div className="group rounded-3xl border border-border bg-white p-6 shadow-card hover:shadow-elegant transition-all duration-300 flex flex-col h-full">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-muted mb-5">
                    <img
                      src={leader.photo}
                      alt={leader.altText}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {leader.name}
                    </h3>
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mt-1">
                      {leader.designation}
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1">
                      {leader.shortBio}
                    </p>
                    <div className="mt-5 pt-4 border-t border-border">
                      <Link
                        to={leader.href as any}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition"
                      >
                        Read Full Profile <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <div className="mt-12 text-center">
            <Link
              to="/leadership"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white px-7 py-3 text-sm font-bold text-primary hover:bg-primary hover:text-white shadow-sm transition"
            >
              Explore Complete Leadership Profiles <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CTA Section */}
      <section className="pb-24 pt-8 overflow-hidden">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-[color:var(--brand-blue-dark)] p-10 md:p-16 text-white shadow-2xl text-center border border-white/10">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-[#C8102E]/30 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
            
            <div className="relative max-w-2xl mx-auto space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#C8102E] px-4 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-md">
                Partner With Unicure India
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Ready to collaborate on your pharmaceutical needs?
              </h2>
              <p className="text-white/85 text-base sm:text-lg leading-relaxed">
                Connect with our business development and manufacturing teams for third-party contract manufacturing, institutional supply, or international export distribution.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-4">
                <Link
                  to="/dosage-forms"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[color:var(--brand-blue-dark)] shadow-md hover:bg-slate-100 transition"
                >
                  Explore Dosage Forms & Capacities <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition"
                >
                  Contact Our Team <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}