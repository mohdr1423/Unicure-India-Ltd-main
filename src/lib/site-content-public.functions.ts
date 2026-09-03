import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PublicSiteContent = {
  branding: any;
  nav: any;
  footer: any;
};

const BRANDING_DEFAULT = {
  site_name: "Unicure India",
  tagline: "Limited",
  company_name: "Unicure India Ltd",
  primary_color: "#C8102E",
  accent_color: "#D4451A",
  phone: "0120-4786786",
  email: "unicure@unicureindia.com",
  address: "C-21, 22 & 23 Sector-3, Noida-201301, U.P., India",
};

const NAV_DEFAULT = {
  items: [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Leadership", to: "/leadership" },
    { label: "Certifications", to: "/certifications" },
    { label: "Manufacturing", to: "/manufacturing" },
    { label: "Dosage Forms", to: "/dosage-forms" },
    { label: "Products", to: "/products" },
    { label: "Quality & R&D", to: "/quality" },
    { label: "Exports", to: "/exports" },
    { label: "Co-Mfg", to: "/contract-manufacturing" },
    { label: "Pharmacovigilance", to: "/pharmacovigilance" },
    { label: "Careers", to: "/careers" },
    { label: "Contact", to: "/contact" },
  ],
  cta_label: "Get a Quote",
  cta_to: "/contact",
};

const FOOTER_DEFAULT = {
  tagline:
    "WHO-GMP certified pharmaceutical manufacturing delivering trusted healthcare products to 20+ countries worldwide.",
  since: "Since 1984",
  columns: [
    {
      title: "About Unicure India",
      links: [
        { label: "Our Mission", to: "/about" },
        { label: "Our Founder", to: "/leadership" },
        { label: "Our History", to: "/about" },
      ],
    },
    {
      title: "Manufacturing",
      links: [
        { label: "Operational Units", to: "/manufacturing" },
        { label: "Our Accreditations", to: "/certifications" },
        { label: "Dosage Form", to: "/dosage-forms" },
        { label: "QA & QC", to: "/quality" },
      ],
    },
    {
      title: "Corporate Sales",
      links: [
        { label: "Institutional Sales", to: "/contract-manufacturing" },
        { label: "Co-Manufacturing", to: "/contract-manufacturing" },
        { label: "Export Sales", to: "/exports" },
      ],
    },
    {
      title: "Others",
      links: [
        { label: "Product List", to: "/products" },
        { label: "Contact Us", to: "/contact" },
        { label: "Director's Message", to: "/md-message" },
      ],
    },
  ],
  social: [
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/company/unicure-india-ltd/",
      icon: "linkedin",
    },
    {
      label: "YouTube",
      url: "https://youtube.com/@unicureindialtd9851?si=iPi8Tic09i2XwITk",
      icon: "youtube",
    },
    { label: "IndiaMART", url: "https://www.indiamart.com/company/2819872/", icon: "indiamart" },
    {
      label: "Justdial",
      url: "https://www.justdial.com/Noida/Unicure-India-Pvt-Ltd-Near-Uco-Bank-Noida-Sector-3/011PXX11-XX11-000772394792-T8E2_BZDET",
      icon: "justdial",
    },
  ],
  legal: [
    { label: "Privacy Policy", url: "/privacy-policy" },
    { label: "Terms of Service", url: "/terms-of-service" },
    { label: "Sitemap", url: "/sitemap" },
  ],
  copyright: "Unicure India. All rights reserved.",
};

// In-memory cache for ultra-fast TTFB (zero blocking DB latency on SSR)
let memoryCache: PublicSiteContent | null = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export const getPublicSiteChrome = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicSiteContent> => {
    const now = Date.now();
    if (memoryCache && now - lastCacheTime < CACHE_TTL_MS) {
      return memoryCache;
    }

    try {
      const supabaseUrl =
        process.env.SUPABASE_URL ||
        process.env.VITE_SUPABASE_URL ||
        "https://qhvlfzahkjoixfscenru.supabase.co";
      const supabaseKey =
        process.env.SUPABASE_PUBLISHABLE_KEY ||
        process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFodmxmemFoa2pvaXhmc2NlbnJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwNTU2NjAsImV4cCI6MjA5ODYzMTY2MH0.sLDvrLx5rJqN5pXwfpm7uu5DnC8kZsgidPNeA0vVpB8";

      if (!supabaseUrl || !supabaseKey) {
        return { branding: BRANDING_DEFAULT, nav: NAV_DEFAULT, footer: FOOTER_DEFAULT };
      }

      const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
        auth: {
          storage: undefined,
          persistSession: false,
          autoRefreshToken: false,
        },
      });

      // Max 400ms timeout race so SSR never freezes on slow DB
      const dbPromise = supabase
        .from("site_content_published" as any)
        .select("key, published")
        .in("key", ["branding", "nav", "footer"]);

      const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 400));

      const res = await Promise.race([dbPromise, timeoutPromise]);
      if (!res || !("data" in res) || res.error || !res.data) {
        return (
          memoryCache ?? { branding: BRANDING_DEFAULT, nav: NAV_DEFAULT, footer: FOOTER_DEFAULT }
        );
      }

      const map = new Map((res.data ?? []).map((r: any) => [r.key, r.published]));
      const result: PublicSiteContent = {
        branding: map.get("branding") ?? BRANDING_DEFAULT,
        nav: map.get("nav") ?? NAV_DEFAULT,
        footer: map.get("footer") ?? FOOTER_DEFAULT,
      };

      memoryCache = result;
      lastCacheTime = now;
      return result;
    } catch {
      return (
        memoryCache ?? { branding: BRANDING_DEFAULT, nav: NAV_DEFAULT, footer: FOOTER_DEFAULT }
      );
    }
  },
);
