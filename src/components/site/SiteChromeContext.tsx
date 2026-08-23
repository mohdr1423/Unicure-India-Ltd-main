import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getPublicSiteChrome, type PublicSiteContent } from "@/lib/site-content-public.functions";

const FALLBACK: PublicSiteContent = {
  branding: {
    site_name: "Unicure India",
    tagline: "Limited",
    company_name: "Unicure India Ltd",
    primary_color: "#C8102E",
    accent_color: "#D4451A",
    phone: "0120-4786786",
    email: "unicure@unicureindia.com",
    address: "C-21, 22 & 23 Sector-3, Noida-201301, U.P., India",
  },
  nav: {
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
  },
  footer: {
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
      { label: "LinkedIn", url: "https://www.linkedin.com/company/unicure-india-ltd/", icon: "linkedin" },
      { label: "YouTube", url: "https://youtube.com/@unicureindialtd9851?si=iPi8Tic09i2XwITk", icon: "youtube" },
      { label: "IndiaMART", url: "https://www.indiamart.com/company/2819872/", icon: "indiamart" },
      { label: "Justdial", url: "https://www.justdial.com/Noida/Unicure-India-Pvt-Ltd-Near-Uco-Bank-Noida-Sector-3/011PXX11-XX11-000772394792-T8E2_BZDET", icon: "justdial" },
    ],
    legal: [
      { label: "Privacy Policy", url: "#" },
      { label: "Terms of Service", url: "#" },
      { label: "Sitemap", url: "#" },
    ],
    copyright: "Unicure India. All rights reserved.",
  },
};

const SiteChromeContext = createContext<PublicSiteContent>(FALLBACK);

export function useSiteChrome() {
  return useContext(SiteChromeContext);
}

export function SiteChromeProvider({ children }: { children: ReactNode }) {
  const fetchChrome = useServerFn(getPublicSiteChrome);
  const { data } = useQuery({
    queryKey: ["site-chrome"],
    queryFn: () => fetchChrome(),
    staleTime: 60_000,
    placeholderData: FALLBACK,
  });
  return (
    <SiteChromeContext.Provider value={data ?? FALLBACK}>{children}</SiteChromeContext.Provider>
  );
}