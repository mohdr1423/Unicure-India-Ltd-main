import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  FlaskConical,
  Globe2,
  Award,
  Truck,
  Sparkles,
  Microscope,
  CheckCircle2,
  Pill,
  Droplets,
  Package,
  ChevronRight,
  Quote,
  Users,
  Briefcase,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Building2,
  HeartHandshake,
  Layers,
  ShieldAlert,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import { SafeImage } from "@/components/site/SafeImage";
import { useSiteSetting } from "@/hooks/use-site-setting";
import { useSiteContent } from "@/hooks/use-site-content";
import { RichContent } from "@/components/site/RichContent";
const hero = "/images/dron-pic-unit3.png";
import lab from "@/assets/lab-research.jpg";
import products from "@/assets/products.jpg";

// Client logos for marquee
const clientLogos = [
  { name: "Mankind Pharma", src: "/images/clients/mankind.svg" },
  { name: "Jagsonpal", src: "/images/clients/jagsonpal.svg" },
  { name: "Obsurge", src: "/images/clients/obsurge.svg" },
  { name: "Seagull Pharma", src: "/images/clients/seagull.svg" },
  { name: "Wings Pharma", src: "/images/clients/wings.svg" },
  { name: "DeVats", src: "/images/clients/devats.svg" },
  { name: "Ornate", src: "/images/clients/ornate.svg" },
  { name: "Mohrish", src: "/images/clients/mohrish.svg" },
];

const facilityImages = [
  { src: "/images/dron-pic-unit3.png", alt: "Unicure India Ltd – Greater Noida plant" },
  { src: "/images/plant.png", alt: "Unicure India Ltd – Noida facility" },
  { src: "/images/admin-office.png", alt: "Unicure India Ltd – Corporate Office" },
  { src: "/images/plant-2.png", alt: "Unicure India Ltd – Roorkee unit" },
];

import { EXECUTIVE_LEADERS } from "@/data/leadership";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function useCounter(target: number, active: boolean, duration = 1600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

const defaultStats = [
  { value: 1984, suffix: "", label: "Year Established" },
  { value: 1200, suffix: "+", label: "Commercial Products" },
  { value: 2000, suffix: "+", label: "Products Manufactured" },
  { value: 3, suffix: " Plants", label: "Manufacturing Units" },
];

type HomeStat = { value: number; suffix: string; label: string };

function StatsRow({ stats }: { stats: HomeStat[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => e.isIntersecting && setActive(true),
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
      {stats.map((s) => (
        <Stat key={s.label} {...s} active={active} />
      ))}
    </div>
  );
}

function Stat({ value, suffix, label, active }: { value: number; suffix: string; label: string; active: boolean }) {
  const n = useCounter(value, active);
  return (
    <div className="text-center">
      <div className="text-4xl md:text-6xl font-bold text-gradient tracking-tight">
        {n}
        {suffix}
      </div>
      <div className="mt-2 text-xs md:text-sm uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

const capabilityIcons = [Pill, Package, Droplets, FlaskConical, Sparkles, Droplets];
const capabilitiesDefault = [
  { icon: Pill, title: "Tablets (6,000M/yr)", desc: "High-speed compression, film, sugar & enteric coating." },
  { icon: Package, title: "Capsules (1,200M/yr)", desc: "Hard gelatin & vegetarian capsule filling with pellets/powders." },
  { icon: Droplets, title: "Liquid Orals (35.28M/yr)", desc: "Closed-loop syrup mixing, suspension & liquid filling." },
  { icon: Droplets, title: "Dry Syrups (3.6M/yr)", desc: "Beta-Lactam and pediatric antibiotic dry powders." },
  { icon: FlaskConical, title: "Ointments & Gels (500 MT)", desc: "Planetary vacuum homogenizer semi-solid manufacturing." },
  { icon: Sparkles, title: "Sachets & Powders (4,000 MT)", desc: "Precision granulation & high-speed form-fill-seal." },
];

const whyIcons = [ShieldCheck, Microscope, Award, Globe2, Truck, CheckCircle2];
const why = [
  { icon: ShieldCheck, title: "WHO-GMP Certified", desc: "Approved across Noida, Roorkee and Greater Noida units." },
  { icon: Microscope, title: "R&D Excellence", desc: "In-house formulation and analytical development laboratories." },
  { icon: Award, title: "Rigorous QA/QC", desc: "Multi-stage analytical testing at every raw material and batch stage." },
  { icon: Globe2, title: "Global Reach", desc: "Exporting high quality formulations to 20+ countries worldwide." },
  { icon: Truck, title: "Reliable Supply Chain", desc: "High volume production with on-time domestic and global delivery." },
  { icon: CheckCircle2, title: "Regulatory Compliance", desc: "CTD/eCTD dossiers ready for international drug registration." },
];

const certs = ["WHO-GMP", "ISO 9001:2015", "Schedule M", "GLP Compliant", "ISO 14001", "Form 25 / 26 / 28"];

const testimonials = [
  {
    quote: "Unicure's manufacturing precision and documentation quality make them our first-choice partner in South Asia.",
    name: "Dr. R. Mehta",
    role: "Head of Procurement, MedCorp Africa",
  },
  {
    quote: "Consistent batches, on-time shipments, and world-class QA. Exactly what a global distributor needs.",
    name: "James O'Neill",
    role: "Managing Director, PharmaLink EU",
  },
  {
    quote: "The R&D team helped us develop three custom formulations within a single quarter.",
    name: "Priya Nair",
    role: "Product Lead, HealthPlus Middle East",
  },
];

function HomePage() {
  const heroSettings = useSiteSetting<{ body?: string }>("hero");
  const home = useSiteContent<{
    hero: {
      image_url?: string;
      video_url?: string;
      badge: string;
      headline_line1: string;
      headline_highlight: string;
      subheadline: string;
      cta_primary_label: string;
      cta_primary_to: string;
      cta_secondary_label: string;
      cta_secondary_to: string;
    };
    stats: { value: string; suffix: string; label: string }[];
    capabilities: {
      eyebrow: string;
      title: string;
      description: string;
      items: { title: string; desc: string }[];
    };
    why: { eyebrow: string; title: string; items: { title: string; desc: string }[] };
  }>("homepage");

  const heroC = home?.hero;
  const statsC: HomeStat[] = home?.stats?.length
    ? home.stats.map((s) => ({
        value: Number(String(s.value).replace(/\D/g, "")) || 0,
        suffix: s.suffix ?? "",
        label: s.label ?? "",
      }))
    : defaultStats;
  const capsC = home?.capabilities?.items?.length
    ? home.capabilities.items.map((it, i) => ({
        icon: capabilityIcons[i % capabilityIcons.length],
        title: it.title,
        desc: it.desc,
      }))
    : capabilitiesDefault;
  const whyC = home?.why?.items?.length
    ? home.why.items.map((it, i) => ({
        icon: whyIcons[i % whyIcons.length],
        title: it.title,
        desc: it.desc,
      }))
    : why;

  // Video playback controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <SiteLayout>
      {/* HERO SECTION WITH VIDEO BACKGROUND */}
      <section className="relative min-h-[100svh] flex flex-col justify-between overflow-hidden bg-slate-950">
        {/* Video element */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          onLoadedData={() => setVideoLoaded(true)}
          poster={heroC?.image_url || hero}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            videoLoaded ? "opacity-100" : "opacity-80"
          }`}
        >
          <source src={heroC?.video_url || "/video/home-bg.mp4"} type="video/mp4" />
        </video>

        {/* Sophisticated gradient and vignette overlays for crisp legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-900/60 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,168,107,0.2),transparent_60%)] z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(0,87,184,0.25),transparent_60%)] z-0" />

        {/* Hero Content */}
        <div className="container-x relative z-10 pt-36 pb-8 sm:pt-44 sm:pb-10 md:pt-48 md:pb-12 flex-1 flex flex-col justify-center">
          <div className="max-w-3xl animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-xs font-medium text-white/90 shadow-sm border border-white/10">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />{" "}
              {heroC?.badge ?? "WHO-GMP Certified Pharmaceutical Manufacturer • Est. 1984"}
            </span>

            <h1 className="mt-6 text-4xl sm:text-5xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight">
              {heroC?.headline_line1 ?? "Pursuing Excellence"}<br />
              <span className="text-gradient bg-[linear-gradient(90deg,#38bdf8,#34d399)] bg-clip-text text-transparent">
                {heroC?.headline_highlight ?? "In Healthcare"}
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed font-light">
              {heroC?.subheadline ??
                "Unicure India Ltd. is a leading pharmaceutical manufacturer committed to delivering high-quality healthcare solutions, advanced dosage formulations, and trusted medications worldwide."}
            </p>

            <div className="mt-8 sm:mt-9 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                to="/manufacturing"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-semibold text-[color:var(--brand-blue-dark)] shadow-elegant hover:shadow-glow transition hover:scale-[1.02] text-center"
              >
                {heroC?.cta_primary_label ?? "Explore Manufacturing"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/dosage-forms"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 glass-dark px-6 sm:px-7 py-3.5 sm:py-4 text-sm font-semibold text-white hover:bg-white/10 transition text-center"
              >
                Dosage Forms & Capacities
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 glass-dark px-6 py-3.5 sm:py-4 text-sm font-semibold text-white hover:bg-white/10 transition text-center"
              >
                {heroC?.cta_secondary_label ?? "Contact Us"}
              </Link>
            </div>
          </div>
        </div>

        {/* Video Control Bar */}
        <div className="absolute top-28 right-4 sm:right-6 md:right-12 z-20 flex items-center gap-2">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
            className="grid h-9 w-9 place-items-center rounded-full glass-dark text-white/80 hover:text-white hover:bg-white/20 transition shadow-sm border border-white/15 cursor-pointer"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute video" : "Mute video"}
            className="grid h-9 w-9 place-items-center rounded-full glass-dark text-white/80 hover:text-white hover:bg-white/20 transition shadow-sm border border-white/15 cursor-pointer"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>

        {/* STATS STRIP — In normal document flow with relative positioning */}
        <div className="relative z-10 w-full mt-6 sm:mt-10 pb-8 md:pb-12">
          <div className="container-x">
            <div className="glass rounded-2xl p-5 sm:p-6 md:p-8 shadow-elegant border border-white/20">
              <StatsRow stats={statsC} />
            </div>
          </div>
        </div>
      </section>

      {heroSettings?.body ? (
        <section className="py-16 border-b">
          <div className="container-x max-w-3xl">
            <RichContent html={heroSettings.body} />
          </div>
        </section>
      ) : null}

      {/* CLIENT LOGO MARQUEE */}
      <section className="py-12 border-b border-border bg-secondary/30 overflow-hidden">
        <div className="container-x mb-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
            Trusted by leading pharmaceutical companies
          </span>
        </div>
        <div className="relative" aria-label="Our clients" role="marquee">
          <div className="flex animate-marquee gap-12 items-center">
            {clientLogos.map((c) => (
              <div
                key={c.name}
                className="shrink-0 h-12 w-32 grid place-items-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              >
                <SafeImage
                  src={c.src}
                  alt={c.name}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                  fallback={
                    <span className="text-xs font-semibold text-foreground/80 px-3 py-1.5 rounded-xl bg-white border border-border shadow-sm">
                      {c.name}
                    </span>
                  }
                />
              </div>
            ))}
            <div aria-hidden="true" className="contents">
              {clientLogos.map((c) => (
                <div
                  key={`dup-${c.name}`}
                  className="shrink-0 h-12 w-32 grid place-items-center grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                >
                  <SafeImage
                    src={c.src}
                    alt=""
                    className="max-h-full max-w-full object-contain"
                    loading="lazy"
                    fallback={
                      <span className="text-xs font-semibold text-foreground/80 px-3 py-1.5 rounded-xl bg-white border border-border shadow-sm">
                        {c.name}
                      </span>
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT UNICURE INDIA SECTION */}
      <section className="py-24 md:py-32 bg-gradient-soft overflow-hidden">
        <div className="container-x grid gap-16 lg:grid-cols-2 items-center">
          <ScrollReveal variant="slide-left">
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-brand opacity-20 blur-2xl" />
              <img
                src="/images/mfg-machine.png"
                alt="Unicure India High-speed manufacturing facility"
                className="relative rounded-3xl shadow-elegant w-full object-cover aspect-[4/3]"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -right-6 hidden md:block glass rounded-2xl p-5 shadow-card max-w-[240px]">
                <div className="flex items-center gap-3">
                  <Award className="h-8 w-8 text-primary" />
                  <div>
                    <div className="text-sm font-semibold">WHO-GMP & ISO</div>
                    <div className="text-xs text-muted-foreground">3 Manufacturing Units</div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="slide-right" delay={0.15}>
            <div>
              <SectionEyebrow>About Unicure India</SectionEyebrow>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
                Welcome To Unicure India
              </h2>
              <p className="mt-6 text-base md:text-lg leading-relaxed text-muted-foreground">
                Unicure, established by <strong>Mr. Abdul Mateen</strong>, is a leading manufacturer of tablets,
                capsules, dry syrups, sachets, syringes, and gels. Our aim is to bring healthcare supplies to every
                sector of society.
              </p>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                With decades of experience in the pharmaceutical industry, we combine traditional values with modern
                technology to deliver safe, effective, and affordable medications to patients worldwide.
              </p>
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {[
                  "1,200+ Commercial Formulations",
                  "2,000+ Formulations Manufactured",
                  "600+ Skilled Team Members",
                  "3 State-of-the-Art Plants",
                ].map((t) => (
                  <div key={t} className="flex gap-3 items-center">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                    <span className="text-sm font-medium">{t}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 font-semibold text-primary hover:gap-3 transition-all"
                >
                  Our Story & Journey <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/leadership"
                  className="inline-flex items-center gap-2 font-semibold text-muted-foreground hover:text-foreground transition-all"
                >
                  Leadership Team <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* TRANSFORMING HEALTHCARE — 3 CORE PILLARS */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container-x">
          <ScrollReveal>
            <div className="text-center max-w-3xl mx-auto">
              <SectionEyebrow>Transforming Healthcare</SectionEyebrow>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
                Innovative solutions for better health outcomes
              </h2>
              <p className="mt-4 text-muted-foreground text-lg">
                Engineered for zero-contamination, precise batch reproducibility, and uncompromising quality.
              </p>
            </div>
          </ScrollReveal>

          <StaggerGrid className="mt-14 grid gap-8 md:grid-cols-3">
            <StaggerItem>
              <div className="rounded-3xl border border-border bg-card p-8 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1.5 h-full flex flex-col justify-between">
                <div>
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <FlaskConical className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-foreground">A Leading Healthcare Manufacturer</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Unicure prides itself on harnessing technological processes and utilizing them for new prospects and
                    clients. We use new-age science and technology to constantly evolve and fulfil our vision.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center text-xs font-semibold text-primary">
                  Advanced High-Speed Lines
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="rounded-3xl border border-border bg-card p-8 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1.5 h-full flex flex-col justify-between">
                <div>
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <Building2 className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-foreground">Safe Manufacturing Units</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Unicure's manufacturing units are designed to prevent contamination. Their false ceilings and
                    concealed lighting structure ensure that the entire process is conducted safely at all times.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center text-xs font-semibold text-primary">
                  Class 100,000 Cleanrooms & BMS HVAC
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="rounded-3xl border border-border bg-card p-8 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1.5 h-full flex flex-col justify-between">
                <div>
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                    <ShieldAlert className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-foreground">Separate Space for Sensitive Materials</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    Hazardous, Beta-Lactam, and sensitive materials are handled and stored in separate designated areas.
                    Hence, no compromise with quality and safety of healthcare supplies and sensitive drugs.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center text-xs font-semibold text-primary">
                  Dedicated Airlocks & Containment
                </div>
              </div>
            </StaggerItem>
          </StaggerGrid>
        </div>
      </section>

      {/* OFFICIAL VISION SECTION */}
      <section className="py-24 md:py-32 bg-gradient-brand text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.15),transparent_60%)]" />
        <div className="container-x relative max-w-4xl text-center">
          <ScrollReveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 border border-white/20">
              <HeartHandshake className="h-4 w-4" /> Our Vision & Commitment
            </span>
            <h2 className="mt-6 text-3xl md:text-5xl font-bold tracking-tight">
              “To be a commercially viable leading pharmaceutical company in providing quality products affordable to all
              sections in the society.”
            </h2>
            <p className="mt-6 text-white/85 text-lg leading-relaxed font-light">
              Unicure India Ltd. aims to be the leading pharmaceutical company that provides trusted healthcare products
              at affordable rates. Our vision is to cater to all sections of society and become a front player in the
              INNOVATION pharma community. We consistently strive to target every sector of the market by manufacturing
              high quality products through rigorous Research and Development.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                to="/manufacturing"
                className="rounded-full bg-white px-8 py-4 text-sm font-bold text-[color:var(--brand-blue-dark)] shadow-lg hover:bg-white/95 transition hover:scale-105"
              >
                Explore Facilities
              </Link>
              <Link
                to="/pharmacovigilance"
                className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-sm font-bold text-white backdrop-blur hover:bg-white/20 transition"
              >
                Drug Safety & Pharmacovigilance
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CAPABILITIES & DOSAGE FORMS PREVIEW */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <ScrollReveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <SectionEyebrow>{home?.capabilities?.eyebrow ?? "Dosage Form Capacities"}</SectionEyebrow>
                <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
                  {home?.capabilities?.title ?? "High-volume dosage form manufacturing"}
                </h2>
                <p className="mt-4 text-muted-foreground text-lg">
                  Purpose-built facilities and validated processes across every major pharmaceutical dosage form.
                </p>
              </div>
              <Link
                to="/dosage-forms"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white hover:bg-primary/90 transition shadow-sm"
              >
                View All Dosage Forms <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>

          <StaggerGrid className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capsC.map((c) => (
              <StaggerItem key={c.title}>
                <Link
                  to="/dosage-forms"
                  className="group block relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-brand opacity-0 group-hover:opacity-20 blur-3xl transition-opacity" />
                  <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                    <c.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-foreground">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  <div className="mt-6 inline-flex items-center text-sm font-semibold text-primary group-hover:gap-2 gap-1 transition-all">
                    Technical Specifications <ChevronRight className="h-4 w-4" />
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* PRODUCTS FEATURE */}
      <section className="py-24 md:py-32 bg-[color:var(--brand-blue-dark)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,87,184,0.35),transparent_60%)]" />
        <div className="container-x relative grid gap-14 lg:grid-cols-2 items-center">
          <ScrollReveal variant="slide-left">
            <div>
              <SectionEyebrow light>Products Portfolio</SectionEyebrow>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
                1,200+ formulations across<br />every therapeutic area
              </h2>
              <p className="mt-5 text-white/80 text-lg">
                From antibiotics and cardiovascular therapies to nutraceuticals, gastrointestinal care, and specialty
                pediatrics — browse our full formulation list or request co-manufacturing.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[color:var(--brand-blue-dark)] hover:bg-white/90 transition shadow-lg"
                >
                  Browse Product Catalog <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/contract-manufacturing"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition"
                >
                  Co-Manufacturing Opportunities
                </Link>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="slide-right" delay={0.1}>
            <div className="relative">
              <img
                src={products}
                alt="Pharmaceutical tablets and capsules"
                className="rounded-3xl shadow-elegant w-full"
                loading="lazy"
                width={1280}
                height={960}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* WHY UNICURE */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto">
              <SectionEyebrow>{home?.why?.eyebrow ?? "Why Unicure"}</SectionEyebrow>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
                {home?.why?.title ?? "Built on science. Backed by compliance."}
              </h2>
            </div>
          </ScrollReveal>
          <StaggerGrid className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyC.map((w) => (
              <StaggerItem key={w.title}>
                <div className="rounded-3xl bg-secondary/60 p-8 border border-border hover:border-primary/40 hover:bg-white transition-all shadow-sm">
                  <w.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 text-lg font-bold text-foreground">{w.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="py-20 border-y border-border bg-secondary/50">
        <div className="container-x">
          <ScrollReveal>
            <div className="text-center mb-10">
              <SectionEyebrow>Accreditations</SectionEyebrow>
              <h2 className="mt-3 text-2xl md:text-4xl font-bold">Held to the world's highest standards</h2>
            </div>
          </ScrollReveal>
          <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {certs.map((c) => (
              <StaggerItem key={c}>
                <Link
                  to="/certifications"
                  className="block rounded-2xl bg-white border border-border py-6 text-center font-bold text-[color:var(--brand-blue-dark)] shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition"
                >
                  {c}
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* THREE MANUFACTURING PLANTS SPOTLIGHT */}
      <section className="py-24 md:py-32 overflow-hidden">
        <div className="container-x grid gap-14 lg:grid-cols-2 items-center">
          <ScrollReveal variant="slide-left">
            <div>
              <SectionEyebrow>Operational Units</SectionEyebrow>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
                Three world-class manufacturing facilities.
              </h2>
              <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
                Today, Unicure India Ltd. operates three manufacturing plants across Noida, Roorkee, and Greater Noida,
                employing more than 600 professionals with approximately 100 highly qualified technical personnel.
              </p>
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { k: "3 Plants", v: "Noida & Roorkee" },
                  { k: "600+", v: "Professionals" },
                  { k: "6,000M", v: "Tablets / Year" },
                ].map((s) => (
                  <div key={s.v} className="rounded-2xl bg-secondary p-4 sm:p-5 border border-border/50">
                    <div className="text-xl font-bold text-primary">{s.k}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/manufacturing"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition shadow-sm"
                >
                  Explore All 3 Plants <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal variant="slide-right" delay={0.1}>
            <div className="grid grid-cols-2 gap-3">
              {facilityImages.map((img, i) => (
                <img
                  key={img.src}
                  src={img.src}
                  alt={img.alt}
                  className={`rounded-2xl shadow-elegant w-full h-full object-cover aspect-[4/3] ${
                    i === 0 ? "col-span-2 aspect-[16/9]" : ""
                  }`}
                  loading="lazy"
                />
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* OUR LEADERSHIP SECTION */}
      <section className="py-24 md:py-32 bg-white border-t border-border">
        <div className="container-x">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <SectionEyebrow>Executive Leadership</SectionEyebrow>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Our Leadership
              </h2>
              <div className="mt-3 mx-auto h-1 w-16 rounded-full bg-gradient-brand" />
              <p className="mt-4 text-muted-foreground text-base md:text-lg">
                Meet the leadership team driving Unicure India's growth, quality and innovation.
              </p>
            </div>
          </ScrollReveal>

          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {EXECUTIVE_LEADERS.map((leader) => (
              <StaggerItem key={leader.id}>
                <article className="group flex flex-col rounded-3xl bg-secondary/40 border border-border p-6 shadow-card hover:shadow-elegant hover:-translate-y-1.5 transition-all duration-300 h-full justify-between hover:bg-white">
                  <div>
                    <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-secondary shadow-sm mb-5">
                      <img
                        src={leader.photo}
                        alt={leader.altText}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
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

      {/* TESTIMONIALS */}
      <section className="py-24 md:py-32 bg-gradient-soft">
        <div className="container-x">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <SectionEyebrow>Partners & Distributors</SectionEyebrow>
              <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">Trusted worldwide</h2>
            </div>
          </ScrollReveal>
          <StaggerGrid className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <StaggerItem key={t.name}>
                <figure className="rounded-3xl bg-white border border-border p-8 shadow-card h-full flex flex-col justify-between">
                  <div>
                    <Quote className="h-8 w-8 text-primary/40" />
                    <blockquote className="mt-4 text-sm md:text-base leading-relaxed text-foreground/90">
                      “{t.quote}”
                    </blockquote>
                  </div>
                  <figcaption className="mt-6 border-t border-border pt-4">
                    <div className="font-semibold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* CAREERS TEASER */}
      <section className="py-24 md:py-32">
        <div className="container-x">
          <ScrollReveal>
            <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center rounded-3xl bg-secondary/60 border border-border p-10 md:p-14">
              <div>
                <SectionEyebrow>Join Our Team</SectionEyebrow>
                <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
                  Build a career that improves lives
                </h2>
                <p className="mt-4 text-muted-foreground text-lg">
                  Join 600+ professionals across manufacturing, R&D, quality assurance, and commercial teams.
                </p>
                <Link
                  to="/careers"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-3.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition"
                >
                  View Open Positions <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users, value: "600+", label: "Team Members" },
                  { icon: Briefcase, value: "20+", label: "Departments" },
                  { icon: Award, value: "40+", label: "Years Legacy" },
                  { icon: Globe2, value: "95%", label: "Retention Rate" },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl bg-white border border-border p-5 text-center shadow-card">
                    <s.icon className="h-6 w-6 text-primary mx-auto" />
                    <div className="mt-2 text-2xl font-bold text-gradient">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container-x">
          <ScrollReveal variant="scale">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 md:p-16 shadow-elegant">
              <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[color:var(--brand-green)]/40 blur-3xl" />
              <div className="relative grid md:grid-cols-[1fr_auto] items-center gap-8">
                <div className="text-white max-w-2xl">
                  <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                    Ready to manufacture with confidence?
                  </h2>
                  <p className="mt-4 text-white/85 text-lg">
                    Talk to our team for custom formulations, contract manufacturing, institutional supply, and global
                    export partnerships.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-[color:var(--brand-blue-dark)] shadow-elegant"
                  >
                    Start a Conversation <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    to="/pharmacovigilance"
                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-4 text-sm font-semibold text-white hover:bg-white/20 transition"
                  >
                    Pharmacovigilance Portal
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteLayout>
  );
}

function SectionEyebrow({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] ${
        light ? "text-white/70" : "text-primary"
      }`}
    >
      <span className={`h-px w-8 ${light ? "bg-white/40" : "bg-primary/40"}`} />
      {children}
    </span>
  );
}
