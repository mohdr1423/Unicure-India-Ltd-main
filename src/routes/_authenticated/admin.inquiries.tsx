import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  RefreshCw,
  Send,
  Building2,
  AlertTriangle,
  RotateCw,
  Download,
  FileText,
} from "lucide-react";
import type { ServerInquiryRecord } from "@/lib/server-email";

export const Route = createFileRoute("/_authenticated/admin/inquiries")({
  component: AdminInquiriesPage,
  head: () => ({
    meta: [
      { title: "Website Inquiries & Leads — Admin Unicure India Ltd" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

interface AdminInquiriesResponse {
  success: boolean;
  primaryAdminEmail?: string;
  totalCount?: number;
  inquiries: ServerInquiryRecord[];
}

function AdminInquiriesPage() {
  const [search, setSearch] = useState("");
  const [selectedSource, setSelectedSource] = useState("all");
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const { data, isLoading, refetch, isFetching } = useQuery<AdminInquiriesResponse>({
    queryKey: ["admin-inquiries-ledger"],
    queryFn: async () => {
      const res = await fetch("/api/inquiries");
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      return res.json();
    },
    refetchInterval: 15000,
  });

  const inquiries = data?.inquiries ?? [];

  async function handleRetry(id: string) {
    setRetryingId(id);
    setActionFeedback(null);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "retry" }),
      });
      const json = await res.json();
      setActionFeedback(json.message || "Retry completed.");
      await refetch();
    } catch (err: any) {
      setActionFeedback(`Retry failed: ${err.message || String(err)}`);
    } finally {
      setRetryingId(null);
    }
  }

  const filtered = inquiries.filter((inq) => {
    const matchesSearch =
      inq.name.toLowerCase().includes(search.toLowerCase()) ||
      inq.email.toLowerCase().includes(search.toLowerCase()) ||
      (inq.company && inq.company.toLowerCase().includes(search.toLowerCase())) ||
      inq.message.toLowerCase().includes(search.toLowerCase());

    const matchesSource =
      selectedSource === "all" || inq.source.toLowerCase().includes(selectedSource.toLowerCase());

    return matchesSearch && matchesSource;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <Mail className="h-6 w-6 text-primary" />
            Website Inquiries & Leads
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Centralized lead pipeline routed to:{" "}
            <strong className="text-foreground font-mono bg-muted px-2 py-0.5 rounded">
              {data?.primaryAdminEmail || "humanrealityofficial@gmail.com"}
            </strong>
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-1.5 shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {actionFeedback && (
        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-sm font-medium">
          {actionFeedback}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border border-border shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Total Leads Logged
          </div>
          <div className="text-2xl font-bold mt-1 text-foreground">{inquiries.length}</div>
        </Card>
        <Card className="p-4 bg-white border border-border shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Primary Recipient
          </div>
          <div className="text-sm font-semibold mt-1 text-primary truncate">
            humanrealityofficial@gmail.com
          </div>
        </Card>
        <Card className="p-4 bg-white border border-border shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Persistent Storage
          </div>
          <div className="text-sm font-bold mt-1 text-emerald-600 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" /> 100% Leads Preserved
          </div>
        </Card>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, company, or requirement..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="rounded-md border border-input bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Sources</option>
          <option value="Bella AI">Bella AI Assistant</option>
          <option value="Contact">Contact Page Form</option>
          <option value="Pharmacovigilance">Pharmacovigilance Portal</option>
          <option value="Careers">Careers</option>
          <option value="Quote">Quote Requests</option>
        </select>
      </div>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Received Inquiries ({filtered.length})
          </CardTitle>
          <CardDescription>
            All submitted enquiries are stored permanently in the audit ledger and dispatched to
            humanrealityofficial@gmail.com.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading inquiry audit log…</p>}

          {!isLoading && filtered.length === 0 && (
            <div className="py-12 text-center text-muted-foreground">
              <Mail className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-base font-medium">No inquiries found matching criteria.</p>
              <p className="text-xs mt-1">
                New submissions from the website or Bella will appear here immediately.
              </p>
            </div>
          )}

          {filtered.map((inq) => (
            <div
              key={inq.id}
              className="rounded-xl border border-border bg-white p-5 shadow-sm space-y-3 hover:border-primary/40 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <Badge
                    variant="outline"
                    className="font-semibold bg-secondary/50 text-foreground"
                  >
                    {inq.source}
                  </Badge>
                  <Badge className="bg-primary text-white text-xs">{inq.inquiry_type}</Badge>
                  {inq.email_status === "sent" ? (
                    <Badge className="bg-emerald-600 text-white text-xs flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Email Dispatched
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-600 text-white text-xs flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" /> Stored (Email Pending Credentials)
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono">
                  <Clock className="h-3.5 w-3.5" />
                  {inq.created_at}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Contact Name
                  </span>
                  <span className="font-bold text-foreground text-base">{inq.name}</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.inquiry_type)} — Unicure India Ltd`}
                    className="font-medium text-primary hover:underline"
                  >
                    {inq.email}
                  </a>
                </div>
                <div>
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">
                    Phone / Country
                  </span>
                  <span className="text-foreground">
                    {inq.phone || "No phone"} {inq.country ? `(${inq.country})` : ""}
                  </span>
                </div>
              </div>

              {inq.company && (
                <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" /> Company:{" "}
                  <strong className="text-foreground font-medium">{inq.company}</strong>
                </div>
              )}

              {/* Resume Attachment Card if attached */}
              {(inq.metadata?.resumeFileName || inq.metadata?.resumeDataUrl) && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-emerald-300 bg-emerald-50/70 p-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-900 font-medium">
                    <FileText className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      Attached CV:{" "}
                      <strong>{String(inq.metadata?.resumeFileName || "Resume.pdf")}</strong>
                    </span>
                    {inq.metadata?.resumeFileSize && (
                      <span className="text-emerald-700 font-mono">
                        ({inq.metadata.resumeFileSize})
                      </span>
                    )}
                  </div>
                  {inq.metadata?.resumeDataUrl && (
                    <a
                      href={String(inq.metadata.resumeDataUrl)}
                      download={String(inq.metadata?.resumeFileName || "Candidate_CV.pdf")}
                      className="inline-flex items-center gap-1.5 rounded bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 font-semibold text-xs transition"
                    >
                      <Download className="h-3.5 w-3.5" /> Download CV
                    </a>
                  )}
                </div>
              )}

              <div className="rounded-lg bg-secondary/30 p-3.5 text-sm text-foreground/90 whitespace-pre-wrap font-sans border border-border/40">
                {inq.message}
              </div>

              {inq.error_log && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono">
                  <strong>Provider Status:</strong> {inq.email_provider || "N/A"}
                  <br />
                  <strong>Detail:</strong> {inq.error_log}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs text-muted-foreground">
                <span className="font-mono">ID: {inq.id}</span>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRetry(inq.id)}
                    disabled={retryingId === inq.id}
                    className="h-8 text-xs gap-1"
                  >
                    <RotateCw
                      className={`h-3.5 w-3.5 ${retryingId === inq.id ? "animate-spin" : ""}`}
                    />
                    Retry Email Dispatch
                  </Button>
                  <a
                    href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.inquiry_type)} — Unicure India Ltd`}
                    className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                  >
                    <Send className="h-3.5 w-3.5" /> Reply to Customer
                  </a>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
