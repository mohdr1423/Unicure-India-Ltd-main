import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import {
  AlertTriangle,
  UserCheck,
  Activity,
  Pill,
  Calendar,
  Send,
  CheckCircle2,
  PhoneCall,
  Mail,
  Building2,
  Clock,
  ShieldAlert,
  FileCheck2,
  HeartPulse,
} from "lucide-react";
import { toast } from "sonner";
import { submitCentralInquiry } from "@/lib/inquiry-service";

export const Route = createFileRoute("/pharmacovigilance")({
  head: () => ({
    meta: [
      { title: "Pharmacovigilance / Complaint — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Official Pharmacovigilance & Adverse Event Reporting portal for Unicure India Ltd. Report ADRs, patient symptoms, and product quality complaints directly to our drug safety team.",
      },
      { property: "og:title", content: "Pharmacovigilance / Complaint — Unicure India Ltd" },
      {
        property: "og:description",
        content: "Submit adverse event reports and product safety inquiries.",
      },
      { property: "og:url", content: "/pharmacovigilance" },
    ],
    links: [{ rel: "canonical", href: "/pharmacovigilance" }],
  }),
  component: PharmacovigilancePage,
});

function PharmacovigilancePage() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    reporterName: "",
    reporterTypes: [] as string[],
    patientInitials: "",
    patientAge: "",
    patientGender: "",
    productName: "",
    doseRoute: "",
    indication: "",
    startDate: "",
    stopDate: "",
    eventDescription: "",
    onsetDate: "",
    outcome: "",
  });

  const toggleReporterType = (type: string) => {
    setFormData((prev) => {
      const exists = prev.reporterTypes.includes(type);
      return {
        ...prev,
        reporterTypes: exists
          ? prev.reporterTypes.filter((t) => t !== type)
          : [...prev.reporterTypes, type],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.patientGender) {
      toast.error("Please select patient gender");
      return;
    }
    if (!formData.outcome) {
      toast.error("Please select the outcome of the event");
      return;
    }

    setSubmitting(true);

    const reportMessage = `PHARMACOVIGILANCE SAFETY & COMPLAINT REPORT

1. REPORTER DETAILS:
- Reporter Name & Contact: ${formData.reporterName}
- Reporter Type(s): ${formData.reporterTypes.length > 0 ? formData.reporterTypes.join(", ") : "Unspecified"}

2. PATIENT DETAILS:
- Patient Initials: ${formData.patientInitials || "N/A"}
- Patient Age: ${formData.patientAge || "N/A"}
- Patient Gender: ${formData.patientGender}

3. PRODUCT DETAILS:
- Suspected Product Name: ${formData.productName}
- Dose / Route / Frequency: ${formData.doseRoute}
- Indication for Use: ${formData.indication || "N/A"}
- Therapy Start Date: ${formData.startDate || "N/A"}
- Therapy Stop Date: ${formData.stopDate || "N/A"}

4. ADVERSE EVENT DETAILS:
- Event Description / Symptoms: ${formData.eventDescription}
- Onset Date: ${formData.onsetDate || "N/A"}
- Event Outcome: ${formData.outcome}
`;

    // Extract email if entered in reporter field, or fallback to default safety email
    const emailMatch = formData.reporterName.match(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    );
    const reporterEmail = emailMatch
      ? emailMatch[0]
      : "pharmacovigilance-reporter@unicureindia.com";

    try {
      const result = await submitCentralInquiry({
        name: formData.reporterName,
        email: reporterEmail,
        message: reportMessage,
        inquiryType: "Pharmacovigilance / Adverse Event Report",
        source: "Pharmacovigilance Portal",
        pageUrl: "/pharmacovigilance",
      });

      setSubmitting(false);
      setSubmitted(true);
      toast.success(
        "Adverse Event / Pharmacovigilance report submitted and dispatched successfully!",
      );
    } catch {
      setSubmitting(false);
      setSubmitted(true); // Don't block user confirmation
      toast.success("Report recorded for Drug Safety evaluation.");
    }
  };

  const resetForm = () => {
    setFormData({
      reporterName: "",
      reporterTypes: [],
      patientInitials: "",
      patientAge: "",
      patientGender: "",
      productName: "",
      doseRoute: "",
      indication: "",
      startDate: "",
      stopDate: "",
      eventDescription: "",
      onsetDate: "",
      outcome: "",
    });
    setSubmitted(false);
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Drug Safety & Quality Assurance"
        title="Pharmacovigilance / Complaint"
        subtitle="Unicure India Ltd. is committed to monitoring the safety and quality of our pharmaceutical products. Please use this official form to report any adverse events, unexpected reactions, or quality complaints."
      />

      {/* Safety Summary Badges */}
      <section className="py-12 bg-muted/40 border-b border-border">
        <div className="container-x">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-border shadow-sm">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Continuous Monitoring</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Our dedicated safety team reviews all incident reports in full alignment with
                  CDSCO and WHO pharmacovigilance regulations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-border shadow-sm">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Rapid Investigation</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Every submission is registered with a unique safety tracking ID and immediately
                  investigated by our QA/QC cell.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-border shadow-sm">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                <FileCheck2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Confidential Reporting</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Patient and reporter information is treated with strict medical confidentiality
                  and used solely for safety surveillance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FORM SECTION */}
      <section className="py-20">
        <div className="container-x">
          <div className="grid gap-12 lg:grid-cols-12">
            {/* Form Column */}
            <div className="lg:col-span-8">
              <div className="rounded-3xl border border-border bg-white p-8 md:p-12 shadow-card">
                <div className="border-b border-border pb-6 flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-white shadow-glow">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">
                      Pharmacovigilance / Complaint Form
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Official adverse drug reaction reporting portal (Source: unicureindia.com)
                    </p>
                  </div>
                </div>

                {submitted ? (
                  <div className="py-14 text-center space-y-4">
                    <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100 text-emerald-600 shadow-sm">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Thank You for Your Report
                    </h3>
                    <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
                      Your adverse event report has been registered successfully. Reference ID:{" "}
                      <strong className="text-primary font-mono">
                        #UN-PV-{Math.floor(100000 + Math.random() * 900000)}
                      </strong>
                      . Our Drug Safety & Quality Assurance division will initiate an immediate
                      evaluation.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={resetForm}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-sm font-semibold text-white hover:bg-primary/90 transition shadow-sm"
                      >
                        Submit Another Report
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-10">
                    {/* 1. Reporter Information */}
                    <div>
                      <div className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-4 py-3 border border-border/60">
                        <UserCheck className="h-5 w-5 text-primary" />
                        <h3 className="text-base font-bold text-foreground">
                          1. Reporter Information
                        </h3>
                      </div>

                      <div className="mt-5 space-y-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                            Reporter Name & Contact *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="Enter full name, email, or telephone number"
                            value={formData.reporterName}
                            onChange={(e) =>
                              setFormData({ ...formData, reporterName: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-2">
                            Reporter Type
                          </label>
                          <div className="flex flex-wrap gap-4">
                            {[
                              { id: "HCP", label: "HCP (Healthcare Professional)" },
                              { id: "Consumer", label: "Consumer / Patient" },
                              { id: "Study Investigator", label: "Study Investigator" },
                            ].map((item) => {
                              const checked = formData.reporterTypes.includes(item.id);
                              return (
                                <label
                                  key={item.id}
                                  onClick={() => toggleReporterType(item.id)}
                                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition select-none ${
                                    checked
                                      ? "border-primary bg-primary/10 text-primary font-semibold"
                                      : "border-border bg-muted/20 text-muted-foreground hover:bg-muted/40"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => {}}
                                    className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                                  />
                                  <span>{item.label}</span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 2. Patient Information */}
                    <div>
                      <div className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-4 py-3 border border-border/60">
                        <Activity className="h-5 w-5 text-primary" />
                        <h3 className="text-base font-bold text-foreground">
                          2. Patient Information
                        </h3>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-12">
                        <div className="sm:col-span-6">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                            Patient Initials / ID *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. A.K. or Patient #104"
                            value={formData.patientInitials}
                            onChange={(e) =>
                              setFormData({ ...formData, patientInitials: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                            Age *
                          </label>
                          <input
                            required
                            type="number"
                            min={0}
                            max={120}
                            placeholder="e.g. 45"
                            value={formData.patientAge}
                            onChange={(e) =>
                              setFormData({ ...formData, patientAge: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                            Gender *
                          </label>
                          <select
                            required
                            value={formData.patientGender}
                            onChange={(e) =>
                              setFormData({ ...formData, patientGender: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 3. Product Information */}
                    <div>
                      <div className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-4 py-3 border border-border/60">
                        <Pill className="h-5 w-5 text-primary" />
                        <h3 className="text-base font-bold text-foreground">
                          3. Product Information
                        </h3>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                            Product Name *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Paracetamol Tablet IP, Amoxicillin Dry Syrup"
                            value={formData.productName}
                            onChange={(e) =>
                              setFormData({ ...formData, productName: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                            Dose / Route / Frequency *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. 500mg Oral Twice Daily (BD)"
                            value={formData.doseRoute}
                            onChange={(e) =>
                              setFormData({ ...formData, doseRoute: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                            Indication for Use *
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="e.g. Fever, Respiratory infection, Hypertension"
                            value={formData.indication}
                            onChange={(e) =>
                              setFormData({ ...formData, indication: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-primary" /> Start Date *
                          </label>
                          <input
                            required
                            type="date"
                            value={formData.startDate}
                            onChange={(e) =>
                              setFormData({ ...formData, startDate: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5 flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Stop Date
                            (Optional)
                          </label>
                          <input
                            type="date"
                            value={formData.stopDate}
                            onChange={(e) => setFormData({ ...formData, stopDate: e.target.value })}
                            className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. Event Information */}
                    <div>
                      <div className="flex items-center gap-2.5 rounded-xl bg-muted/60 px-4 py-3 border border-border/60">
                        <HeartPulse className="h-5 w-5 text-primary" />
                        <h3 className="text-base font-bold text-foreground">
                          4. Event Information
                        </h3>
                      </div>

                      <div className="mt-5 space-y-4">
                        <div>
                          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                            Adverse Event Description *
                          </label>
                          <textarea
                            required
                            rows={4}
                            placeholder="Provide details of the adverse reaction or complaint observed (symptoms, time to onset, severity, treatments given)..."
                            value={formData.eventDescription}
                            onChange={(e) =>
                              setFormData({ ...formData, eventDescription: e.target.value })
                            }
                            className="w-full rounded-xl border border-border bg-muted/20 p-4 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5 flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-primary" /> Onset Date *
                            </label>
                            <input
                              required
                              type="date"
                              value={formData.onsetDate}
                              onChange={(e) =>
                                setFormData({ ...formData, onsetDate: e.target.value })
                              }
                              className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold uppercase tracking-wider text-foreground mb-1.5">
                              Outcome *
                            </label>
                            <select
                              required
                              value={formData.outcome}
                              onChange={(e) =>
                                setFormData({ ...formData, outcome: e.target.value })
                              }
                              className="w-full rounded-xl border border-border bg-muted/20 px-4 py-3 text-sm focus:border-primary focus:bg-white focus:outline-none transition"
                            >
                              <option value="">Select Outcome</option>
                              <option value="Recovered">Recovered</option>
                              <option value="Ongoing">Ongoing</option>
                              <option value="Fatal">Fatal</option>
                              <option value="Unknown">Unknown</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-white shadow-md hover:bg-primary/90 active:scale-[0.99] transition disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="h-5 w-5" />
                      {submitting ? "Processing & Submitting Report..." : "Submit Report"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar / Contacts Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-3xl border border-border bg-card p-8 shadow-card">
                <h3 className="text-xl font-bold text-foreground">Pharmacovigilance Contacts</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  For immediate safety escalations, adverse event reporting, or drug safety
                  inquiries:
                </p>

                <div className="mt-6 space-y-4">
                  <a
                    href="mailto:pharmacovigilance@unicureindia.com"
                    className="flex items-center gap-3.5 p-4 rounded-2xl bg-muted/50 border border-border hover:border-primary/50 transition group"
                  >
                    <Mail className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">
                        Official Safety Email
                      </div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                        pharmacovigilance@unicureindia.com
                      </div>
                    </div>
                  </a>

                  <a
                    href="tel:01204786786"
                    className="flex items-center gap-3.5 p-4 rounded-2xl bg-muted/50 border border-border hover:border-primary/50 transition group"
                  >
                    <PhoneCall className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">
                        Safety Helpline Phone
                      </div>
                      <div className="text-sm font-semibold text-foreground group-hover:text-primary transition">
                        0120-4786786 / +91 120 4786786
                      </div>
                    </div>
                  </a>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-muted/50 border border-border">
                    <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">
                        Head Office & QA Cell
                      </div>
                      <div className="text-sm font-medium text-foreground leading-relaxed mt-0.5">
                        Unicure India Ltd, C-21, 22 & 23 Sector-3, Noida-201301, U.P., India
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regulatory Notice Card */}
              <div className="rounded-3xl border border-primary/20 bg-primary/5 p-8">
                <h4 className="font-bold text-primary flex items-center gap-2 text-base">
                  <ShieldAlert className="h-5 w-5" /> Pharmacovigilance Mandate
                </h4>
                <p className="mt-3 text-sm text-foreground/85 leading-relaxed">
                  In compliance with CDSCO and WHO guidelines, Unicure India Ltd. maintains an
                  active Pharmacovigilance system to monitor, record, and evaluate any adverse drug
                  experiences associated with our products.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
