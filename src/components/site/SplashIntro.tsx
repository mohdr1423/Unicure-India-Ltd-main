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
    const duration = reduce ? 350 : 750;
    const t = setTimeout(() => setShow(false), duration);
    return () => {
      clearTimeout(t);
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
          transition={{ duration: 0.25, ease: "easeOut" }}
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
              className="pointer-events-none absolute h-[400px] w-[400px] rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(200,16,46,0.22) 0%, rgba(200,16,46,0) 65%)",
                filter: "blur(20px)",
              }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.8 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          )}

          {/* Expanding red ring */}
          {!reduce && (
            <motion.div
              className="pointer-events-none absolute rounded-full border"
              style={{ borderColor: "rgba(200,16,46,0.3)" }}
              initial={{ width: 100, height: 100, opacity: 0 }}
              animate={{ width: 500, height: 500, opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}

          {/* Logo */}
          <div className="relative flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  boxShadow:
                    "0 12px 36px -8px rgba(200,16,46,0.3), 0 4px 12px -4px rgba(0,0,0,0.1)",
                }}
              />
              <img
                src="/images/logo.svg"
                alt="Unicure India Ltd"
                width={140}
                height={140}
                className="relative h-28 w-28 md:h-36 md:w-36 object-contain drop-shadow-lg"
              />
            </motion.div>

            {/* Wordmark reveal */}
            <div className="mt-4 overflow-hidden">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.1,
                }}
                className="text-center"
              >
                <div
                  className="text-xl md:text-3xl font-bold tracking-tight"
                  style={{ color: "#C8102E" }}
                >
                  Unicure India Ltd
                </div>
              </motion.div>
            </div>

            <div className="mt-1 overflow-hidden">
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{
                  duration: 0.3,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 0.15,
                }}
                className="text-center"
              >
                <div className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-neutral-500">
                  Pharmaceutical Excellence
                </div>
              </motion.div>
            </div>
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
