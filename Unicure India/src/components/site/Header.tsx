import { useEffect, useState, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { useSiteChrome } from "./SiteChromeContext";
import { TopBanner } from "./TopBanner";

type NavItem =
  | { to: string; label: string; children?: undefined }
  | { label: string; to?: undefined; children: { to: string; label: string }[] };

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const { branding, nav: navCfg } = useSiteChrome();
  const reduce = useReducedMotion();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Build grouped nav from flat items
  const rawItems: Array<{ to: string; label: string }> = navCfg?.items ?? [];
  const nav = groupNavItems(rawItems);

  const ctaLabel: string = navCfg?.cta_label ?? "Get a Quote";
  const ctaTo: string = navCfg?.cta_to ?? "/contact";
  const phoneNum: string = branding?.phone ?? "";

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
            ? "bg-white/90 backdrop-blur-xl border-b border-border shadow-[0_1px_12px_rgba(0,0,0,0.06)]"
            : "bg-transparent"
        }`}
      >
        <TopBanner />
        <div className="container-x flex h-18 items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <HeaderLogo scrolled={scrolled} />
            <div className="flex flex-col leading-none">
              <span
                className={`font-bold text-lg tracking-tight transition-colors ${
                  scrolled
                    ? "text-[color:var(--brand-blue)]"
                    : "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                }`}
              >
                {branding?.site_name ?? "Unicure India"}
              </span>
              <span
                className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${
                  scrolled
                    ? "text-muted-foreground"
                    : "text-white/90 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                }`}
              >
                {branding?.tagline ?? "Limited"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {nav.map((n) =>
              n.children ? (
                <div
                  key={n.label}
                  className="relative"
                  onMouseEnter={() => openDropdown(n.label)}
                  onMouseLeave={closeDropdown}
                >
                  <button
                    className={`flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors rounded-full hover:bg-secondary ${
                      scrolled
                        ? "text-foreground/80 hover:text-primary"
                        : "text-white/85 hover:text-white hover:bg-white/10"
                    }`}
                    aria-expanded={dropdownOpen === n.label}
                    aria-haspopup="true"
                  >
                    {n.label}
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
                        className="absolute top-full left-0 mt-1 min-w-[200px] rounded-xl border border-border bg-white p-2 shadow-elegant"
                      >
                        {n.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to as any}
                            className="block rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/80 hover:bg-secondary hover:text-primary transition-colors"
                            activeProps={{
                              className: "text-primary bg-secondary",
                            }}
                            onClick={() => setDropdownOpen(null)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={n.to}
                  to={n.to as any}
                  className={`px-3.5 py-2 text-sm font-medium transition-colors rounded-full hover:bg-secondary ${
                    scrolled
                      ? "text-foreground/80 hover:text-primary"
                      : "text-white/85 hover:text-white hover:bg-white/10"
                  }`}
                  activeProps={{ className: "text-primary bg-secondary" }}
                >
                  {n.label}
                </Link>
              ),
            )}
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-3">
            {phoneNum && (
              <a
                href={`tel:${phoneNum.replace(/[^+\d]/g, "")}`}
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  scrolled
                    ? "text-[color:var(--brand-blue-dark)]"
                    : "text-white/90 hover:text-white"
                }`}
              >
                <Phone className="h-4 w-4" /> {phoneNum}
              </a>
            )}
            <Link
              to={ctaTo as any}
              className="inline-flex items-center rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 transition"
            >
              {ctaLabel}
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            aria-label="Toggle menu"
            className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full bg-secondary text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu — Full Overlay */}
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
              className="fixed inset-0 z-[49] bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* Panel */}
            <motion.div
              key="mobile-panel"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-0 top-[72px] z-[49] max-h-[calc(100vh-72px)] overflow-y-auto bg-white/98 backdrop-blur-xl border-b border-border shadow-elegant lg:hidden"
            >
              <div className="container-x py-5 flex flex-col gap-1">
                {nav.map((n) =>
                  n.children ? (
                    <MobileDropdown
                      key={n.label}
                      label={n.label}
                      items={n.children}
                      onNavigate={() => setMobileOpen(false)}
                    />
                  ) : (
                    <Link
                      key={n.to}
                      to={n.to as any}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
                      activeProps={{ className: "text-primary bg-secondary" }}
                    >
                      {n.label}
                    </Link>
                  ),
                )}
                <Link
                  to={ctaTo as any}
                  onClick={() => setMobileOpen(false)}
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-gradient-brand px-5 py-3 text-sm font-semibold text-white shadow-glow"
                >
                  {ctaLabel}
                </Link>
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
  items: { to: string; label: string }[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 rounded-lg text-sm font-medium hover:bg-secondary transition-colors"
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pl-4 pb-1">
              {items.map((child) => (
                <Link
                  key={child.to}
                  to={child.to as any}
                  onClick={onNavigate}
                  className="block px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                  activeProps={{ className: "text-primary" }}
                >
                  {child.label}
                </Link>
              ))}
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
      <div className={`grid h-11 w-11 place-items-center rounded-lg font-bold text-sm select-none ${
        scrolled ? "bg-primary/10 text-primary" : "bg-white/20 text-white"
      }`}>
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

/**
 * Groups flat nav items into a structure with dropdowns.
 * Groups "About", "Leadership", "Certifications" under "Company",
 * "Manufacturing", "Dosage Forms" under "Manufacturing",
 * and keeps the rest as top-level.
 */
function groupNavItems(
  items: Array<{ to: string; label: string }>,
): NavItem[] {
  const companyPaths = new Set(["/about", "/leadership", "/certifications", "/downloads", "/md-message"]);
  const mfgPaths = new Set(["/manufacturing", "/dosage-forms", "/contract-manufacturing"]);

  const companyChildren: { to: string; label: string }[] = [];
  const mfgChildren: { to: string; label: string }[] = [];
  const rest: NavItem[] = [];

  for (const item of items) {
    if (companyPaths.has(item.to)) {
      companyChildren.push(item);
    } else if (mfgPaths.has(item.to)) {
      mfgChildren.push(item);
    } else {
      rest.push(item);
    }
  }

  const result: NavItem[] = [];

  // Home first
  const home = rest.find((r) => "to" in r && r.to === "/");
  if (home) result.push(home);

  // Insert Company dropdown
  if (companyChildren.length > 0) {
    result.push({
      label: "Company",
      children: companyChildren,
    });
  }

  // Insert Manufacturing dropdown
  if (mfgChildren.length > 0) {
    result.push({
      label: "Manufacturing",
      children: mfgChildren,
    });
  }

  // Add the remaining items (excluding home)
  for (const item of rest) {
    if (!("to" in item && item.to === "/")) {
      result.push(item);
    }
  }

  return result;
}