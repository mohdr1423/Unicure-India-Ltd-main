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
  primary_color: "#0b3b8f",
  accent_color: "#2b8ac9",
  phone: "0120-4786786",
  email: "unicure@unicureindia.com",
  address: "C-21, 22 & 23 Sector-3, Noida-201301, U.P., India",
};

const NAV_DEFAULT = {
  items: [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Products", to: "/products" },
    { label: "Contact", to: "/contact" },
  ],
  cta_label: "Get a Quote",
  cta_to: "/contact",
};

const FOOTER_DEFAULT = {
  tagline: "",
  since: "",
  columns: [],
  social: [],
  legal: [],
  copyright: "Unicure India. All rights reserved.",
};

export const getPublicSiteChrome = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicSiteContent> => {
    try {
      const supabase = createClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_PUBLISHABLE_KEY!,
        {
          auth: {
            storage: undefined,
            persistSession: false,
            autoRefreshToken: false,
          },
        },
      );
      const { data, error } = await supabase
        .from("site_content_published" as any)
        .select("key, published")
        .in("key", ["branding", "nav", "footer"]);
      if (error) throw error;
      const map = new Map((data ?? []).map((r: any) => [r.key, r.published]));
      return {
        branding: map.get("branding") ?? BRANDING_DEFAULT,
        nav: map.get("nav") ?? NAV_DEFAULT,
        footer: map.get("footer") ?? FOOTER_DEFAULT,
      };
    } catch {
      return { branding: BRANDING_DEFAULT, nav: NAV_DEFAULT, footer: FOOTER_DEFAULT };
    }
  },
);