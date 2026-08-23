import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";

import { reportLovableError } from "../lib/lovable-error-reporting";
import { supabase } from "@/integrations/supabase/client";
import {
  clearRememberPreference,
  markTabAlive,
  shouldDropEphemeralSession,
} from "@/lib/remember-me";
import { SplashIntro } from "@/components/site/SplashIntro";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Unicure India — Pharmaceutical Manufacturing Excellence" },
      {
        name: "description",
        content:
          "Unicure India is a WHO-GMP certified pharmaceutical manufacturer with 40+ years of excellence — 500+ products, 20+ export countries, and world-class R&D.",
      },
      { name: "author", content: "Unicure India" },
      { property: "og:title", content: "Unicure India — Pharmaceutical Manufacturing Excellence" },
      {
        property: "og:description",
        content:
          "WHO-GMP certified pharmaceutical manufacturing with global reach. Tablets, capsules, injectables, syrups and more.",
      },
      { property: "og:site_name", content: "Unicure India" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@500;600;700;800&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": ["Organization", "MedicalOrganization"],
              "@id": "/#organization",
              name: "Unicure India Ltd",
              alternateName: "Unicure India",
              url: "/",
              logo: {
                "@type": "ImageObject",
                url: "/images/logo.svg",
                width: 512,
                height: 512,
              },
              image: "/images/logo.svg",
              foundingDate: "1984",
              foundingLocation: {
                "@type": "Place",
                name: "Noida, Uttar Pradesh, India",
              },
              slogan: "Pharmaceutical Manufacturing Excellence",
              description:
                "WHO-GMP certified pharmaceutical manufacturer with 40+ years of excellence, 500+ products, contract manufacturing, and exports to 20+ countries.",
              medicalSpecialty: [
                "PharmacySpecialty",
                "Pharmacy",
              ],
              knowsAbout: [
                "Pharmaceutical Manufacturing",
                "Contract Manufacturing",
                "Tablets",
                "Capsules",
                "Injectables",
                "Syrups",
                "Ointments",
                "Dry Syrups",
                "Sachets",
                "Research and Development",
                "Regulatory Affairs",
                "CTD and ACTD Dossiers",
              ],
              hasCredential: [
                { "@type": "EducationalOccupationalCredential", name: "WHO-GMP Certified" },
                { "@type": "EducationalOccupationalCredential", name: "ISO 9001:2015" },
                { "@type": "EducationalOccupationalCredential", name: "ISO 14001:2015" },
                { "@type": "EducationalOccupationalCredential", name: "Form 25, 26 & 28 Licenses" },
              ],
              areaServed: [
                { "@type": "Country", name: "India" },
                { "@type": "Place", name: "Africa" },
                { "@type": "Place", name: "Southeast Asia" },
                { "@type": "Place", name: "Middle East" },
                { "@type": "Place", name: "CIS Countries" },
                { "@type": "Place", name: "Latin America" },
              ],
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Contract Manufacturing",
                    serviceType: "Pharmaceutical Contract Manufacturing",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Third-Party Manufacturing",
                    serviceType: "Third-Party Pharmaceutical Manufacturing",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Pharmaceutical Exports",
                    serviceType: "Global Pharmaceutical Supply",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "R&D and Formulation Development",
                    serviceType: "Pharmaceutical R&D",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Regulatory Affairs & Dossier Preparation",
                    serviceType: "CTD/ACTD Dossier Services",
                  },
                },
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+91-8882674843",
                  email: "humanrealityofficial@gmail.com",
                  contactType: "sales",
                  areaServed: "Worldwide",
                  availableLanguage: ["English", "Hindi"],
                },
                {
                  "@type": "ContactPoint",
                  telephone: "+91-8882674843",
                  email: "humanrealityofficial@gmail.com",
                  contactType: "customer support",
                  areaServed: "IN",
                  availableLanguage: ["English", "Hindi"],
                },
              ],
              address: {
                "@type": "PostalAddress",
                streetAddress: "C-21, 22 & 23, Sector-3",
                addressLocality: "Noida",
                addressRegion: "Uttar Pradesh",
                postalCode: "201301",
                addressCountry: "IN",
              },
              location: [
                {
                  "@type": "Place",
                  name: "Unicure India Ltd — Unit I (Noida)",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "C-21, 22 & 23, Sector-3",
                    addressLocality: "Noida",
                    addressRegion: "Uttar Pradesh",
                    postalCode: "201301",
                    addressCountry: "IN",
                  },
                },
                {
                  "@type": "Place",
                  name: "Unicure India Ltd — Unit II (Roorkee)",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Roorkee",
                    addressRegion: "Uttarakhand",
                    addressCountry: "IN",
                  },
                },
                {
                  "@type": "Place",
                  name: "Unicure India Ltd — Unit III (Greater Noida)",
                  address: {
                    "@type": "PostalAddress",
                    addressLocality: "Greater Noida",
                    addressRegion: "Uttar Pradesh",
                    addressCountry: "IN",
                  },
                },
              ],
              sameAs: [
                "https://www.unicureindia.com",
              ],
            },
            {
              "@type": "WebSite",
              "@id": "/#website",
              url: "/",
              name: "Unicure India Ltd",
              publisher: { "@id": "/#organization" },
              inLanguage: "en-IN",
              potentialAction: {
                "@type": "SearchAction",
                target: "/products?query={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <head>
        <HeadContent />
      </head>
      <body className="overflow-x-hidden max-w-full">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground focus:shadow-elegant"
        >
          Skip to main content
        </a>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (shouldDropEphemeralSession()) {
      clearRememberPreference();
      supabase.auth.signOut().catch(() => {});
    } else {
      markTabAlive();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SplashIntro />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
