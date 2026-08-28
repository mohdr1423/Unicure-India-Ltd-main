import { lazy, Suspense, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { BackToTop } from "./BackToTop";
import { MobileCTA } from "./MobileCTA";
import { SiteChromeProvider, useSiteChrome } from "./SiteChromeContext";

const AiChatWidget = lazy(() =>
  import("./AiChatWidget").then((m) => ({ default: m.AiChatWidget })),
);

function SiteLayoutInner({ children }: { children: ReactNode }) {
  const { branding } = useSiteChrome();
  return (
    <div className="relative min-h-screen w-full max-w-full overflow-x-hidden flex flex-col">
      <Header />
      <main id="main-content" className="flex-1 w-full max-w-full overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <Suspense fallback={null}>
        <AiChatWidget />
      </Suspense>
      <BackToTop />
      <MobileCTA phone={branding?.phone} />
    </div>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SiteChromeProvider>
      <SiteLayoutInner>{children}</SiteLayoutInner>
    </SiteChromeProvider>
  );
}
