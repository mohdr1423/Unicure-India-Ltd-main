import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X, Factory } from "lucide-react";

const BANNER_KEY = "unicure_banner_dismissed_v1";

export function TopBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!sessionStorage.getItem(BANNER_KEY)) {
        setShow(true);
      }
    } catch {
      // SSR or storage blocked
    }
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try {
      sessionStorage.setItem(BANNER_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <aside
      aria-label="Announcement"
      className="relative z-10 bg-[color:var(--brand-blue-dark)] text-white text-center text-xs sm:text-sm border-b border-white/10 shadow-sm overflow-hidden"
    >
      <div className="container-x flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 pr-10 sm:pr-12 text-xs sm:text-sm">
        <Factory className="h-3.5 w-3.5 shrink-0 text-white/70 hidden sm:inline-block" />
        <span className="leading-tight text-xs md:text-sm">
          <strong>Now operational:</strong> Unit-III Greater Noida — PIC/S compliant facility{" "}
          <Link
            to="/manufacturing"
            className="underline underline-offset-2 hover:text-white/80 font-medium inline-block ml-1"
          >
            Learn more →
          </Link>
        </span>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center rounded-lg hover:bg-white/15 text-white/90 hover:text-white transition cursor-pointer"
      >
        <X className="h-4 w-4" />
      </button>
    </aside>
  );
}
