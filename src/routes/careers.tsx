import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import { useState } from "react";
import { toast } from "sonner";
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
  Loader2,
  Send,
} from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Careers — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Join a team of 600+ professionals building trusted healthcare at Unicure India Ltd.",
      },
      { property: "og:title", content: "Careers at Unicure India Ltd" },
      {
        property: "og:description",
        content: "Build a career at Unicure India.",
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
    desc: "Across manufacturing, R&D, quality, regulatory, sales and support.",
  },
  {
    icon: Sparkles,
    title: "100+ Technical Staff",
    desc: "Highly qualified scientists, chemists, microbiologists and engineers.",
  },
  {
    icon: HeartHandshake,
    title: "One Big Family",
    desc: "Grow with a company that has been in the industry for four decades.",
  },
];

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    desc: "Comprehensive medical insurance for you and your family with regular health check-ups.",
  },
  {
    icon: GraduationCap,
    title: "Learning & Development",
    desc: "Continuous skill development programs, certifications, and sponsored training.",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    desc: "Clear career paths with performance-based promotions and internal mobility.",
  },
  {
    icon: Clock,
    title: "Work-Life Balance",
    desc: "Flexible schedules, paid time off, and employee wellness initiatives.",
  },
  {
    icon: Shield,
    title: "Job Security",
    desc: "Four decades of stable growth and a recession-resistant pharmaceutical industry.",
  },
  {
    icon: Star,
    title: "Recognition",
    desc: "Employee awards, milestone celebrations, and performance bonuses.",
  },
];

const openings = [
  {
    title: "Quality Control Analyst",
    department: "Quality Assurance",
    location: "Greater Noida, UP",
    type: "Full-time",
    icon: FlaskConical,
  },
  {
    title: "Production Supervisor",
    department: "Manufacturing",
    location: "Roorkee, Uttarakhand",
    type: "Full-time",
    icon: Factory,
  },
  {
    title: "Formulation Scientist",
    department: "R&D",
    location: "Noida, UP",
    type: "Full-time",
    icon: Microscope,
  },
  {
    title: "Regulatory Affairs Executive",
    department: "Regulatory",
    location: "Noida, UP",
    type: "Full-time",
    icon: BadgeCheck,
  },
  {
    title: "Packaging Line Operator",
    department: "Manufacturing",
    location: "Greater Noida, UP",
    type: "Full-time",
    icon: Package,
  },
  {
    title: "Medical Sales Representative",
    department: "Commercial",
    location: "Pan India",
    type: "Full-time",
    icon: Briefcase,
  },
];

const growthStats = [
  { value: "40+", label: "Years of Legacy" },
  { value: "600+", label: "Team Members" },
  { value: "20+", label: "Departments" },
  { value: "95%", label: "Retention Rate" },
];

function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [appForm, setAppForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    qualifications: "",
    message: "",
  });

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appForm.name.trim() || !appForm.email.trim()) {
      toast.error("Please enter your name and email address.");
      return;
    }

    setSubmitting(true);

    const fullMessage = `JOB APPLICATION FOR: ${selectedJob}

Applicant Details:
- Full Name: ${appForm.name}
- Email: ${appForm.email}
- Phone: ${appForm.phone || "Not provided"}
- Years of Experience: ${appForm.experience || "Not provided"}
- Qualifications: ${appForm.qualifications || "Not provided"}

Cover Note / Profile Summary:
${appForm.message || "No cover note provided."}
`;

    try {
      const res = await submitCentralInquiry({
        name: appForm.name.trim(),
        email: appForm.email.trim(),
        phone: appForm.phone.trim(),
        message: fullMessage,
        inquiryType: `Job Application — ${selectedJob}`,
        source: "Careers Portal",
        pageUrl: "/careers",
      });

      setSubmitting(false);
      if (res.success) {
        toast.success("Application submitted successfully! Our HR team will review your CV.");
        setSelectedJob(null);
        setAppForm({ name: "", email: "", phone: "", experience: "", qualifications: "", message: "" });
      } else {
        toast.error(res.message);
      }
    } catch {
      setSubmitting(false);
      toast.error("Network error. Please email humanrealityofficial@gmail.com directly.");
    }
  };

  return (
    <SiteLayout>
      {/* Hero */}
      <PageHero
        eyebrow="Careers"
        title="Build a career that improves lives."
        subtitle="Unicure India employs more than 600 professionals with approximately 100 highly qualified staff and technical personnel. Our dream is to expand the company as one big family with passage of time."
      />

      {/* Highlights */}
      <section className="py-24">
        <StaggerGrid className="container-x grid gap-6 md:grid-cols-3">
          {highlights.map((v) => (
            <StaggerItem key={v.title}>
              <div
                className="group rounded-2xl border border-border bg-white p-8 shadow-card hover:shadow-elegant hover:-translate-y-1 transition-all duration-300"
              >
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                  <v.icon className="h-6 w-6" />
                </div>
                <div className="mt-5 text-lg font-semibold">{v.title}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* Growth Stats */}
      <section className="py-20 bg-[color:var(--brand-blue-dark)] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(0,168,107,0.25),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,87,184,0.35),transparent_60%)]" />
        <div className="container-x relative">
          <div className="text-center mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              <span className="h-px w-8 bg-white/40" />
              Our Growth
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
              A workplace that grows with you
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {growthStats.map((s) => (
              <div
                key={s.label}
                className="text-center glass-dark rounded-2xl p-8"
              >
                <div className="text-4xl md:text-5xl font-bold bg-[linear-gradient(90deg,#7dd3fc,#a7f3d0)] bg-clip-text text-transparent">
                  {s.value}
                </div>
                <div className="mt-2 text-sm uppercase tracking-widest text-white/70">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-gradient-soft">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary/40" />
              Perks & Benefits
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
              Why people love working here
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              We invest in our people because they are the foundation of
              everything we do.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl bg-white border border-border p-7 hover:border-primary/40 hover:shadow-card transition-all"
              >
                <b.icon className="h-8 w-8 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{b.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-24">
        <div className="container-x">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span className="h-px w-8 bg-primary/40" />
              Open Positions
            </span>
            <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">
              Current Opportunities
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Explore roles across our manufacturing, R&D, quality, and
              commercial teams.
            </p>
          </div>
          <div className="grid gap-4 max-w-4xl mx-auto">
            {openings.map((job) => (
              <div
                key={job.title}
                onClick={() => setSelectedJob(job.title)}
                className="group flex items-center gap-5 rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white shadow-glow">
                  <job.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-semibold group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full group-hover:bg-primary group-hover:text-white transition">
                      Apply Now
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {job.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {job.type}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 overflow-hidden">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-10 md:p-14 text-white shadow-elegant text-center">
            <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[color:var(--brand-green)]/40 blur-3xl" />
            <div className="relative">
              <h2 className="text-2xl md:text-4xl font-bold">
                Interested in joining Unicure?
              </h2>
              <p className="mt-3 text-white/85 max-w-xl mx-auto text-lg">
                Send your CV to our HR team. We regularly recruit across
                production, quality, R&D, regulatory and commercial roles.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href="mailto:humanrealityofficial@gmail.com"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-[color:var(--brand-blue-dark)] shadow-elegant hover:shadow-glow transition"
                >
                  <Mail className="h-4 w-4" /> humanrealityofficial@gmail.com
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-sm font-semibold hover:bg-white/10 transition"
                >
                  Contact HR <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-border space-y-5 animate-in zoom-in-95">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-secondary/80 text-muted-foreground hover:bg-secondary hover:text-foreground transition"
            >
              <X className="h-4 w-4" />
            </button>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Apply Online</span>
              <h3 className="text-xl font-bold text-foreground mt-0.5">{selectedJob}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your application will be delivered directly to our HR leadership at <strong>humanrealityofficial@gmail.com</strong>.
              </p>
            </div>

            <form onSubmit={handleApplySubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                  Full Name *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={appForm.name}
                  onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="rahul@example.com"
                    value={appForm.email}
                    onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                    className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={appForm.phone}
                    onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                    className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Years in QC"
                    value={appForm.experience}
                    onChange={(e) => setAppForm({ ...appForm, experience: e.target.value })}
                    className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                    Highest Qualification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. B.Pharm / M.Sc"
                    value={appForm.qualifications}
                    onChange={(e) => setAppForm({ ...appForm, qualifications: e.target.value })}
                    className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2.5 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1">
                  Profile Summary / Cover Note
                </label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your background, key skills, and why you would like to join Unicure India..."
                  value={appForm.message}
                  onChange={(e) => setAppForm({ ...appForm, message: e.target.value })}
                  className="w-full rounded-xl border border-border bg-secondary/30 px-3.5 py-2 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="rounded-xl border border-border px-4 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" /> Submit Application
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}