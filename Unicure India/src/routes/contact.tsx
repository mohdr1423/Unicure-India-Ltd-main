import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { FacilityMap } from "@/components/site/FacilityMap";
import { Mail, Phone, CheckCircle2, ArrowRight, Send, Loader2, AlertCircle, Youtube, Linkedin, ShoppingBag, Star } from "lucide-react";
import { useState, useRef } from "react";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { useSiteSetting } from "@/hooks/use-site-setting";
import { useSiteContent } from "@/hooks/use-site-content";
import { RichContent } from "@/components/site/RichContent";
import { motion, AnimatePresence } from "framer-motion";
import { submitCentralInquiry } from "@/lib/inquiry-service";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Unicure India — Get in Touch" },
      {
        name: "description",
        content:
          "Contact Unicure India's sales, export, and manufacturing teams. Request a quotation or partnership discussion.",
      },
      { property: "og:title", content: "Contact Unicure India" },
      { property: "og:description", content: "Sales, exports, and partnership inquiries." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type FormData = {
  name: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;
type SubmitState = "idle" | "submitting" | "success" | "error";

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */
const MAX_MESSAGE_LENGTH = 5000;

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.name.trim()) errors.name = "Please enter your full name.";
  if (!data.email.trim()) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Please enter a valid email address.";
  if (!data.message.trim()) errors.message = "Please tell us about your requirements.";
  else if (data.message.length > MAX_MESSAGE_LENGTH)
    errors.message = `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).`;
  return errors;
}

/* ------------------------------------------------------------------ */
/*  Country list (top countries + alphabetical)                        */
/* ------------------------------------------------------------------ */
const COUNTRIES = [
  "India",
  "United States",
  "United Kingdom",
  "United Arab Emirates",
  "Saudi Arabia",
  "South Africa",
  "Nigeria",
  "Kenya",
  "Tanzania",
  "Uganda",
  "Ghana",
  "Cameroon",
  "Senegal",
  "Afghanistan",
  "Algeria",
  "Argentina",
  "Australia",
  "Bangladesh",
  "Belgium",
  "Brazil",
  "Cambodia",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "DR Congo",
  "Egypt",
  "Ethiopia",
  "France",
  "Germany",
  "Indonesia",
  "Iraq",
  "Iran",
  "Italy",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kuwait",
  "Malaysia",
  "Mexico",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Oman",
  "Pakistan",
  "Philippines",
  "Poland",
  "Qatar",
  "Russia",
  "Singapore",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Sweden",
  "Switzerland",
  "Thailand",
  "Turkey",
  "Ukraine",
  "Uzbekistan",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
function ContactPage() {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [form, setForm] = useState<FormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    country: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const honeypotRef = useRef<HTMLInputElement>(null);

  const settings = useSiteSetting<{ body?: string }>("contact");
  const c = useSiteContent<{
    hero: { eyebrow: string; title: string; subtitle: string };
    units: {
      name: string;
      heading: string;
      address: string;
      email: string;
      phone: string;
    }[];
    form_title: string;
    form_intro: string;
    channels: { icon: "phone" | "email"; title: string; value: string }[];
  }>("page:contact");

  const defaultUnits = [
    {
      name: "Unit-I",
      heading: "Manufacturing Unit",
      address:
        "C-21, 22 & 23 Sector-3, Noida-201301, Distt. Gautam Buddha Nagar (U.P.)",
      email: "unicure@unicureindia.com",
      phone: "0120-4786786",
    },
    {
      name: "Unit-II",
      heading: "Manufacturing Unit",
      address:
        "Plot No. 46(B)/49B, Village Raipur, Bhagwanpur, Roorkee, Distt. Haridwar-247662, Uttarakhand",
      email: "unicure@unicureindia.com",
      phone: "0120-4786786",
    },
    {
      name: "Unit-III",
      heading: "Manufacturing Unit",
      address:
        "Plot No. 112 & 113, Ecotech-12, Behind Greater Noida (West), Bishrakh, Gautam Buddha Nagar, Uttar Pradesh-201310",
      email: "unicure@unicureindia.com",
      phone: "0120-4786786",
    },
  ];
  const units = c?.units?.length ? c.units : defaultUnits;
  const defaultChannels: {
    icon: "phone" | "email";
    title: string;
    value: string;
  }[] = [
    { icon: "phone", title: "Corporate Sales & Inquiries", value: "+91 120 4786786" },
    { icon: "email", title: "General & Corporate", value: "unicure@unicureindia.com" },
    {
      icon: "email",
      title: "Quotations & Exports",
      value: "inquiries@unicureindia.com",
    },
  ];
  const channels = c?.channels?.length ? c.channels : defaultChannels;

  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (touched.has(field)) {
      const newErrors = validate({ ...form, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
    }
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched((prev) => new Set(prev).add(field));
    const newErrors = validate(form);
    setErrors((prev) => ({ ...prev, [field]: newErrors[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(form);
    setErrors(newErrors);
    setTouched(new Set(Object.keys(form)));

    if (Object.keys(newErrors).length > 0) return;

    // Prevent duplicate submission
    if (submitState === "submitting") return;

    setSubmitState("submitting");
    setServerError("");

    try {
      const result = await submitCentralInquiry({
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        country: form.country.trim(),
        message: form.message.trim(),
        inquiryType: "Contact Form / Quotation Request",
        source: "Contact Page — Send an Inquiry Form",
        pageUrl: "/contact",
        website: honeypotRef.current?.value ?? "",
      });

      if (result.success) {
        setSuccessMessage(result.message);
        setSubmitState("success");
      } else {
        setServerError(result.message);
        setSubmitState("error");
      }
    } catch {
      setServerError(
        "We couldn't complete your enquiry right now. Please try again or email us directly at unicure@unicureindia.com.",
      );
      setSubmitState("error");
    }
  };

  const resetForm = () => {
    setSubmitState("idle");
    setForm({ name: "", company: "", email: "", phone: "", country: "", message: "" });
    setErrors({});
    setTouched(new Set());
    setServerError("");
    setSuccessMessage("");
  };

  return (
    <SiteLayout>
      <PageHero
        eyebrow={c?.hero?.eyebrow ?? "Contact"}
        title={c?.hero?.title ?? "Get in touch with Unicure India."}
        subtitle={
          c?.hero?.subtitle ??
          "Three manufacturing units across North India. Reach our sales, export or contract-manufacturing teams."
        }
      />

      {settings?.body ? (
        <section className="pt-16">
          <div className="container-x max-w-3xl">
            <RichContent html={settings.body} />
          </div>
        </section>
      ) : null}

      {/* Interactive Google Map & Unit Locations */}
      <FacilityMap />

      <section className="py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <ScrollReveal variant="slide-left">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">
                {c?.form_title ?? "Talk to our team"}
              </h2>
              <p className="text-muted-foreground">
                {c?.form_intro ??
                  "Whether you're an institutional buyer, an international distributor, or exploring a contract-manufacturing partnership — we'd love to hear from you."}
              </p>
              {channels.map((ch) => (
                <div
                  key={ch.title}
                  className="flex gap-4 rounded-2xl border border-border p-6 shadow-card bg-white hover:shadow-elegant transition-all"
                >
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-brand text-white">
                    {ch.icon === "phone" ? (
                      <Phone className="h-5 w-5" />
                    ) : (
                      <Mail className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{ch.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {ch.value}
                    </div>
                  </div>
                </div>
              ))}

              {/* Official Media & YouTube Channel Card */}
              <div className="rounded-2xl border border-border p-6 bg-gradient-to-br from-white to-secondary/30 shadow-card">
                <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                  Official Channels & Media
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <a
                    href="https://youtube.com/@unicureindialtd9851?si=iPi8Tic09i2XwITk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-700 px-3 py-2.5 text-xs font-semibold transition-all hover:scale-[1.02]"
                  >
                    <Youtube className="h-4 w-4 text-red-600 shrink-0" />
                    <span>YouTube</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/unicure-india-ltd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 px-3 py-2.5 text-xs font-semibold transition-all hover:scale-[1.02]"
                  >
                    <Linkedin className="h-4 w-4 text-blue-600 shrink-0" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href="https://www.indiamart.com/company/2819872/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-700 px-3 py-2.5 text-xs font-semibold transition-all hover:scale-[1.02]"
                  >
                    <ShoppingBag className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>IndiaMART</span>
                  </a>
                  <a
                    href="https://www.justdial.com/Noida/Unicure-India-Pvt-Ltd-Near-Uco-Bank-Noida-Sector-3/011PXX11-XX11-000772394792-T8E2_BZDET"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100 text-amber-700 px-3 py-2.5 text-xs font-semibold transition-all hover:scale-[1.02]"
                  >
                    <Star className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>Justdial</span>
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="slide-right" delay={0.1}>
            <AnimatePresence mode="wait">
              {submitState === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-3xl border border-border bg-white p-8 md:p-10 shadow-elegant text-center flex flex-col items-center justify-center min-h-[400px]"
                >
                  <div className="grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600 mb-6">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold">Thank you!</h3>
                  <p className="mt-3 text-muted-foreground max-w-sm">
                    {successMessage ||
                      "Your inquiry has been received. Our team will get back to you shortly."}
                  </p>
                  <button
                    onClick={resetForm}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
                  >
                    Send another inquiry{" "}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="rounded-3xl border border-border bg-white p-8 md:p-10 shadow-elegant space-y-5"
                  noValidate
                >
                  <h2 className="text-2xl font-bold">Send an Inquiry</h2>

                  {/* Server error banner */}
                  {serverError && (
                    <div className="flex items-start gap-3 rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <p className="text-sm text-destructive">{serverError}</p>
                    </div>
                  )}

                  {/* Honeypot — hidden from users, catches bots */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="contact-website">Website</label>
                    <input
                      ref={honeypotRef}
                      id="contact-website"
                      name="website"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field
                      label="Full Name"
                      name="name"
                      id="contact-name"
                      value={form.name}
                      onChange={(v) => updateField("name", v)}
                      onBlur={() => handleBlur("name")}
                      error={errors.name}
                      required
                      autoComplete="name"
                    />
                    <Field
                      label="Company"
                      name="company"
                      id="contact-company"
                      value={form.company}
                      onChange={(v) => updateField("company", v)}
                      autoComplete="organization"
                    />
                    <Field
                      label="Email"
                      name="email"
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={(v) => updateField("email", v)}
                      onBlur={() => handleBlur("email")}
                      error={errors.email}
                      required
                      autoComplete="email"
                    />
                    <Field
                      label="Phone Number"
                      name="phone"
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={(v) => updateField("phone", v)}
                      autoComplete="tel"
                    />
                    {/* Country dropdown */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="contact-country"
                        className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                      >
                        Country
                      </label>
                      <select
                        id="contact-country"
                        name="country"
                        value={form.country}
                        onChange={(e) => updateField("country", e.target.value)}
                        className="mt-2 w-full rounded-xl border border-border bg-secondary/40 px-4 py-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
                      >
                        <option value="">Select country (optional)</option>
                        {COUNTRIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                      Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      value={form.message}
                      onChange={(e) =>
                        updateField(
                          "message",
                          e.target.value.slice(0, MAX_MESSAGE_LENGTH),
                        )
                      }
                      onBlur={() => handleBlur("message")}
                      className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
                        errors.message
                          ? "border-destructive focus:ring-2 focus:ring-destructive/20"
                          : "border-border bg-secondary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }`}
                      placeholder="Tell us about your requirements..."
                      maxLength={MAX_MESSAGE_LENGTH}
                    />
                    <div className="flex justify-between mt-1">
                      {errors.message ? (
                        <p className="text-xs text-destructive" role="alert">
                          {errors.message}
                        </p>
                      ) : (
                        <span />
                      )}
                      <span className="text-[10px] text-muted-foreground">
                        {form.message.length}/{MAX_MESSAGE_LENGTH}
                      </span>
                    </div>
                  </div>

                  {/* Submit button with states */}
                  <button
                    type="submit"
                    disabled={submitState === "submitting"}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-8 py-3.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition disabled:opacity-70 disabled:cursor-not-allowed min-w-[180px]"
                  >
                    {submitState === "submitting" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending Inquiry...
                      </>
                    ) : submitState === "error" ? (
                      <>
                        <AlertCircle className="h-4 w-4" />
                        Try Again
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Inquiry
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </ScrollReveal>
        </div>
      </section>
    </SiteLayout>
  );
}

/* ------------------------------------------------------------------ */
/*  Reusable field component                                           */
/* ------------------------------------------------------------------ */
function Field({
  label,
  name,
  id,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  id: string;
  type?: string;
  value?: string;
  onChange?: (v: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-widest text-muted-foreground"
      >
        {label}{" "}
        {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`mt-2 w-full rounded-xl border px-4 py-3 text-sm outline-none transition-colors ${
          error
            ? "border-destructive focus:ring-2 focus:ring-destructive/20"
            : "border-border bg-secondary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
        }`}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}