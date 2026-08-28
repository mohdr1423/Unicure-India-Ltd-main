import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Mail,
  MapPin,
  Phone,
  Linkedin,
  Youtube,
  Globe,
  ShoppingBag,
  Star,
  ChevronDown,
  Lock,
} from "lucide-react";
import { useSiteChrome } from "./SiteChromeContext";
import { AnimatePresence, motion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Social icon map — only icons for which we have verified accounts   */
/* ------------------------------------------------------------------ */
const ICONS: Record<string, any> = {
  linkedin: Linkedin,
  youtube: Youtube,
  indiamart: ShoppingBag,
  justdial: Star,
  globe: Globe,
};

/* ------------------------------------------------------------------ */
/*  Hardcoded fallback footer columns matching the client's spec       */
/* ------------------------------------------------------------------ */
const SPEC_COLUMNS = [
  {
    title: "About Unicure India",
    links: [
      { label: "Home", to: "/" },
      { label: "About Company", to: "/about" },
      { label: "Executive Leadership", to: "/leadership" },
      { label: "Director's Message", to: "/md-message" },
      { label: "Certifications", to: "/certifications" },
    ],
  },
  {
    title: "Manufacturing",
    links: [
      { label: "Operational Units", to: "/manufacturing" },
      { label: "Dosage Forms", to: "/dosage-forms" },
      { label: "Contract Manufacturing", to: "/contract-manufacturing" },
      { label: "QA & QC Lab", to: "/quality" },
    ],
  },
  {
    title: "Commercial & Business",
    links: [
      { label: "Co-Manufacturing", to: "/contract-manufacturing" },
      { label: "Institutional Sales", to: "/contract-manufacturing" },
      { label: "Global Exports", to: "/exports" },
      { label: "Careers & Jobs", to: "/careers" },
    ],
  },
  {
    title: "Regulatory & Support",
    links: [
      { label: "Pharmacovigilance (Safety)", to: "/pharmacovigilance" },
      { label: "Product Portfolio", to: "/products" },
      { label: "Downloads & Profile", to: "/downloads" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Verified social media destinations                                 */
/* ------------------------------------------------------------------ */
const VERIFIED_SOCIAL = [
  {
    label: "LinkedIn",
    url: "https://www.linkedin.com/company/unicure-india-ltd/",
    icon: "linkedin",
    title: "UNICURE INDIA LTD on LinkedIn",
  },
  {
    label: "YouTube",
    url: "https://youtube.com/@unicureindialtd9851?si=iPi8Tic09i2XwITk",
    icon: "youtube",
    title: "UNICURE INDIA LTD on YouTube",
  },
  {
    label: "IndiaMART",
    url: "https://www.indiamart.com/company/2819872/",
    icon: "indiamart",
    title: "Unicure India on IndiaMART",
  },
  {
    label: "Justdial",
    url: "https://www.justdial.com/Noida/Unicure-India-Pvt-Ltd-Near-Uco-Bank-Noida-Sector-3/011PXX11-XX11-000772394792-T8E2_BZDET",
    icon: "justdial",
    title: "Unicure India on Justdial",
  },
];

/* ------------------------------------------------------------------ */
/*  Logo with graceful fallback                                        */
/* ------------------------------------------------------------------ */
function FooterLogo() {
  const [failed, setFailed] = useState(false);

  if (failed) {
    // Graceful fallback: styled text initials instead of broken image
    return (
      <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-white font-bold text-lg select-none shrink-0">
        UI
      </div>
    );
  }

  return (
    <img
      src="/images/logo.svg"
      alt="Unicure India Ltd logo"
      className="h-12 w-12 object-contain shrink-0 bg-transparent"
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Collapsible nav group for mobile                                   */
/* ------------------------------------------------------------------ */
function FooterAccordion({
  title,
  links,
}: {
  title: string;
  links: { label: string; to: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 lg:border-0">
      {/* Mobile: clickable toggle. Desktop: static heading */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-3 lg:pointer-events-none lg:pb-4 lg:pt-0"
        aria-expanded={open}
      >
        <h4 className="text-white font-semibold text-sm uppercase tracking-wider">{title}</h4>
        <ChevronDown
          className={`h-4 w-4 text-white/50 transition-transform lg:hidden ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Mobile: animated collapse. Desktop: always visible */}
      <div className="hidden lg:block">
        <ul className="space-y-2.5 text-sm pb-2">
          {links.map((l, i) => (
            <li key={i}>
              <Link to={l.to as any} className="text-white/70 hover:text-white transition-colors">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="space-y-2.5 text-sm pb-3">
              {links.map((l, i) => (
                <li key={i}>
                  <Link
                    to={l.to as any}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Footer component                                              */
/* ------------------------------------------------------------------ */
export function Footer() {
  const { branding, footer } = useSiteChrome();

  // Use spec columns if CMS doesn't provide any, or if CMS columns are empty
  const columns = footer?.columns?.length ? footer.columns : SPEC_COLUMNS;

  // Use verified social links — never use unverified "#" links
  const social = VERIFIED_SOCIAL;

  const legal: Array<{ label: string; url: string }> = footer?.legal ?? [];

  return (
    <footer className="bg-[color:var(--brand-blue-dark)] text-white/80">
      {/* Main footer content */}
      <div className="container-x py-12 lg:py-16">
        {/* Mobile: stacked brand + nav. Desktop: grid layout */}
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
          {/* Brand column */}
          <div className="space-y-5">
            {/* Logo + Company Name — no overlap */}
            <div className="flex items-center gap-3">
              <FooterLogo />
              <div>
                <div className="font-bold text-white text-lg leading-tight">
                  {branding?.company_name ?? "Unicure India Ltd"}
                </div>
                <div className="text-[11px] uppercase tracking-[0.15em] text-white/50 mt-0.5">
                  {footer?.since ?? "Since 1984"}
                </div>
              </div>
            </div>

            {/* Tagline */}
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              {footer?.tagline ??
                "WHO-GMP certified pharmaceutical manufacturing delivering trusted healthcare products to 20+ countries worldwide."}
            </p>

            {/* Social Icons */}
            <div className="flex gap-3 flex-wrap">
              {social.map((s, i) => {
                const IconComponent = ICONS[s.icon?.toLowerCase?.() ?? ""] ?? Globe;
                return (
                  <a
                    key={i}
                    href={s.url}
                    aria-label={s.label}
                    title={s.title ?? s.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <IconComponent className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation columns */}
          {columns.map((col: any, idx: number) => (
            <FooterAccordion key={idx} title={col.title} links={col.links ?? []} />
          ))}
        </div>

        {/* Contact info row */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row gap-6 text-sm">
            {branding?.address && (
              <div className="flex gap-3 items-start">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-white/50" />
                <span className="text-white/70">{branding.address}</span>
              </div>
            )}
            {branding?.phone && (
              <a
                href={`tel:${branding.phone.replace(/[^+\d]/g, "")}`}
                className="flex gap-3 items-center hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 shrink-0 text-white/50" />
                <span className="text-white/70">{branding.phone}</span>
              </a>
            )}
            {branding?.email && (
              <a
                href={`mailto:${branding.email}`}
                className="flex gap-3 items-center hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 shrink-0 text-white/50" />
                <span className="text-white/70">{branding.email}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-x py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>
            © {new Date().getFullYear()}{" "}
            {footer?.copyright ?? "Unicure India. All rights reserved."}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            {legal.map((l, i) => (
              <a key={i} href={l.url} className="hover:text-white transition-colors">
                {l.label}
              </a>
            ))}
            <Link
              to={"/leads-portal" as any}
              className="hover:text-emerald-400 text-white/40 transition-colors inline-flex items-center gap-1"
            >
              <Lock className="h-3 w-3" />
              <span>Admin Leads</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Extra bottom padding on mobile for MobileCTA bar */}
      <div className="h-16 lg:hidden" aria-hidden="true" />
    </footer>
  );
}
