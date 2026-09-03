import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import { useState, useEffect, useRef, useId } from "react";
import { submitCentralInquiry } from "@/lib/inquiry-service";
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
  Upload,
  Loader2,
  Send,
  AlertCircle,
  Building2,
  Trash2,
  Paperclip,
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
      { property: "og:url", content: "https://unicureindialtd.vercel.app/careers" },
    ],
    links: [{ rel: "canonical", href: "https://unicureindialtd.vercel.app/careers" }],
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
    description:
      "Responsible for sampling, testing, and analytical validation of raw materials, in-process formulations, and finished dosage forms according to WHO-GMP specifications.",
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
    description:
      "Supervising granulation, compression, and coating lines for tablets and capsules. Ensuring strict batch record documentation and adherence to cGMP safety protocols.",
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
    description:
      "Formulation development and optimization for novel and generic oral dosage forms, technology transfer to commercial plants, and stability study analysis.",
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
    description:
      "Preparation and submission of dossiers (CTD/ACTD format) for domestic and international health authorities across Latin America, Africa, and CIS markets.",
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
    description:
      "Operation and maintenance of blister packaging machines, cartoners, and labeling lines in high-speed pharmaceutical packaging environments.",
    responsibilities: [
      "Operate Alu-Alu and Blister packaging machinery, strip packing units, and automatic cartoners.",
      "Perform machine changeovers and primary leak testing for blister packs.",
      "Verify batch coding, MRP, and expiry date printing on secondary cartons.",
    ],
    requirements: ["ITI Certificate or Diploma with 1-3 years in pharma packaging operations."],
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
    description:
      "Managing institutional hospital tenders, corporate pharmacy supply contracts, and large-scale distributor relationships across North India.",
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
  const [applyingJob, setApplyingJob] = useState<JobOpening | null>(null);
  const [activeDeptFilter, setActiveDeptFilter] = useState("all");

  // Application Form States
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("1-3 Years");
  const [qualification, setQualification] = useState("B.Pharma");
  const [currentCompany, setCurrentCompany] = useState("");
  const [noticePeriod, setNoticePeriod] = useState("30 Days");
  const [expectedCtc, setExpectedCtc] = useState("");
  const [coverNote, setCoverNote] = useState("");

  // Resume File States
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumeFileSize, setResumeFileSize] = useState("");
  const [resumeDataUrl, setResumeDataUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

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

  // Check URL params on mount to auto-open application if ?job=... or ?apply=... is present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      const targetJobId = url.searchParams.get("job") || url.searchParams.get("apply");
      if (targetJobId) {
        if (targetJobId === "general") {
          handleOpenApplyModal({
            id: "general",
            title: "General Speculative Application",
            department: "All Departments",
            location: "Corporate / All Plants",
            employment_type: "Full-time",
            description: "General application for current or future pharmaceutical opportunities.",
            is_open: true,
          });
        } else {
          const match = openingsList.find((j) => j.id === targetJobId);
          if (match) {
            handleOpenApplyModal(match);
          }
        }
      }
    }
  }, [openingsList]);

  const departments = Array.from(new Set(openingsList.map((j) => j.department).filter(Boolean)));

  const filteredOpenings = openingsList.filter((job) => {
    if (activeDeptFilter !== "all" && job.department !== activeDeptFilter) return false;
    return true;
  });

  // Open Application Form Modal
  const handleOpenApplyModal = (job: JobOpening) => {
    setApplyingJob(job);
    setIsSubmitted(false);
    setSubmitError(null);
  };

  // Handle Resume File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    // File validation: up to 10MB
    if (file.size > 10 * 1024 * 1024) {
      setSubmitError("File size exceeds 10MB limit. Please upload a smaller PDF or Word file.");
      return;
    }

    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

    setResumeFile(file);
    setResumeFileName(file.name);
    setResumeFileSize(sizeFormatted);
    setSubmitError(null);

    // Convert file to Data URL
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setResumeDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setResumeFileName("");
    setResumeFileSize("");
    setResumeDataUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle Form Submit
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingJob) return;

    if (!fullName.trim()) {
      setSubmitError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setSubmitError("Please enter a valid email address.");
      return;
    }
    if (!phone.trim()) {
      setSubmitError("Please enter your contact phone / WhatsApp number.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const jobRoleTitle = applyingJob.title || "Pharmaceutical Role";
      const userMessage =
        coverNote.trim() ||
        `Candidate Application for ${jobRoleTitle}. Experience: ${experience}, Qualification: ${qualification}, Location: ${city || "Not specified"}, Notice Period: ${noticePeriod}, Expected CTC: ${expectedCtc || "Negotiable"}.`;

      const result = await submitCentralInquiry({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        company: currentCompany.trim() || "Job Applicant",
        country: "India",
        inquiryType: `Job Application — ${jobRoleTitle}`,
        source: "Careers Application Form",
        message: userMessage,
        metadata: {
          jobId: applyingJob.id,
          jobTitle: jobRoleTitle,
          department: applyingJob.department,
          jobLocation: applyingJob.location,
          candidateCity: city.trim(),
          experience,
          qualification,
          currentCompany: currentCompany.trim(),
          noticePeriod,
          expectedCtc: expectedCtc.trim(),
          resumeFileName: resumeFileName || "No CV attached",
          resumeFileSize: resumeFileSize || "N/A",
          resumeDataUrl: resumeDataUrl || "", // Enables 1-click CV download in Admin Leads Portal
          submittedAt: new Date().toISOString(),
        },
      });

      if (result.success) {
        setIsSubmitted(true);
      } else {
        setSubmitError(
          result.message ||
            "Unable to submit application at this time. You can email your CV directly to careers@unicureindia.com.",
        );
      }
    } catch (err) {
      console.error("[Careers Form] Submission error:", err);
      setSubmitError(
        "Network connection error. Please try again or email careers@unicureindia.com.",
      );
    } finally {
      setIsSubmitting(false);
    }
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
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
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
              <div
                key={s.label}
                className="text-center glass-dark rounded-3xl p-8 border border-white/10"
              >
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
              Click on any position to review detailed responsibilities and submit your candidate
              application with CV.
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
                          handleOpenApplyModal(job);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-white px-5 py-2.5 text-xs font-bold shadow transition cursor-pointer"
                      >
                        Apply Now <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedDetailsJob(job)}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-border bg-secondary/40 text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition cursor-pointer"
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
                Submit a general profile and upload your CV to our talent database. We regularly
                recruit across technical, formulation, quality, and commercial disciplines.
              </p>
            </div>
            <button
              onClick={() =>
                handleOpenApplyModal({
                  id: "general",
                  title: "General Speculative Application",
                  department: "General / All Departments",
                  location: "Corporate Office & Plants",
                  employment_type: "Full-time",
                  description:
                    "General candidate registration for upcoming pharmaceutical openings.",
                  is_open: true,
                })
              }
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-brand text-white px-6 py-3 text-xs font-bold shadow-glow hover:opacity-95 transition shrink-0 cursor-pointer"
            >
              <FileText className="h-4 w-4" /> Submit CV Online
            </button>
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
              We empower our team with modern pharmaceutical facilities, continuous skill
              development, and strong employee welfare.
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
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
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
                Reach out directly to our Human Resources leadership. We are always looking for
                passionate talent to join our manufacturing plants and corporate offices.
              </p>
              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <a
                  href="mailto:careers@unicureindia.com"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs sm:text-sm font-bold text-[color:var(--brand-blue-dark)] shadow-elegant hover:shadow-glow transition"
                >
                  <Mail className="h-4 w-4" /> careers@unicureindia.com
                </a>
                <button
                  onClick={() =>
                    handleOpenApplyModal({
                      id: "general",
                      title: "General Talent Application",
                      department: "General Application",
                      location: "Noida / Greater Noida / Roorkee",
                      employment_type: "Full-time",
                      description: "Talent application for upcoming pharmaceutical openings.",
                      is_open: true,
                    })
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition cursor-pointer"
                >
                  <FileText className="h-4 w-4" /> Submit Application Form
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          1. JOB DETAILS MODAL
      ========================================== */}
      {selectedDetailsJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-border space-y-6 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedDetailsJob(null)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition cursor-pointer"
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
                  <Clock className="h-3.5 w-3.5 text-primary" /> Exp:{" "}
                  {selectedDetailsJob.experience || "2+ Years"}
                </span>
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />{" "}
                  {selectedDetailsJob.qualifications || "Pharma Graduate"}
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
            {selectedDetailsJob.responsibilities &&
              selectedDetailsJob.responsibilities.length > 0 && (
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
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-bold text-muted-foreground hover:bg-secondary transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    const job = selectedDetailsJob;
                    setSelectedDetailsJob(null);
                    handleOpenApplyModal(job);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand text-white px-6 py-2.5 text-xs font-bold shadow-glow hover:opacity-95 transition cursor-pointer"
                >
                  Apply for this Role <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          2. CANDIDATE JOB APPLICATION MODAL (WITH CV UPLOAD)
      ========================================== */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-border my-8 animate-in zoom-in-95 max-h-[92vh] overflow-y-auto">
            {/* Close Modal Button */}
            <button
              onClick={() => setApplyingJob(null)}
              className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            {/* State: SUCCESS CONFIRMATION */}
            {isSubmitted ? (
              <div className="py-8 text-center space-y-6">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-glow">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <h3 className="text-2xl font-bold text-foreground">
                    Application Submitted Successfully!
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Thank you, <strong>{fullName}</strong>! Your application and CV for{" "}
                    <strong>{applyingJob.title}</strong> have been securely delivered directly to
                    our Human Resources team.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-xs text-muted-foreground max-w-md mx-auto space-y-1">
                  <div>
                    <strong>Application ID:</strong> UNICURE-APP-{Date.now().toString().slice(-6)}
                  </div>
                  <div>
                    <strong>Confirmation Email:</strong> {email}
                  </div>
                  <div>
                    <strong>Resume File:</strong> {resumeFileName || "Profile Recorded"}
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    onClick={() => {
                      setApplyingJob(null);
                      setIsSubmitted(false);
                    }}
                    className="rounded-2xl bg-gradient-brand text-white px-8 py-3 text-xs font-bold shadow-glow hover:opacity-95 transition cursor-pointer"
                  >
                    Done / Browse More Openings
                  </button>
                </div>
              </div>
            ) : (
              /* State: APPLICATION FORM */
              <form onSubmit={handleFormSubmit} className="space-y-6">
                {/* Form Header */}
                <div>
                  <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full mb-2">
                    <Sparkles className="h-3.5 w-3.5" /> Candidate Job Application
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    Apply for: {applyingJob.title}
                  </h2>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">{applyingJob.department}</span>
                    <span>•</span>
                    <span>{applyingJob.location}</span>
                    {applyingJob.experience && (
                      <>
                        <span>•</span>
                        <span>Exp: {applyingJob.experience}</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Error Banner */}
                {submitError && (
                  <div className="flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs text-red-700 animate-in fade-in">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Candidate Personal Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
                    1. Personal Information
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="rahul.sharma@example.com"
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Phone / WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Current City / Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Noida / New Delhi / Roorkee"
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional & Qualifications */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1">
                    2. Professional Qualifications
                  </h4>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Total Pharma Experience
                      </label>
                      <select
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      >
                        <option value="Fresher (0-1 yr)">Fresher (0 - 1 Year)</option>
                        <option value="1-3 Years">1 - 3 Years</option>
                        <option value="3-5 Years">3 - 5 Years</option>
                        <option value="5-8 Years">5 - 8 Years</option>
                        <option value="8-12 Years">8 - 12 Years</option>
                        <option value="12+ Years">12+ Years (Senior Lead)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Highest Qualification
                      </label>
                      <select
                        value={qualification}
                        onChange={(e) => setQualification(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      >
                        <option value="B.Pharma">B.Pharma (Bachelor of Pharmacy)</option>
                        <option value="M.Pharma">M.Pharma (Master of Pharmacy)</option>
                        <option value="B.Sc Chemistry">B.Sc (Chemistry / Life Sciences)</option>
                        <option value="M.Sc Chemistry / Analytical">
                          M.Sc (Chemistry / Analytical)
                        </option>
                        <option value="Diploma in Pharma Tech">
                          Diploma in Pharma Tech / D.Pharma
                        </option>
                        <option value="ITI / Technical">ITI / Technical Certificate</option>
                        <option value="B.Tech / Engineering">B.Tech / Chemical / Biotech</option>
                        <option value="Graduate / MBA">Graduate / MBA / Commercial</option>
                        <option value="Ph.D.">Ph.D. / Doctorate</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Current / Previous Employer & Role
                      </label>
                      <input
                        type="text"
                        value={currentCompany}
                        onChange={(e) => setCurrentCompany(e.target.value)}
                        placeholder="e.g. ABC Pharma Ltd — Quality Officer"
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Notice Period
                      </label>
                      <select
                        value={noticePeriod}
                        onChange={(e) => setNoticePeriod(e.target.value)}
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      >
                        <option value="Immediate Joiner">Immediate Joiner (0 - 7 Days)</option>
                        <option value="15 Days">15 Days</option>
                        <option value="30 Days">30 Days (1 Month)</option>
                        <option value="45 Days">45 Days</option>
                        <option value="60 Days">60 Days (2 Months)</option>
                        <option value="90 Days">90 Days (3 Months)</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-foreground mb-1">
                        Expected Annual CTC (₹ INR / Annum)
                      </label>
                      <input
                        type="text"
                        value={expectedCtc}
                        onChange={(e) => setExpectedCtc(e.target.value)}
                        placeholder="e.g. ₹ 4.5 LPA / Negotiable"
                        className="w-full rounded-xl border border-border bg-white px-3.5 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Resume / CV Upload Section */}
                <div className="space-y-2">
                  <label
                    htmlFor={fileInputId}
                    className="block text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-1"
                  >
                    3. Upload CV / Resume (PDF / Word)
                  </label>

                  <input
                    id={fileInputId}
                    type="file"
                    ref={fileInputRef}
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {resumeFileName ? (
                    <div className="flex items-center justify-between p-3.5 rounded-2xl border border-emerald-300 bg-emerald-50/70 text-xs">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white font-bold">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-foreground truncate">{resumeFileName}</div>
                          <div className="text-[11px] text-emerald-700 flex items-center gap-1.5 font-medium">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                            {resumeFileSize} • Attached and ready to submit
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 bg-white border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 transition cursor-pointer shrink-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="group border-2 border-dashed border-border hover:border-primary bg-secondary/30 hover:bg-primary/5 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2"
                    >
                      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white border border-border shadow-sm text-primary group-hover:scale-110 transition">
                        <Upload className="h-6 w-6" />
                      </div>
                      <div className="text-xs font-bold text-foreground group-hover:text-primary transition">
                        Click here to browse or drag & drop your Resume / CV
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Supports PDF, DOC, DOCX files up to 10MB
                      </div>
                    </div>
                  )}
                </div>

                {/* Candidate Message / Cover Note */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-foreground">
                    Cover Note / Message for HR (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={coverNote}
                    onChange={(e) => setCoverNote(e.target.value)}
                    placeholder="Briefly highlight your key technical skills, formulation expertise, or reason for applying..."
                    className="w-full rounded-xl border border-border bg-white p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Your information will be securely reviewed by Unicure HR.</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setApplyingJob(null)}
                      className="rounded-xl border border-border px-5 py-2.5 text-xs font-bold text-muted-foreground hover:bg-secondary transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand text-white px-7 py-2.5 text-xs font-bold shadow-glow hover:opacity-95 disabled:opacity-50 transition cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" /> Submitting Application...
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" /> Submit Application & CV
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
