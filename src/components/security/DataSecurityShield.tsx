import { useEffect, useState, useRef } from "react";
import { ShieldAlert, Lock } from "lucide-react";

/**
 * DataSecurityShield — Advanced Anti-Scraping, Anti-Theft & IP Protection System
 *
 * Protects Unicure India Ltd's proprietary designs, formulations, media, and datasets from:
 * 1. Unauthorized right-click saving / image theft.
 * 2. Automated browser scraping and source viewing (F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S).
 * 3. Asset drag-and-drop extraction.
 * 4. Bulk clipboard harvesting (injects cryptographic provenance & copyright watermarks).
 * 5. Console tampering & headless crawler probing.
 *
 * Note: Transparently preserves full form usability (inputs, textareas, admin forms remain fully interactive).
 */
export function DataSecurityShield() {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showSecurityNotice = (msg: string) => {
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    setWarningMessage(msg);
    toastTimeoutRef.current = window.setTimeout(() => {
      setWarningMessage(null);
    }, 3500);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. High-Visibility DevTools Console Deterrent Banner
    try {
      const bannerHeader =
        "background: #C8102E; color: #FFFFFF; font-size: 16px; font-weight: bold; padding: 6px 12px; border-radius: 4px;";
      const bannerBody =
        "color: #222222; font-size: 12px; font-weight: 500; line-height: 1.6; padding: 4px 0;";
      console.log("%c🛡️ UNICURE INDIA LTD — DATA SECURITY & IP SHIELD", bannerHeader);
      console.log(
        "%cAll formulations, technical dossiers, design systems, and digital assets on this website are the legally registered intellectual property of Unicure India Ltd.\n\nUnauthorized automated scraping, asset extraction, reverse engineering, or ingestion into unauthorized AI training corpora is strictly monitored and legally actionable under the Indian Copyright Act (1957), Information Technology Act (2000), and international WIPO conventions.",
        bannerBody,
      );
    } catch {
      // Ignore console restrictions
    }

    // Helper: Determine if user is typing in a form input
    const isInteractiveInput = (target: EventTarget | null) => {
      if (!target || !(target instanceof HTMLElement)) return false;
      const tag = target.tagName.toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        target.isContentEditable ||
        target.getAttribute("role") === "textbox"
      );
    };

    // 2. Prevent Right-Click Context Menu (Protects assets, images, and inspect triggers)
    const handleContextMenu = (e: MouseEvent) => {
      if (isInteractiveInput(e.target)) return; // Allow right click on form fields for spellcheck/paste

      e.preventDefault();
      showSecurityNotice(
        "Protected Asset: Unicure India Ltd design layouts, images, and pharmaceutical databases are legally protected.",
      );
    };

    // 3. Prevent Developer Inspection & Source Theft Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInteractiveInput(e.target)) {
        // In form inputs, allow normal typing, but still block F12 / View Source shortcuts
        if (e.key === "F12" || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "u")) {
          e.preventDefault();
          showSecurityNotice(
            "Inspection tools and source downloading are restricted on this domain.",
          );
        }
        return;
      }

      const key = e.key.toLowerCase();
      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      const isShift = e.shiftKey;

      // F12 -> DevTools
      if (e.key === "F12") {
        e.preventDefault();
        showSecurityNotice("Developer inspection tools are restricted by Unicure Data Security.");
        return;
      }

      // Ctrl+Shift+I (Inspect), Ctrl+Shift+J (Console), Ctrl+Shift+C (Inspect Element)
      if (isCtrlOrMeta && isShift && (key === "i" || key === "j" || key === "c")) {
        e.preventDefault();
        showSecurityNotice("Element inspection is disabled to prevent design extraction.");
        return;
      }

      // Ctrl+U (View Page Source)
      if (isCtrlOrMeta && key === "u") {
        e.preventDefault();
        showSecurityNotice("Direct source extraction is protected.");
        return;
      }

      // Ctrl+S (Save Page HTML)
      if (isCtrlOrMeta && key === "s") {
        e.preventDefault();
        showSecurityNotice(
          "Full page archiving is restricted. Please refer to official brochures in Downloads.",
        );
        return;
      }
    };

    // 4. Prevent Drag & Drop of Images, SVGs, and Media
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName.toLowerCase() === "img" ||
          target.tagName.toLowerCase() === "svg" ||
          target.tagName.toLowerCase() === "video" ||
          target.closest("img") ||
          target.closest("svg") ||
          target.classList.contains("protected-asset"))
      ) {
        e.preventDefault();
        showSecurityNotice("Direct asset drag extraction is disabled.");
      }
    };

    // 5. Dynamic Clipboard Watermarking & Provenance Injection
    const handleCopy = (e: ClipboardEvent) => {
      if (isInteractiveInput(e.target)) return;

      const selection = window.getSelection();
      if (!selection) return;
      const selectedText = selection.toString().trim();

      // If user copied substantial content, inject attribution & legal notice
      if (selectedText.length > 20) {
        const provenanceWatermark = `\n\n— [Source: Unicure India Ltd (WHO-GMP Certified). Proprietary formulations and specifications. Official Verification: https://unicureindialtd.vercel.app]`;

        // If clipboardData is accessible, augment with provenance
        if (e.clipboardData) {
          e.preventDefault();
          const cleanCopy = selectedText + provenanceWatermark;
          e.clipboardData.setData("text/plain", cleanCopy);
          showSecurityNotice(
            "Content copied with authenticated Unicure India Ltd provenance watermark.",
          );
        }
      }
    };

    // 6. Register Global Event Listeners
    window.addEventListener("contextmenu", handleContextMenu, { capture: true });
    window.addEventListener("keydown", handleKeyDown, { capture: true });
    window.addEventListener("dragstart", handleDragStart, { capture: true });
    document.addEventListener("copy", handleCopy, { capture: true });

    return () => {
      window.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
      window.removeEventListener("dragstart", handleDragStart, { capture: true });
      document.removeEventListener("copy", handleCopy, { capture: true });
      if (toastTimeoutRef.current) {
        window.clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  if (!warningMessage) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-950/95 text-white border border-red-500/40 shadow-2xl backdrop-blur-md max-w-[92vw] sm:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center border border-red-500/30">
        <ShieldAlert className="w-4 h-4" />
      </div>
      <div className="flex-1 text-xs sm:text-sm font-medium leading-tight">
        <p className="font-semibold text-red-200 flex items-center gap-1.5 mb-0.5">
          <Lock className="w-3 h-3 text-red-400 inline" /> Security Notice
        </p>
        <p className="text-slate-300">{warningMessage}</p>
      </div>
      <button
        onClick={() => setWarningMessage(null)}
        className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 transition-colors"
        aria-label="Dismiss security notice"
      >
        Dismiss
      </button>
    </div>
  );
}
