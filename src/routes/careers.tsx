import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import { useState, useEffect } from "react";
import {
  Users,
  Sparkles,
  HeartHandshake,
  Mail,
  Briefcase,
  GraduationCap,
  Heart,
  Clock,
  Shield,
  TrendingUp,
  MapPin,
  ChevronRight,
  ArrowRight,
  FlaskConical,
  Microscope,
  Factory,
  Package,
  BadgeCheck,
  Star,
  X,
  CheckCircle2,
  FileText,
  Award,
  Layers,
} from "lucide-react";
import type { JobOpening } from "./api/careers";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Join a team of 600+ professionals building trusted healthcare at Unicure India Ltd. Explore open positions in QA, Manufacturing, R&D, and Regulatory Affairs.",
      },
      { property: "og:title", content: "Careers at Unicure India Ltd" },
      {
        property: "og:description",
        content: "Build your pharmaceutical career with Unicure India.",
      },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
  component: CareersPage,
});

const highlights = [
  {
    icon: Users,
    title: "600+ Professionals",
    desc: "Across manufacturing, R&D, quality, regulatory, sales and support divisions.",
  },
  {
    icon: Sparkles,
    title: "100+ Technical Staff",
    desc: "Highly qualified scientists, chemists, microbiologists and engineers.",
  },
  {
    icon: HeartHandshake,
    title: "One Big Family",
    desc: "Grow with a company that has been leading the pharmaceutical industry for 40+ years.",
  },
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    desc: "Comprehensive medical coverage for you and your family with regular wellness check-ups.",
  },
  {
    icon: GraduationCap,
    title: "Learning & Development",
    desc: "Continuous technical training, analytical certifications, and leadership programs.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Transparent career pathways with performance-based promotions and internal mobility.",
  },
  {
    icon: Clock,
    title: "Work-Life Balance",
    desc: "Organized shift structures, paid time off, and employee welfare initiatives.",
  },
  {
    icon: Shield,
    title: "Job Security",
    desc: "Four decades of stable, recession-resistant pharmaceutical manufacturing growth.",
  },
  {
    icon: Star,
    title: "Recognition & Rewards",
    desc: "Annual performance bonuses, milestone celebrations, and employee excellence awards.",
  },
];

const DEFAULT_OPENINGS: JobOpening[] = [
  {
    id: "job_qc_analyst",
    title: "Quality Control Analyst",
    department: "Quality Assurance",
    location: "Greater Noida, UP",
    employment_type: "Full-time",
    experience: "2-5 Years",
    qualifications: "B.Sc / M.Sc Chemistry or B.Pharma",
    description: "Responsible for sampling, testing, and analytical validation of raw materials, in-process formulations, and finished dosage forms according to WHO-GMP specifications.",
    responsibilities: [
      "Perform HPLC, GC, UV-Vis spectrophotometry, and wet chemical analysis on raw materials and finished goods.",
      "Conduct in-process quality testing during tablet compression, capsule filling, and liquid oral manufacturing.",
      "Maintain strict documentation in compliance with Good Laboratory Practices (GLP) and Data Integrity standards.",
      "Perform stability testing, sample logging, and shelf-life degradation studies.",
    ],
    requirements: [
      "Degree in Chemistry, Analytical Chemistry, or Pharmaceutical Sciences.",
      "Minimum 2+ years of hands-on experience in a cGMP / WHO-GMP pharmaceutical testing laboratory.",
      "Proficiency with chromatography data systems and standard wet lab equipment.",
    ],
    skills: ["HPLC", "GC", "UV-Vis", "GLP", "SOP Compliance"],
    is_open: true,
  },
  {
    id: "job_prod_supervisor",
    title: "Production Supervisor (Solid Orals)",
    department: "Manufacturing",
    location: "Roorkee, Uttarakhand",
    employment_type: "Full-time",
    experience: "3-6 Years",
    qualifications: "B.Pharma / Diploma in Pharma Tech",
    description: "Supervising granulation, compression, and coating lines for tablets and capsules. Ensuring strict batch record documentation and adherence to cGMP safety protocols.",
    responsibilities: [
      "Oversee day-to-day operations in granulation, tablet compression, capsule filling, and coating sections.",
      "Ensure proper execution of Batch Manufacturing Records (BMR) and Batch Packaging Records (BPR).",
      "Monitor machine parameters, line clearance procedures, and cleanroom environmental controls.",
      "Train shop-floor operators on cGMP guidelines and safety standards.",
    ],
    requirements: [
      "B.Pharma or Diploma in Pharmaceutical Technology.",
      "3-6 years of experience in solid oral dosage form manufacturing under cGMP compliance.",
    ],
    skills: ["Granulation", "Compression", "Auto-Coater", "BMR", "cGMP"],
    is_open: true,
  },
  {
    id: "job_formulation_scientist",
    title: "Formulation Scientist (R&D)",
    department: "R&D",
    location: "Noida, UP",
    employment_type: "Full-time",
    experience: "4-8 Years",
    qualifications: "M.Pharma (Pharmaceutics) / Ph.D.",
    description: "Formulation development and optimization for novel and generic oral dosage forms, technology transfer to commercial plants, and stability study analysis.",
    responsibilities: [
      "Design and execute pre-formulation and formulation development studies for oral solids and liquids.",
      "Conduct pilot-scale trial batches and execute successful technology transfer to commercial manufacturing facilities.",
      "Prepare Product Development Reports (PDR) and Master Formula Cards (MFC).",
    ],
    requirements: [
      "Master's in Pharmacy (Pharmaceutics) or Ph.D. in Pharmaceutical Sciences.",
      "4-8 years of experience in formulation R&D for oral dosage forms.",
    ],
    skills: ["Formulation R&D", "QbD", "Tech Transfer", "Scale-up", "Stability Studies"],
    is_open: true,
  },
  {
    id: "job_regulatory_exec",
    title: "Regulatory Affairs Executive",
    department: "Regulatory",
    location: "Noida, UP",
    employment_type: "Full-time",
    experience: "2-4 Years",
    qualifications: "B.Pharma / M.Pharma",
    description: "Preparation and submission of dossiers (CTD/ACTD format) for domestic and international health authorities across Latin America, Africa, and CIS markets.",
    responsibilities: [
      "Compile and review Common Technical Document (CTD / ACTD) dossiers for international product registrations.",
      "Prepare responses to deficiency letters and regulatory queries from foreign health ministries.",
      "Maintain registration status databases and lifecycle renewals.",
    ],
    requirements: [
      "B.Pharma or M.Pharma with 2-4 years of experience in export regulatory affairs.",
      "Familiarity with CTD/ACTD formats and ASEAN guidelines.",
    ],
    skills: ["CTD / ACTD", "Export Registration", "Dossier Compilation", "Regulatory Compliance"],
    is_open: true,
  },
  {
    id: "job_packaging_operator",
    title: "Packaging Line Operator",
    department: "Manufacturing",
    location: "Greater Noida, UP",
    employment_type: "Full-time",
    experience: "1-3 Years",
    qualifications: "ITI / Diploma / High School",
    description: "Operation and maintenance of blister packaging machines, cartoners, and labeling lines in high-speed pharmaceutical packaging environments.",
    responsibilities: [
      "Operate Alu-Alu and Blister packaging machinery, strip packing units, and automatic cartoners.",
      "Perform machine changeovers and primary leak testing for blister packs.",
      "Verify batch coding, MRP, and expiry date printing on secondary cartons.",
    ],
    requirements: [
      "ITI Certificate or Diploma with 1-3 years in pharma packaging operations.",
    ],
    skills: ["Blister Packing", "Alu-Alu", "Batch Coding", "Line Clearance"],
    is_open: true,
  },
  {
    id: "job_medical_sales_rep",
    title: "Institutional Sales Manager",
    department: "Commercial",
    location: "Delhi NCR / Pan India",
    employment_type: "Full-time",
    experience: "3-7 Years",
    qualifications: "Graduate / MBA Marketing preferred",
    description: "Managing institutional hospital tenders, corporate pharmacy supply contracts, and large-scale distributor relationships across North India.",
    responsibilities: [
      "Identify, bid on, and secure institutional hospital tenders and supply contracts.",
      "Develop strategic partnerships with hospital procurement heads and distributors.",
      "Achieve monthly and annual sales revenue targets for generic formulations.",
    ],
    requirements: [
      "Graduate in Science/Pharmacy/Commerce, MBA in Marketing preferred.",
      "3-7 years in institutional pharma sales or hospital tender management.",
    ],
    skills: ["Institutional Sales", "Tender Bidding", "Key Accounts", "Hospital Networks"],
    is_open: true,
  },
];

const growthStats = [
  { value: "40+", label: "Years of Legacy" },
  { value: "600+", label: "Team Members" },
  { value: "20+", label: "Pharma Departments" },
  { value: "95%", label: "Employee Retention" },
];

function getDepartmentIcon(dept: string) {
  const d = (dept || "").toLowerCase();
  if (d.includes("quality") || d.includes("qa") || d.includes("qc")) return FlaskConical;
  if (d.includes("r&d") || d.includes("research") || d.includes("science")) return Microscope;
  if (d.includes("manufactur") || d.includes("production")) return Factory;
  if (d.includes("packag")) return Package;
  if (d.includes("regulat")) return BadgeCheck;
  return Briefcase;
}

function CareersPage() {
  const [openingsList, setOpeningsList] = useState<JobOpening[]>(DEFAULT_OPENINGS);
  const [selectedDetailsJob, setSelectedDetailsJob] = useState<JobOpening | null>(null);
  const [activeDeptFilter, setActiveDeptFilter] = useState("all");
  const navigate = useNavigate();

  // Load live jobs from server API
  useEffect(() => {
    fetch("/api/careers")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setOpeningsList(data.jobs);
        }
      })
      .catch(() => {});
  }, []);

  const departments = Array.from(
    new Set(openingsList.map((j) => j.department).filter(Boolean))
  );

  const filteredOpenings = openingsList.filter((job) => {
    if (activeDeptFilter !== "all" && job.department !== activeDeptFilter) return false;
    return true;
  });

  const handleApplyClick = (jobId: string) => {
    navigate({ to: "/careers/apply", search: { job: jobId } as any });
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <PageHero
        eyebrow="Careers at Unicure India"
        title="Build a career that improves human lives."
        subtitle="Unicure India employs more than 600 professionals with approximately 100 highly qualified scientists, chemists, and technical personnel. Grow your career as part of our expanding pharmaceutical family."
      />

      {/* Highlights */}
      <section className="py-20 bg-white">
        <StaggerGrid className="container-x grid gap-6 md:grid-cols-3">
          {highlights.map((v) => (
            <StaggerItem key={v.title}>
              <div className="group rounded-3xl border border-border bg-white p-8 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                  <v.icon className="h-6 w-6" />
                </div>
                <div className="mt-5 text-xl font-bold text-foreground">{v.title}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Growth Stats Banner */}
      <section className="py-20 bg-[color:var(--brand-blue-dark)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,168,107,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,87,184,0.35),transparent_60%)]" />
        <div className="container-x relative">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              <span className="h-px w-8 bg-white/40" />
              Our Culture & Scale
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
              A workplace engineered for professional growth
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {growthStats.map((s) => (
              <div key={s.label} className="text-center glass-dark rounded-3xl p-8 border border-white/10">
                <div className="text-4xl md:text-5xl font-bold bg-[linear-gradient(90deg,#7dd3fc,#a7f3d0)] bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="mt-2 text-xs uppercase tracking-widest text-white/80 font-medium">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Current Opportunities Section */}
      <section className="py-24 bg-gradient-soft" id="open-positions">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary/40" />
              Open Positions
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Current Opportunities
            </h2>
            <p className="mt-3 text-muted-foreground text-base sm:text-lg">
              Click on any position to review detailed responsibilities, qualifications, and submit your application with CV.
            </p>
          </div>

          {/* Department Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveDeptFilter("all")}
              className={`rounded-full px-5 py-2 text-xs font-bold transition shadow-sm ${
                activeDeptFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-white text-muted-foreground border border-border hover:bg-secondary hover:text-foreground"
              }`}
            >
              All Openings ({openingsList.length})
            </button>
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActiveDeptFilter(dept)}
                className={`rounded-full px-5 py-2 text-xs font-bold transition shadow-sm ${
                  activeDeptFilter === dept
                    ? "bg-primary text-white"
                    : "bg-white text-muted-foreground border border-border hover:bg-secondary hover:text-foreground"
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Jobs Grid */}
          <div className="grid gap-5 max-w-4xl mx-auto">
            {filteredOpenings.map((job) => {
              const JobIcon = getDepartmentIcon(job.department);
              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedDetailsJob(job)}
                  className="group rounded-3xl border border-border bg-white p-6 sm:p-7 shadow-card hover:shadow-elegant hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                        <JobIcon className="h-6 w-6" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                            {job.title}
                          </h3>
                          <span className="inline-flex items-center text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 rounded-full">
                            Active Opening
                          </span>
                        </div>

                        {job.description && (
                          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {job.description}
                          </p>
                        )}

                        <div className="mt-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1.5 font-semibold text-foreground/90">
                            <Briefcase className="h-3.5 w-3.5 text-primary" />
                            {job.department}
                          </span>
                          <span className="flex items-center gap-1.5 font-semibold text-foreground/90">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                            {job.location}
                          </span>
                          {job.experience && (
                            <span className="flex items-center gap-1.5 bg-secondary/80 px-2.5 py-0.5 rounded-md text-[11px] font-bold text-foreground">
                              Exp: {job.experience}
                            </span>
                          )}
                          {job.qualifications && (
                            <span className="flex items-center gap-1.5 bg-secondary/80 px-2.5 py-0.5 rounded-md text-[11px] font-bold text-foreground">
                              <GraduationCap className="h-3 w-3 text-primary" />
                              {job.qualifications}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApplyClick(job.id);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white px-5 py-2.5 text-xs font-bold shadow transition"
                      >
                        Apply Now <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDetailsJob(job)}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-secondary/40 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition"
                        title="View Full Job Details"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* General Application Banner */}
          <div className="mt-10 max-w-4xl mx-auto rounded-3xl border border-primary/20 bg-white p-6 sm:p-8 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider">
                <Sparkles className="h-3.5 w-3.5" /> Open Speculative Applications
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Don't see your specific designation listed?
              </h3>
              <p className="text-xs text-muted-foreground max-w-xl">
                Submit a general profile and upload your CV to our talent database. We regularly recruit across technical, formulation, quality, and commercial disciplines.
              </p>
            </div>
            <Link
              to="/careers/apply"
              search={{ job: "general" } as any}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-brand text-white px-6 py-3 text-xs font-bold shadow-glow hover:opacity-95 transition shrink-0"
            >
              <FileText className="h-4 w-4" /> Submit CV Online
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-24 bg-white">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary/40" />
              Perks & Environment
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Why professionals choose Unicure
            </h2>
            <p className="mt-3 text-muted-foreground text-lg">
              We empower our team with modern pharmaceutical facilities, continuous skill development, and strong employee welfare.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-3xl bg-secondary/20 border border-border p-8 hover:border-primary/40 hover:bg-white hover:shadow-card transition-all"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary mb-5">
                  <b.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">{b.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="pb-24 overflow-hidden">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 md:p-14 text-white shadow-elegant text-center">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[color:var(--brand-green)]/40 blur-3xl" />
            <div className="relative space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-4xl font-bold">
                Have questions about working with us?
              </h2>
              <p className="text-white/85 text-base sm:text-lg leading-relaxed">
                Reach out directly to our Human Resources leadership. We are always looking for passionate talent to join our manufacturing plants and corporate offices.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <a
                  href="mailto:careers@unicureindia.com"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-[color:var(--brand-blue-dark)] shadow-elegant hover:shadow-glow transition"
                >
                  <Mail className="h-4 w-4" /> careers@unicureindia.com
                </a>
                <Link
                  to="/careers/apply"
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition"
                >
                  <FileText className="h-4 w-4" /> Submit Application Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          JOB DETAILS MODAL (Pop-up on click)
      ========================================== */}
      {selectedDetailsJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedDetailsJob(null)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {selectedDetailsJob.department}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  {selectedDetailsJob.employment_type || "Full-time"}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mt-2">
                {selectedDetailsJob.title}
              </h3>
              <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> {selectedDetailsJob.location}
                </span>
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Exp: {selectedDetailsJob.experience || "2+ Years"}
                </span>
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" /> {selectedDetailsJob.qualifications || "Pharma Graduate"}
                </span>
              </div>
            </div>

            {/* Role Overview */}
            <div className="space-y-2 border-t border-border pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Role Description:
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedDetailsJob.description}
              </p>
            </div>

            {/* Responsibilities */}
            {selectedDetailsJob.responsibilities && selectedDetailsJob.responsibilities.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Key Responsibilities:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  {selectedDetailsJob.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {selectedDetailsJob.requirements && selectedDetailsJob.requirements.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Required Qualifications & Skills:
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  {selectedDetailsJob.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Award className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills Badges */}
            {selectedDetailsJob.skills && selectedDetailsJob.skills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Core Competencies:
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedDetailsJob.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-xs text-muted-foreground">
                Delivered directly to HR at <strong>careers@unicureindia.com</strong>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedDetailsJob(null)}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-secondary transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const id = selectedDetailsJob.id;
                    setSelectedDetailsJob(null);
                    handleApplyClick(id);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand text-white px-6 py-2.5 text-xs font-bold shadow-glow hover:opacity-95 transition"
                >
                  Apply for this Role <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}