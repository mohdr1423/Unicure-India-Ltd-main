import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  FileDown,
  ExternalLink,
  ShieldCheck,
  Award,
  CheckCircle2,
  FileText,
  Building2,
  Printer,
} from "lucide-react";

export type CertificateDoc = {
  id: string;
  name: string;
  unit: string;
  unitSubtitle?: string;
  category: "licence" | "gmp" | "iso" | "compliance";
  fileUrl: string;
  fileSize: string;
  issuingAuthority: string;
  validity?: string;
  description: string;
};

interface CertificateViewerModalProps {
  cert: CertificateDoc | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CertificateViewerModal({ cert, open, onOpenChange }: CertificateViewerModalProps) {
  if (!cert) return null;

  const handleDownload = () => {
    // Programmatically trigger browser download
    const link = document.createElement("a");
    link.href = cert.fileUrl;
    link.download = cert.name.replace(/[^a-zA-Z0-9_-]/g, "_") + ".pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.open(cert.fileUrl, "_blank")?.print();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] w-[95vw] sm:w-[90vw] p-0 overflow-hidden flex flex-col rounded-3xl border border-border shadow-2xl bg-background">
        {/* Modal Header */}
        <div className="bg-[color:var(--brand-blue-dark)] text-white p-5 sm:p-6 border-b-2 border-[#C8102E] shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-6">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C8102E] px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-sm">
                  <ShieldCheck className="h-3.5 w-3.5" /> Official Certificate
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-300 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Verified Document
                </span>
              </div>
              <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1.5 truncate">
                {cert.name}
              </DialogTitle>
              <DialogDescription className="text-white/80 text-xs sm:text-sm flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5 text-red-400" />
                  <strong>{cert.unit}</strong>
                </span>
                <span>•</span>
                <span>Issuing Authority: {cert.issuingAuthority}</span>
              </DialogDescription>
            </div>

            {/* Quick Header Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Button
                onClick={handleDownload}
                className="rounded-xl bg-[#C8102E] text-white hover:bg-red-700 shadow-md font-semibold text-xs sm:text-sm h-10 px-4 flex items-center gap-2 cursor-pointer"
              >
                <FileDown className="h-4 w-4" /> Download PDF
              </Button>
              <a
                href={cert.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
                title="Open in new tab"
                aria-label="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Certificate Overview Details Bar */}
        <div className="bg-secondary/60 px-5 py-3 border-b border-border text-xs sm:text-sm flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4 text-muted-foreground flex-wrap">
            <span>
              <strong>Format:</strong> PDF ({cert.fileSize})
            </span>
            <span>•</span>
            <span>
              <strong>Scope:</strong> {cert.description}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
          </div>
        </div>

        {/* Document Viewer Frame */}
        <div className="flex-1 bg-slate-100 p-2 sm:p-4 overflow-hidden min-h-[380px] sm:min-h-[460px] flex flex-col">
          <div className="w-full flex-1 rounded-2xl overflow-hidden border border-border shadow-inner bg-white relative">
            <iframe
              src={`${cert.fileUrl}#toolbar=1&navpanes=0`}
              title={cert.name}
              className="w-full h-full min-h-[380px] sm:min-h-[460px] border-0"
              loading="lazy"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-white border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-muted-foreground text-center sm:text-left">
            Need a certified hard copy or international regulatory dossier?{" "}
            <a href="/contact" className="text-primary font-semibold hover:underline">
              Contact our QA Desk
            </a>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border-border px-5 text-xs sm:text-sm cursor-pointer"
            >
              Close Viewer
            </Button>
            <Button
              onClick={handleDownload}
              className="rounded-xl bg-[color:var(--brand-blue-dark)] text-white hover:bg-slate-900 px-6 text-xs sm:text-sm font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <FileDown className="h-4 w-4" /> Download ({cert.fileSize})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
