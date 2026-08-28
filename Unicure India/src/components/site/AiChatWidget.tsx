import { lazy, Suspense, useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { cn } from "@/lib/utils";

// Dynamically import the heavy chat modal and its markdown parser on demand
const AiChatWindow = lazy(() => import("./AiChatWindow"));

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleToggle = () => {
    setOpen((prev) => !prev);
    setHasInteracted(true);
  };

  return (
    <>
      {/* Floating Chat Trigger Button — Positioned above mobile CTA bar on small screens */}
      <div className="fixed bottom-20 right-3 sm:bottom-6 sm:right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto select-none max-w-[calc(100vw-1.5rem)]">
        {!open && !hasInteracted && (
          <div className="hidden xs:flex animate-bounce rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold text-foreground shadow-lg border border-border items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Ask Bella</span>
          </div>
        )}

        <button
          onClick={handleToggle}
          aria-label={open ? "Close Bella AI Assistant" : "Open Bella AI Assistant"}
          className={cn(
            "group relative grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full shadow-2xl transition-all duration-300 cursor-pointer active:scale-95",
            open
              ? "bg-slate-900 text-white rotate-90 scale-95"
              : "bg-[color:var(--brand-blue-dark)] text-white hover:scale-105 hover:shadow-glow ring-2 ring-[#C8102E]/80",
          )}
        >
          {open ? (
            <X className="h-5 w-5 sm:h-6 sm:w-6 transition-transform" />
          ) : (
            <>
              <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8102E] opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-[#C8102E] text-[9px] font-bold text-white items-center justify-center">
                  AI
                </span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* Lazy Chat Window Container */}
      {open && (
        <Suspense fallback={null}>
          <AiChatWindow onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}

export default AiChatWidget;
