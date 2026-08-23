import { useEffect, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import {
  Menu,
  X,
  Phone,
  ChevronDown,
  Building2,
  Users,
  Award,
  Factory,
  Pill,
  ShoppingBag,
  ShieldCheck,
  Globe,
  Handshake,
  HeartHandshake,
  Briefcase,
  Mail,
  Lock,
  FileText,
  MessageSquareText,
  Home,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useSiteChrome } from "./SiteChromeContext";
import { TopBanner } from "./TopBanner";

interface NavLinkItem {
  to: string;
  label: string;
  subLabel?: string;
  icon?: any;
}

interface NavGroupItem {
  label: string;
  children: NavLinkItem[];
}

type NavItem = NavLinkItem | NavGroupItem;

// Complete comprehensive navigation definition
const COMPREHENSIVE_NAV: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  {
    label: "About Us",
    children: [
      { to: "/about", label: "About Unicure India", subLabel: "40+ Years of Excellence", icon: Building2 },
      { to: "/leadership", label: "Leadership & Directors", subLabel: "Executive Board", icon: Users },
      { to: "/certifications", label: "Accreditations & Certifications", subLabel: "WHO-GMP, ISO Certified", icon: Award },
      { to: "/md-message", label: "Director's Message", subLabel: "Vision & Philosophy", icon: MessageSquareText },
      { to: "/downloads", label: "Downloads & Catalogs", subLabel: "Company Profile & Lists", icon: FileText },
    ],
  },
  {
    label: "Manufacturing",
    children: [
      { to: "/manufacturing", label: "Operational Units", subLabel: "State-of-the-art Plants", icon: Factory },
      { to: "/dosage-forms", label: "Dosage Forms & Capabilities", subLabel: "Tablets, Capsules, Liquids, Injections", icon: Pill },
      { to: "/contract-manufacturing", label: "Contract & Third-Party Mfg", subLabel: "Loan License & P2P", icon: Handshake },
    ],
  },
  { to: "/products", label: "Products", icon: ShoppingBag },
  { to: "/quality", label: "Quality & R&D", icon: ShieldCheck },
  { to: "/exports", label: "Exports", icon: Globe },
  { to: "/contract-manufacturing", label: "Co-Manufacturing", icon: Handshake },
  { to: "/pharmacovigilance", label: "Pharmacovigilance", icon: HeartHandshake },
  { to: "/careers", label: "Careers", icon: Briefcase },
  { to: "/contact", label: "Contact", icon: Mail },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { branding, nav: navCfg } = useSiteChrome();
  const reduce = useReducedMotion();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const nav = COMPREHENSIVE_NAV;

  const ctaLabel: string = navCfg?.cta_label ?? "Get a Quote";
  const ctaTo: string = navCfg?.cta_to ?? "/contact";
  const phoneNum: string = branding?.phone ?? "8882674843";

  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      if (headerRef.current) {
        const h = headerRef.current.offsetHeight;
        document.documentElement.style.setProperty("--header-height", `${h}px`);
      }
    };

    updateHeaderHeight();

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && headerRef.current) {
      ro = new ResizeObserver(() => updateHeaderHeight());
      ro.observe(headerRef.current);
    }

    window.addEventListener("resize", updateHeaderHeight);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openDropdown = (label: string) => {
    clearTimeout(dropdownTimeout.current);
    setDropdownOpen(label);
  };
  const closeDropdown = () => {
    dropdownTimeout.current = setTimeout(() => setDropdownOpen(null), 150);
  };

  return (
    <>
      <header
        ref={headerRef}
        id="site-header"
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl border-b border-border shadow-[0_1px_12px_rgba(0,0,0,0.06)]"
            : "bg-gradient-to-b from-slate-950/80 via-slate-900/40 to-transparent"
        }`}
      >
        <TopBanner />
        <div className="container-x flex h-18 items-center justify-between py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 shrink-0 max-w-[calc(100%-3.5rem)] lg:max-w-none">
            <HeaderLogo scrolled={scrolled} />
            <div className="flex flex-col leading-none min-w-0">
              <span
                className={`font-bold text-base sm:text-lg tracking-tight transition-colors truncate ${
                  scrolled
                    ? "text-[color:var(--brand-blue)]"
                    : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                }`}
              >
                {branding?.site_name ?? "Unicure India"}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] uppercase tracking-[0.2em] transition-colors truncate ${
                  scrolled
                    ? "text-muted-foreground"
                    : "text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                }`}
              >
                {branding?.tagline ?? "Limited"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Bar */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
            {nav.map((n) =>
              "children" in n && n.children ? (
                <div
                  key={n.label}
                  className="relative"
                  onMouseEnter={() => openDropdown(n.label)}
                  onMouseLeave={closeDropdown}
                >
                  <button
                    className={`flex items-center gap-1 px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-medium transition-colors rounded-full hover:bg-secondary ${
                      scrolled
                        ? "text-foreground/85 hover:text-primary"
                        : "text-white/90 hover:text-white hover:bg-white/15"
                    }`}
                    aria-expanded={dropdownOpen === n.label}
                    aria-haspopup="true"
                  >
                    <span>{n.label}</span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform ${
                        dropdownOpen === n.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen === n.label && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 mt-1.5 min-w-[260px] rounded-2xl border border-border bg-white/98 backdrop-blur-xl p-2 shadow-2xl z-50"
                      >
                        {n.children.map((child) => {
                          const IconComp = child.icon || Building2;
                          return (
                            <Link
                              key={child.to}
                              to={child.to as any}
                              className="flex items-start gap-3 rounded-xl p-2.5 text-xs xl:text-sm text-foreground/80 hover:bg-secondary/80 hover:text-primary transition-colors group"
                              activeProps={{
                                className: "text-primary bg-secondary",
                              }}
                              onClick={() => setDropdownOpen(null)}
                            >
                              <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors shrink-0 mt-0.5">
                                <IconComp className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                  {child.label}
                                </div>
                                {child.subLabel && (
                                  <div className="text-[11px] text-muted-foreground">
                                    {child.subLabel}
                                  </div>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={"to" in n ? n.to : n.label}
                  to={("to" in n ? n.to : "/") as any}
                  className={`px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-medium transition-colors rounded-full hover:bg-secondary ${
                    scrolled
                      ? "text-foreground/85 hover:text-primary"
                      : "text-white/90 hover:text-white hover:bg-white/15"
                  }`}
                  activeProps={{ className: "text-primary bg-secondary font-semibold" }}
                >
                  {n.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {phoneNum && (
              <a
                href={`tel:${phoneNum.replace(/[^+\d]/g, "")}`}
                className={`flex items-center gap-1.5 text-xs xl:text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-[color:var(--brand-blue-dark)] hover:text-primary"
                    : "text-white/90 hover:text-white"
                }`}
              >
                <Phone className="h-3.5 w-3.5 text-primary" /> {phoneNum}
              </a>
            )}
            <Link
              to={ctaTo as any}
              className="inline-flex items-center rounded-full bg-gradient-brand px-4 xl:px-5 py-2 text-xs xl:text-sm font-semibold text-white shadow-glow hover:opacity-95 transition cursor-pointer"
            >
              {ctaLabel}
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            aria-label="Toggle navigation menu"
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary/80 text-foreground border border-border/60"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer — Full & Comprehensive */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[49] bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Drawer Panel */}
            <motion.div
              key="mobile-panel"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 z-[49] overflow-y-auto overflow-x-hidden bg-white/98 backdrop-blur-xl border-b border-border shadow-2xl lg:hidden"
              style={{
                top: "var(--header-height, 72px)",
                maxHeight: "calc(100dvh - var(--header-height, 72px))",
              }}
            >
              <div className="container-x py-5 flex flex-col gap-4">
                {/* 1. Quick Navigation Links */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 py-1">
                    Main Menu
                  </div>

                  {nav.map((n) =>
                    "children" in n && n.children ? (
                      <MobileDropdown
                        key={n.label}
                        label={n.label}
                        items={n.children}
                        onNavigate={() => setMobileOpen(false)}
                      />
                    ) : (
                      <Link
                        key={"to" in n ? n.to : n.label}
                        to={("to" in n ? n.to : "/") as any}
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium hover:bg-secondary transition-colors text-foreground"
                        activeProps={{ className: "text-primary bg-secondary font-semibold" }}
                      >
                        {"icon" in n && n.icon && (
                          <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/5 text-primary shrink-0">
                            <n.icon className="h-4 w-4" />
                          </div>
                        )}
                        <span>{n.label}</span>
                      </Link>
                    ),
                  )}
                </div>

                {/* 2. Admin & Quick Actions */}
                <div className="border-t border-border pt-4 space-y-2">
                  <Link
                    to={"/leads-portal" as any}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Admin Leads Portal</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                      Login
                    </span>
                  </Link>

                  <Link
                    to={ctaTo as any}
                    onClick={() => setMobileOpen(false)}
                    className="w-full inline-flex items-center justify-center rounded-2xl bg-gradient-brand py-3 text-sm font-semibold text-white shadow-glow"
                  >
                    {ctaLabel}
                  </Link>

                  {phoneNum && (
                    <a
                      href={`tel:${phoneNum.replace(/[^+\d]/g, "")}`}
                      className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>Call: {phoneNum}</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

/** Collapsible dropdown for mobile nav */
function MobileDropdown({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: NavLinkItem[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(true); // default open so all sub options are readily visible

  return (
    <div className="rounded-2xl bg-secondary/40 border border-border/40 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-secondary/60 transition-colors"
      >
        <span className="flex items-center gap-2">{label}</span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-2 space-y-1">
              {items.map((child) => {
                const IconComp = child.icon || Building2;
                return (
                  <Link
                    key={child.to}
                    to={child.to as any}
                    onClick={onNavigate}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm text-foreground/80 hover:text-primary hover:bg-white transition-colors"
                    activeProps={{ className: "text-primary bg-white font-semibold shadow-xs" }}
                  >
                    <div className="grid h-6 w-6 place-items-center rounded-md bg-primary/10 text-primary shrink-0">
                      <IconComp className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{child.label}</div>
                      {child.subLabel && (
                        <div className="text-[10px] text-muted-foreground">{child.subLabel}</div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Header logo with graceful fallback */
function HeaderLogo({ scrolled }: { scrolled: boolean }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`grid h-11 w-11 place-items-center rounded-xl font-bold text-sm select-none ${
          scrolled ? "bg-primary/10 text-primary" : "bg-white/20 text-white"
        }`}
      >
        UI
      </div>
    );
  }

  return (
    <img
      src="/images/logo.svg"
      alt="Unicure India Ltd logo"
      className="h-11 w-11 object-contain drop-shadow"
      onError={() => setFailed(true)}
    />
  );
}