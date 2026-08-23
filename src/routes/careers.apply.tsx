import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useState, useEffect, useRef } from "react";
import { submitCentralInquiry } from "@/lib/inquiry-service";
import {
  Briefcase,
  MapPin,
  Clock,
  GraduationCap,
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  Building2,
  Mail,
  Phone,
  ArrowLeft,
  Sparkles,
  Shield,
  Award,
  ChevronRight,
} from "lucide-react";
import type { JobOpening } from "./api/careers";

export const Route = createFileRoute("/careers/apply")({
  head: () => ({
    meta: [
      { title: "Apply for Careers — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Submit your job application and CV/resume to join 600+ professionals building quality healthcare at Unicure India Ltd.",
      },
      { property: "og:title", content: "Apply for Careers at Unicure India Ltd" },
      {
        property: "og:description",
        content: "Submit your CV and explore career growth at Unicure India Ltd.",
      },
      { property: "og:url", content: "/careers/apply" },
    ],
    links: [{ rel: "canonical", href: "/careers/apply" }],
  }),
  component: CareersApplyPage,
});

const DEFAULT_FALLBACK_JOBS: JobOpening[] = [
  {
    id: "job_qc_analyst",
    title: "Quality Control Analyst",
    department: "Quality Assurance",
    location: "Greater Noida, UP",
    employment_type: "Full-time",
    experience: "2-5 Years",
    qualifications: "B.Sc / M.Sc Chemistry or B.Pharma",
    description: "Responsible for sampling, testing, and analytical validation of raw materials, in-process formulations, and finished dosage forms according to WHO-GMP specifications.",
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
    description: "Supervising granulation, compression, and coating lines for tablets and capsules. Ensuring strict batch record documentation.",
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
    description: "Formulation development and optimization for novel and generic oral dosage forms, technology transfer, and stability analysis.",
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
    description: "Preparation and submission of dossiers (CTD/ACTD format) for international health authorities.",
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
    description: "Operation and maintenance of blister packaging machines, cartoners, and labeling lines.",
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
    description: "Managing institutional hospital tenders, corporate pharmacy supply contracts, and distributor relationships.",
    is_open: true,
  },
];

function CareersApplyPage() {
  const [jobs, setJobs] = useState<JobOpening[]>(DEFAULT_FALLBACK_JOBS);
  const [selectedJobId, setSelectedJobId] = useState<string>("general");
  const [selectedJob, setSelectedJob] = useState<JobOpening | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    currentCity: "",
    experience: "2-5 Years",
    qualification: "B.Pharma",
    currentCompany: "",
    noticePeriod: "30 Days",
    coverNote: "",
  });

  // Resume Upload State
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [submissionRefId, setSubmissionRefId] = useState<string>("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch Jobs & Parse query param
  useEffect(() => {
    fetch("/api/careers")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setJobs(data.jobs);
        }
      })
      .catch(() => {});

    // Parse URL query parameter
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlJobId = params.get("job") || params.get("id");
      if (urlJobId) {
        setSelectedJobId(urlJobId);
      }
    }
  }, []);

  // Update selected job object whenever selectedJobId or jobs list changes
  useEffect(() => {
    if (selectedJobId && selectedJobId !== "general") {
      const found = jobs.find(
        (j) => j.id === selectedJobId || j.title?.toLowerCase() === selectedJobId?.toLowerCase()
      );
      setSelectedJob(found || null);
    } else {
      setSelectedJob(null);
    }
  }, [selectedJobId, jobs]);

  // Handle Resume File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setResumeError("File size exceeds 10MB limit. Please upload a smaller file.");
      return;
    }

    // Validate file extension
    const allowedExtensions = [".pdf", ".doc", ".docx"];
    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
      setResumeError("Only PDF (.pdf) and Word documents (.doc, .docx) are accepted.");
      return;
    }

    setResumeFile(file);

    // Convert file to Base64 data URL
    const reader = new FileReader();
    reader.onload = () => {
      setResumeBase64(reader.result as string);
    };
    reader.onerror = () => {
      setResumeError("Failed to read file. Please try selecting the file again.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setResumeBase64(null);
    setResumeError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!formData.fullName.trim()) {
      setSubmitError("Please provide your Full Name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setSubmitError("Please enter a valid email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setSubmitError("Please provide your contact phone number.");
      return;
    }

    setIsSubmitting(true);

    const positionTitle = selectedJob ? selectedJob.title : "General Career Application";
    const jobDepartment = selectedJob ? selectedJob.department : "General Pool";
    const jobLocation = selectedJob ? selectedJob.location : "Noida / Roorkee Plants";

    const formattedMessage = `CANDIDATE JOB APPLICATION

Position Applied: ${positionTitle}
Department: ${jobDepartment}
Preferred Location: ${jobLocation}

Applicant Summary:
• Full Name: ${formData.fullName.trim()}
• Email: ${formData.email.trim()}
• Contact Number: ${formData.phone.trim()}
• Current Location / City: ${formData.currentCity.trim() || "Not specified"}
• Total Experience: ${formData.experience}
• Highest Qualification: ${formData.qualification}
• Current Employer: ${formData.currentCompany.trim() || "Not specified"}
• Notice Period: ${formData.noticePeriod}

Resume / CV Attached: ${resumeFile ? `${resumeFile.name} (${(resumeFile.size / 1024 / 1024).toFixed(2)} MB)` : "No file attached (Profile submitted via online form)"}

Candidate Cover Note / Skills:
${formData.coverNote.trim() || "Candidate submitted profile for consideration across open opportunities."}
`;

    try {
      const res = await submitCentralInquiry({
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        company: formData.currentCompany.trim() || undefined,
        inquiryType: `Job Application — ${positionTitle}`,
        source: `Careers Portal / Online Application (${positionTitle})`,
        pageUrl: "/careers/apply",
        message: formattedMessage,
        metadata: {
          jobId: selectedJob?.id || "general",
          jobTitle: positionTitle,
          department: jobDepartment,
          candidateExperience: formData.experience,
          candidateQualification: formData.qualification,
          candidateCity: formData.currentCity,
          noticePeriod: formData.noticePeriod,
          resumeFileName: resumeFile ? resumeFile.name : null,
          resumeFileSize: resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : null,
          resumeFileType: resumeFile ? resumeFile.type : null,
          resumeDataUrl: resumeBase64 || null,
        },
      });

      if (res.success) {
        setSubmissionRefId(res.inquiryId || `APP-${Date.now().toString().slice(-6)}`);
        setSubmittedSuccess(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setSubmitError(res.message || "Failed to submit application. Please try again.");
      }
    } catch {
      setSubmitError("Network connection error. Please email careers@unicureindia.com directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Careers & Opportunities"
        title="Submit Your Job Application"
        subtitle="Take the next step in your pharmaceutical career. Join 600+ professionals across our WHO-GMP certified manufacturing, QA, R&D, and commercial divisions."
      />

      <div className="bg-gradient-soft py-12 md:py-20">
        <div className="container-x max-w-6xl">
          {/* Breadcrumb Navigation */}
          <div className="mb-8 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Link to="/" className="hover:text-primary transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/careers" className="hover:text-primary transition">
              Careers
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-bold">Apply Online</span>
          </div>

          {/* Success Screen */}
          {submittedSuccess ? (
            <div className="rounded-3xl border border-emerald-500/20 bg-white p-8 md:p-14 shadow-card text-center max-w-2xl mx-auto space-y-6 animate-in zoom-in-95">
              <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-glow">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                  Application Received
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-1">
                  Thank you, {formData.fullName}!
                </h2>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto leading-relaxed">
                  Your application for <strong>{selectedJob ? selectedJob.title : "General Pharma Opportunities"}</strong> has been delivered directly to our Human Resources leadership team.
                </p>
              </div>

              <div className="rounded-2xl bg-secondary/50 border border-border p-4 text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="text-muted-foreground">Application Reference ID:</div>
                <div className="text-base font-mono font-bold text-primary">{submissionRefId}</div>
                {resumeFile && (
                  <div className="text-muted-foreground pt-1 flex items-center justify-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>CV Attached: {resumeFile.name}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
                Our HR department reviews applications weekly. If your profile matches our requirements, we will contact you directly via phone or email for technical interviews.
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <Link
                  to="/careers"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition"
                >
                  <Briefcase className="h-4 w-4" /> Explore Other Openings
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-xs font-bold text-foreground hover:bg-secondary transition"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          ) : (
            /* Main Form Layout (2 Columns) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Job Summary & Company Highlights */}
              <div className="lg:col-span-5 space-y-6">
                {/* Job Selector Card */}
                <div className="rounded-3xl border border-border bg-white p-6 sm:p-8 shadow-card space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Selected Position
                    </span>
                    <Link
                      to="/careers"
                      className="text-xs font-semibold text-muted-foreground hover:text-primary transition flex items-center gap-1"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" /> View all roles
                    </Link>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                      Applying For:
                    </label>
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="w-full rounded-2xl border border-border bg-secondary/30 px-4 py-3 text-sm font-semibold text-foreground focus:border-primary focus:bg-white focus:outline-none transition cursor-pointer"
                    >
                      <option value="general">★ General Application / Future Openings</option>
                      {jobs.map((j) => (
                        <option key={j.id} value={j.id}>
                          {j.title} ({j.department} — {j.location})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Active Job Information Snapshot */}
                  {selectedJob ? (
                    <div className="space-y-4 pt-2 border-t border-border/80">
                      <div>
                        <h3 className="text-xl font-bold text-foreground">{selectedJob.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                          {selectedJob.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded-xl bg-secondary/40 p-3 border border-border/60">
                          <span className="text-[10px] font-semibold uppercase text-muted-foreground block">
                            Department
                          </span>
                          <span className="font-bold text-foreground mt-0.5 flex items-center gap-1">
                            <Briefcase className="h-3 w-3 text-primary" /> {selectedJob.department}
                          </span>
                        </div>
                        <div className="rounded-xl bg-secondary/40 p-3 border border-border/60">
                          <span className="text-[10px] font-semibold uppercase text-muted-foreground block">
                            Plant Location
                          </span>
                          <span className="font-bold text-foreground mt-0.5 flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-primary" /> {selectedJob.location}
                          </span>
                        </div>
                        <div className="rounded-xl bg-secondary/40 p-3 border border-border/60">
                          <span className="text-[10px] font-semibold uppercase text-muted-foreground block">
                            Experience Required
                          </span>
                          <span className="font-bold text-foreground mt-0.5 flex items-center gap-1">
                            <Clock className="h-3 w-3 text-primary" /> {selectedJob.experience || "2+ Years"}
                          </span>
                        </div>
                        <div className="rounded-xl bg-secondary/40 p-3 border border-border/60">
                          <span className="text-[10px] font-semibold uppercase text-muted-foreground block">
                            Qualifications
                          </span>
                          <span className="font-bold text-foreground mt-0.5 flex items-center gap-1 truncate">
                            <GraduationCap className="h-3 w-3 text-primary" /> {selectedJob.qualifications || "Degree / Diploma"}
                          </span>
                        </div>
                      </div>

                      {/* Responsibilities list if available */}
                      {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                            Key Responsibilities:
                          </h4>
                          <ul className="space-y-1.5 text-xs text-muted-foreground">
                            {selectedJob.responsibilities.slice(0, 4).map((r, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl bg-secondary/40 p-4 border border-border/60 space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                        <Sparkles className="h-4 w-4 text-primary" /> General Profile Submission
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Don't see an exact matching position? Submit your CV to our talent database. We regularly recruit across Quality Control, Production, Regulatory Affairs, R&D, and Commercial divisions.
                      </p>
                    </div>
                  )}
                </div>

                {/* Why Unicure Box */}
                <div className="rounded-3xl border border-border bg-white p-6 shadow-card space-y-4">
                  <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Award className="h-4 w-4 text-primary" /> Why Join Unicure India Ltd?
                  </h4>
                  <div className="space-y-3 text-xs text-muted-foreground">
                    <div className="flex items-start gap-2.5">
                      <Shield className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>40+ Years of Pharma Leadership:</strong> Stable, recession-resilient career with continuous career mobility.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Building2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span><strong>WHO-GMP Certified Facilities:</strong> Work with advanced analytical equipment (HPLC, GC) and automated manufacturing lines.</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Mail className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span><strong>Direct HR Helpline:</strong> Questions? Reach our recruitment team directly at <a href="mailto:careers@unicureindia.com" className="text-primary font-semibold underline">careers@unicureindia.com</a>.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Comprehensive Application Form */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-border bg-white p-6 sm:p-10 shadow-card space-y-6">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary">
                      Candidate Details
                    </span>
                    <h3 className="text-2xl font-bold text-foreground mt-0.5">
                      Application Form
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Please complete the form below and attach your latest CV / Resume.
                    </p>
                  </div>

                  {submitError && (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-xs font-semibold text-red-600 flex items-center gap-2.5">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rahul Sharma"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-white focus:outline-none transition"
                      />
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="rahul.sharma@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-white focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                          Phone / Mobile *
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-white focus:outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Current City & Highest Qualification */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                          Current Location / City *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Noida / Delhi / Haridwar"
                          value={formData.currentCity}
                          onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                          className="w-full rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-white focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                          Highest Qualification *
                        </label>
                        <select
                          value={formData.qualification}
                          onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                          className="w-full rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-white focus:outline-none transition cursor-pointer"
                        >
                          <option value="B.Pharma">B.Pharma</option>
                          <option value="M.Pharma (Pharmaceutics/QA/RA)">M.Pharma</option>
                          <option value="B.Sc Chemistry / Bio">B.Sc Chemistry / Biology</option>
                          <option value="M.Sc Chemistry / Organic">M.Sc Chemistry</option>
                          <option value="Diploma in Pharmacy / Pharma Tech">Diploma in Pharmacy</option>
                          <option value="ITI / Technical Diploma">ITI / Technical Certificate</option>
                          <option value="MBA / BBA / Graduate">MBA / Graduate</option>
                          <option value="Ph.D / Doctorate">Ph.D in Pharmaceutical Sciences</option>
                          <option value="Other">Other Qualification</option>
                        </select>
                      </div>
                    </div>

                    {/* Experience & Notice Period */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                          Total Pharma Experience
                        </label>
                        <select
                          value={formData.experience}
                          onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                          className="w-full rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-white focus:outline-none transition cursor-pointer"
                        >
                          <option value="Fresher / Entry Level">Fresher / Entry Level (0-1 Year)</option>
                          <option value="1-3 Years">1 - 3 Years</option>
                          <option value="3-5 Years">3 - 5 Years</option>
                          <option value="5-8 Years">5 - 8 Years</option>
                          <option value="8-12 Years">8 - 12 Years</option>
                          <option value="12+ Years">12+ Years (Senior / Leadership)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                          Notice Period
                        </label>
                        <select
                          value={formData.noticePeriod}
                          onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                          className="w-full rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-white focus:outline-none transition cursor-pointer"
                        >
                          <option value="Immediate Joiner">Immediate Joiner</option>
                          <option value="15 Days">15 Days</option>
                          <option value="30 Days">30 Days (1 Month)</option>
                          <option value="60 Days">60 Days (2 Months)</option>
                          <option value="90 Days">90 Days (3 Months)</option>
                        </select>
                      </div>
                    </div>

                    {/* Current Company (Optional) */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                        Current Company & Designation (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Senior QC Chemist at ABC Pharma Ltd"
                        value={formData.currentCompany}
                        onChange={(e) => setFormData({ ...formData, currentCompany: e.target.value })}
                        className="w-full rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-white focus:outline-none transition"
                      />
                    </div>

                    {/* Resume / CV Upload Component */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                        Attach Resume / CV *
                      </label>

                      {resumeFile ? (
                        /* Selected File Preview Box */
                        <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/50 p-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white shadow-sm">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-foreground truncate">
                                {resumeFile.name}
                              </div>
                              <div className="text-xs text-muted-foreground flex items-center gap-2">
                                <span>{(resumeFile.size / 1024).toFixed(1)} KB</span>
                                <span>•</span>
                                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                  <CheckCircle2 className="h-3 w-3" /> Ready for upload
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white border border-border text-muted-foreground hover:bg-red-50 hover:text-red-500 transition"
                            title="Remove file"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        /* Dropzone / Upload Trigger */
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="group rounded-2xl border-2 border-dashed border-border hover:border-primary bg-secondary/20 hover:bg-primary/5 p-6 text-center cursor-pointer transition space-y-2"
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                            onChange={handleFileChange}
                            className="hidden"
                          />
                          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white shadow-sm group-hover:scale-105 group-hover:bg-primary group-hover:text-white transition text-primary">
                            <Upload className="h-6 w-6" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-foreground group-hover:text-primary transition">
                              Click to upload your CV
                            </span>
                            <span className="text-xs text-muted-foreground block mt-0.5">
                              Supports PDF, DOC, DOCX (Max size: 10 MB)
                            </span>
                          </div>
                        </div>
                      )}

                      {resumeError && (
                        <p className="mt-2 text-xs font-semibold text-red-500 flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          {resumeError}
                        </p>
                      )}
                    </div>

                    {/* Cover Note / Brief Introduction */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-foreground mb-1.5">
                        Cover Note / Profile Highlights (Optional)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Highlight your key pharmaceutical skills, analytical instruments operated, certifications, or reason for applying..."
                        value={formData.coverNote}
                        onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                        className="w-full rounded-2xl border border-border bg-secondary/20 px-4 py-3 text-sm text-foreground focus:border-primary focus:bg-white focus:outline-none transition"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-8 py-4 text-sm font-bold text-white shadow-elegant hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Submitting Application & CV...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" /> Submit Application to Unicure HR
                          </>
                        )}
                      </button>
                      <p className="text-[11px] text-muted-foreground text-center mt-2.5">
                        Your personal details and CV are treated with strict confidentiality under pharmaceutical recruitment standards.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}
