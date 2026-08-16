import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AiChatWidget } from "./AiChatWidget";
import { BackToTop } from "./BackToTop";
import { MobileCTA } from "./MobileCTA";
import { Breadcrumbs } from "./Breadcrumbs";
import { SiteChromeProvider, useSiteChrome } from "./SiteChromeContext";

function SiteLayoutInner({ children }: { children: ReactNode }) {
  const { branding } = useSiteChrome();
  return (
    <>
      <Header />
      <motion.main
        id="main-content"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.main>
      <Footer />
      <AiChatWidget />
      <BackToTop />
      <MobileCTA phone={branding?.phone} />
    </>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <SiteChromeProvider>
      <SiteLayoutInner>{children}</SiteLayoutInner>
    </SiteChromeProvider>
  );
}