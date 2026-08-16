import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";


const SESSION_KEY = "unicure_splash_seen_v1";

export function SplashIntro() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    try {
      if (!sessionStorage.getItem(SESSION_KEY)) {
        setShow(true);
        sessionStorage.setItem(SESSION_KEY, "1");
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (!show) return;
    document.documentElement.style.overflow = "hidden";
    const duration = reduce ? 600 : 4600;
    const t = setTimeout(() => setShow(false), duration);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, [show, reduce]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="unicure-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white"
          role="dialog"
          aria-label="Unicure India Ltd intro"
          onClick={() => setShow(false)}
        >
          {/* Soft gradient wash */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,1) 0%, rgba(252,244,244,1) 45%, rgba(245,228,229,0.9) 100%)",
            }}
          />

          {/* Soft red glow behind logo */}
          {!reduce && (
            <motion.div
              className="pointer-events-none absolute h-[520px] w-[520px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(200,16,46,0.28) 0%, rgba(200,16,46,0) 65%)",
                filter: "blur(20px)",
              }}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.6, 1.1, 1], opacity: [0, 0.9, 0.75] }}
              transition={{ duration: 2.4, ease: "easeOut" }}
            />
          )}

          {/* Expanding red ring */}
          {!reduce && (
            <motion.div
              className="pointer-events-none absolute rounded-full border"
              style={{ borderColor: "rgba(200,16,46,0.35)" }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: 640, height: 640, opacity: [0, 0.6, 0] }}
              transition={{ duration: 2.6, ease: "easeOut", delay: 0.2 }}
            />
          )}
          {!reduce && (
            <motion.div
              className="pointer-events-none absolute rounded-full border"
              style={{ borderColor: "rgba(200,16,46,0.25)" }}
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: 900, height: 900, opacity: [0, 0.5, 0] }}
              transition={{ duration: 3, ease: "easeOut", delay: 0.6 }}
            />
          )}

          {/* Diagonal red accent shapes */}
          {!reduce && (
            <>
              <motion.div
                className="pointer-events-none absolute -left-24 top-0 h-[140vh] w-40 origin-top-left"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(200,16,46,0.9), rgba(200,16,46,0.15))",
                  transform: "rotate(12deg)",
                }}
                initial={{ x: "-120%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              />
              <motion.div
                className="pointer-events-none absolute -right-24 bottom-0 h-[140vh] w-32 origin-bottom-right"
                style={{
                  background:
                    "linear-gradient(0deg, rgba(200,16,46,0.85), rgba(200,16,46,0.1))",
                  transform: "rotate(12deg)",
                }}
                initial={{ x: "120%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
              />
            </>
          )}

          {/* Logo */}
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.7, opacity: 0, filter: "blur(12px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{
                duration: reduce ? 0.4 : 1.2,
                ease: [0.22, 1, 0.36, 1],
                delay: reduce ? 0 : 0.4,
              }}
              className="relative"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow:
                    "0 20px 60px -10px rgba(200,16,46,0.35), 0 8px 24px -6px rgba(0,0,0,0.15)",
                }}
              />
              <img
                src="/images/logo.svg"
                alt="Unicure India Ltd"
                width={180}
                height={180}
                className="relative h-36 w-36 md:h-44 md:w-44 object-contain drop-shadow-xl"
              />
            </motion.div>

            {/* Wordmark reveal */}
            <div className="mt-6 overflow-hidden">
              <motion.div
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: reduce ? 0.4 : 0.9,
                  ease: [0.22, 1, 0.36, 1],
                  delay: reduce ? 0.1 : 1.1,
                }}
                className="text-center"
              >
                <div
                  className="text-2xl md:text-4xl font-bold tracking-tight"
                  style={{ color: "#C8102E" }}
                >
                  Unicure India Ltd
                </div>
              </motion.div>
            </div>

            <div className="mt-2 overflow-hidden">
              <motion.div
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: reduce ? 0.4 : 0.8,
                  ease: [0.22, 1, 0.36, 1],
                  delay: reduce ? 0.15 : 1.5,
                }}
                className="text-center"
              >
                <div className="text-[11px] md:text-sm uppercase tracking-[0.3em] text-neutral-500">
                  Pharmaceutical Excellence
                </div>
              </motion.div>
            </div>

            {/* Underline sweep */}
            {!reduce && (
              <motion.div
                className="mt-5 h-[2px] rounded-full"
                style={{ backgroundColor: "#C8102E" }}
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 120, opacity: 1 }}
                transition={{ duration: 0.9, ease: "easeOut", delay: 1.8 }}
              />
            )}
          </div>

          {/* Skip */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShow(false);
            }}
            className="absolute bottom-6 right-6 rounded-full border border-neutral-300 bg-white/80 px-4 py-1.5 text-xs font-medium text-neutral-600 backdrop-blur transition hover:border-[#C8102E] hover:text-[#C8102E]"
            aria-label="Skip intro"
          >
            Skip
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashIntro;