import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";

/**
 * Sticky bottom CTA bar for mobile — Call Now + WhatsApp.
 * Auto-hides on scroll down, reappears on scroll up.
 * Hidden on desktop (lg+).
 */
export function MobileCTA({ phone = "8882674843" }: { phone?: string }) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);
  const reduce = useReducedMotion();

  const cleanPhone = phone.replace(/[^+\d]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone.startsWith("+") ? cleanPhone.slice(1) : `91${cleanPhone}`}`;

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 100) {
        setVisible(true);
      } else if (y > lastY.current + 10) {
        setVisible(false); // scrolling down
      } else if (y < lastY.current - 10) {
        setVisible(true); // scrolling up
      }
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="mobile-cta"
          initial={reduce ? false : { y: 80 }}
          animate={{ y: 0 }}
          exit={{ y: 80 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-0 inset-x-0 z-40 lg:hidden w-full max-w-full overflow-hidden"
        >
          <div className="flex border-t border-border bg-white/95 backdrop-blur-lg shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom,0px)]">
            <a
              href={`tel:${cleanPhone}`}
              className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-[color:var(--brand-blue-dark)] active:bg-secondary transition"
            >
              <Phone className="h-4 w-4" />
              Call Now
            </a>
            <div className="w-px bg-border" />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-1 items-center justify-center gap-2 py-3.5 text-sm font-semibold text-green-700 active:bg-secondary transition"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
