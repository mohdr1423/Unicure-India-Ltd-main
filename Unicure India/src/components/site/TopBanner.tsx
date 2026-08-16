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
      className="relative z-10 bg-[color:var(--brand-blue-dark)] text-white text-center text-xs sm:text-sm border-b border-white/10 shadow-sm"
    >
      <div className="container-x flex items-center justify-center gap-2 py-2 sm:py-2.5 pr-10 text-xs sm:text-sm">
        <Factory className="h-3.5 w-3.5 shrink-0 text-white/70" />
        <span className="leading-tight">
          <strong>Now operational:</strong> Unit-III Greater Noida — PIC/S compliant OSD facility{" "}
          <Link
            to="/manufacturing"
            className="underline underline-offset-2 hover:text-white/80 font-medium whitespace-nowrap ml-1"
          >
            Learn more →
          </Link>
        </span>
      </div>
      <button
        onClick={dismiss}
        aria-label="Dismiss banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-md hover:bg-white/10 text-white/80 hover:text-white transition cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </aside>
  );
}
