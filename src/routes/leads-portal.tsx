import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Shield,
  Lock,
  User,
  Eye,
  EyeOff,
  Mail,
  Phone,
  Building2,
  Globe,
  Calendar,
  Search,
  Download,
  RotateCw,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Send,
  Trash2,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronDown,
  FileSpreadsheet,
} from "lucide-react";
import type { ServerInquiryRecord } from "@/lib/server-email";

export const Route = createFileRoute("/leads-portal")({
  component: LeadsPortalPage,
  head: () => ({
    meta: [
      { title: "Leads & Inquiries Portal — Unicure India Ltd" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const AUTH_STORAGE_KEY = "unicure_leads_auth_token";

function LeadsPortalPage() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Login form state
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [inquiries, setInquiries] = useState<ServerInquiryRecord[]>([]);
  const [primaryAdminEmail, setPrimaryAdminEmail] = useState("humanrealityofficial@gmail.com");
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Check existing session token on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (saved) {
      verifyAndLoad(saved);
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  async function verifyAndLoad(token: string) {
    setIsCheckingAuth(true);
    try {
      const res = await fetch("/api/leads-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-leads", token }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthToken(token);
        setInquiries(data.inquiries || []);
        if (data.primaryAdminEmail) setPrimaryAdminEmail(data.primaryAdminEmail);
      } else {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthToken(null);
      }
    } catch {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      setAuthToken(null);
    } finally {
      setIsCheckingAuth(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");

    if (!usernameInput.trim() || !passwordInput) {
      setLoginError("Please enter both username and password.");
      return;
    }

    setLoginLoading(true);
    try {
      const res = await fetch("/api/leads-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          username: usernameInput.trim(),
          password: passwordInput,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.token) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, data.token);
        setAuthToken(data.token);
        setPasswordInput("");
        await loadLeads(data.token);
      } else {
        setLoginError(data.message || "Invalid credentials. Access denied.");
      }
    } catch (err: any) {
      setLoginError("Network connection error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function loadLeads(tokenToUse?: string) {
    const tok = tokenToUse || authToken;
    if (!tok) return;
    setIsLoadingLeads(true);
    setActionFeedback(null);
    try {
      const res = await fetch("/api/leads-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-leads", token: tok }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries(data.inquiries || []);
        if (data.primaryAdminEmail) setPrimaryAdminEmail(data.primaryAdminEmail);
      } else {
        if (res.status === 401) handleLogout();
      }
    } catch {
      // Network error
    } finally {
      setIsLoadingLeads(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthToken(null);
    setInquiries([]);
    setUsernameInput("");
    setPasswordInput("");
    setLoginError("");
  }

  async function handleRetryEmail(id: string) {
    if (!authToken) return;
    setRetryingId(id);
    setActionFeedback(null);
    try {
      const res = await fetch("/api/leads-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "retry-email", token: authToken, id }),
      });
      const json = await res.json();
      setActionFeedback(json.message || "Email action completed.");
      await loadLeads();
    } catch (err: any) {
      setActionFeedback(`Action failed: ${err.message || String(err)}`);
    } finally {
      setRetryingId(null);
    }
  }

  async function handleDeleteLead(id: string) {
    if (!authToken) return;
    if (!window.confirm("Are you sure you want to delete this lead record? This action cannot be undone.")) {
      return;
    }
    setDeletingId(id);
    setActionFeedback(null);
    try {
      const res = await fetch("/api/leads-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete-lead", token: authToken, id }),
      });
      const json = await res.json();
      if (json.success) {
        setActionFeedback("Lead removed successfully.");
        setInquiries((prev) => prev.filter((i) => i.id !== id));
      } else {
        setActionFeedback(json.message || "Could not delete lead.");
      }
    } catch (err: any) {
      setActionFeedback(`Delete failed: ${err.message || String(err)}`);
    } finally {
      setDeletingId(null);
    }
  }

  // Export Leads to CSV Spreadsheet
  function handleExportCSV() {
    if (!inquiries.length) return;
    const headers = [
      "Lead ID",
      "Date & Time",
      "Full Name",
      "Company",
      "Email",
      "Phone",
      "Country",
      "Inquiry Type",
      "Source Page",
      "Email Status",
      "Message / Requirement",
    ];

    const rows = filteredInquiries.map((inq) => [
      `"${inq.id}"`,
      `"${inq.created_at || ""}"`,
      `"${(inq.name || "").replace(/"/g, '""')}"`,
      `"${(inq.company || "").replace(/"/g, '""')}"`,
      `"${inq.email || ""}"`,
      `"${inq.phone || ""}"`,
      `"${inq.country || ""}"`,
      `"${(inq.inquiry_type || "").replace(/"/g, '""')}"`,
      `"${inq.page_url || inq.source || ""}"`,
      `"${inq.email_status || ""}"`,
      `"${(inq.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `unicure_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filter & Sort Logic
  const filteredInquiries = useMemo(() => {
    let list = [...inquiries];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (inq) =>
          inq.name?.toLowerCase().includes(q) ||
          inq.email?.toLowerCase().includes(q) ||
          inq.company?.toLowerCase().includes(q) ||
          inq.phone?.toLowerCase().includes(q) ||
          inq.country?.toLowerCase().includes(q) ||
          inq.message?.toLowerCase().includes(q) ||
          inq.inquiry_type?.toLowerCase().includes(q)
      );
    }

    if (selectedType !== "all") {
      list = list.filter((inq) =>
        inq.inquiry_type?.toLowerCase().includes(selectedType.toLowerCase())
      );
    }

    if (selectedStatus !== "all") {
      list = list.filter((inq) => inq.email_status === selectedStatus);
    }

    if (sortOrder === "oldest") {
      list.reverse();
    }

    return list;
  }, [inquiries, search, selectedType, selectedStatus, sortOrder]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = inquiries.length;
    const quotes = inquiries.filter((i) =>
      i.inquiry_type?.toLowerCase().includes("quot") ||
      i.inquiry_type?.toLowerCase().includes("manufactur")
    ).length;
    const exportsCount = inquiries.filter((i) =>
      i.inquiry_type?.toLowerCase().includes("export") ||
      i.source?.toLowerCase().includes("export")
    ).length;
    const adr = inquiries.filter((i) =>
      i.inquiry_type?.toLowerCase().includes("pharmacovigilance") ||
      i.inquiry_type?.toLowerCase().includes("adverse")
    ).length;

    return { total, quotes, exportsCount, adr };
  }, [inquiries]);

  // Loading State
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium text-slate-400">Verifying security session...</p>
      </div>
    );
  }

  // ==========================================
  // VIEW 1: LOCKED LOGIN SCREEN
  // ==========================================
  if (!authToken) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 shadow-2xl text-emerald-400 mb-4">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Unicure India Ltd.
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 uppercase tracking-widest font-semibold">
              Leads & Inquiries Portal
            </p>
          </div>

          {/* Secure Login Card */}
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-6 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl">
              <Lock className="h-3.5 w-3.5 shrink-0" />
              <span>Protected Dashboard — Authorized Access Only</span>
            </div>

            {loginError && (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="Enter username"
                    autoComplete="username"
                    required
                    className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-xl bg-slate-950/80 border border-slate-800 py-3 pl-10 pr-11 text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-emerald-500 hover:to-teal-500 transition active:scale-[0.98] disabled:opacity-50 cursor-pointer"
              >
                {loginLoading ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    <span>Unlock Leads Portal</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center mt-6 text-xs text-slate-600">
            Unicure India Ltd. • Internal Operations & Lead CRM
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED LEADS DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold shadow-sm">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-tight">
                  Unicure India Ltd.
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Leads
                </span>
              </div>
              <p className="text-xs text-slate-400">Visitor Information & Quotation Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportCSV}
              disabled={!inquiries.length}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition shadow-sm cursor-pointer disabled:opacity-40"
              title="Download all leads as CSV spreadsheet"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Export to</span> CSV
            </button>

            <button
              onClick={() => loadLeads()}
              disabled={isLoadingLeads}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition shadow-sm cursor-pointer"
              title="Refresh inquiries list"
            >
              <RotateCw className={`h-3.5 w-3.5 text-blue-400 ${isLoadingLeads ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 px-3.5 py-2 text-xs font-semibold text-red-300 transition shadow-sm cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 p-4 text-xs sm:text-sm text-emerald-300 shadow-md">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{actionFeedback}</span>
            </div>
            <button
              onClick={() => setActionFeedback(null)}
              className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Stats Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Leads</span>
              <Mail className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-white">{stats.total}</div>
            <p className="text-[11px] text-slate-500 mt-1">All website submissions</p>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Manufacturing RFQs</span>
              <Building2 className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{stats.quotes}</div>
            <p className="text-[11px] text-slate-500 mt-1">Quotation requests</p>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Export Leads</span>
              <Globe className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-400">{stats.exportsCount}</div>
            <p className="text-[11px] text-slate-500 mt-1">International buyers</p>
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Safety / ADR</span>
              <AlertTriangle className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-amber-400">{stats.adr}</div>
            <p className="text-[11px] text-slate-500 mt-1">Pharmacovigilance reports</p>
          </div>
        </div>

        {/* Search, Filter & Controls Strip */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 space-y-3 sm:space-y-0 sm:flex sm:items-center sm:gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, company, email, phone, country..."
              className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs sm:text-sm text-slate-300 focus:border-emerald-500 focus:outline-none transition cursor-pointer"
            >
              <option value="all">All Inquiry Types</option>
              <option value="quotation">Quotations / RFQs</option>
              <option value="export">Exports</option>
              <option value="contact">General Contact</option>
              <option value="job">Job Applications</option>
              <option value="pharmacovigilance">Drug Safety (ADR)</option>
            </select>

            {/* Email Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs sm:text-sm text-slate-300 focus:border-emerald-500 focus:outline-none transition cursor-pointer"
            >
              <option value="all">All Email Statuses</option>
              <option value="sent">Delivered (Sent)</option>
              <option value="failed">Failed / Pending</option>
            </select>

            {/* Sort Order */}
            <button
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
              className="rounded-xl bg-slate-950 border border-slate-800 py-2.5 px-3 text-xs font-semibold text-slate-300 hover:text-white transition cursor-pointer shrink-0"
              title="Toggle sort order"
            >
              {sortOrder === "newest" ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>

        {/* Inquiries List Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>
            Showing <strong className="text-white">{filteredInquiries.length}</strong> of{" "}
            <strong>{inquiries.length}</strong> leads
          </span>
          <span>Target Dispatch: <strong className="text-emerald-400 font-mono">{primaryAdminEmail}</strong></span>
        </div>

        {/* Inquiries Records Cards List */}
        {filteredInquiries.length === 0 ? (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center">
            <Mail className="h-12 w-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No inquiries found</h3>
            <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
              {search || selectedType !== "all"
                ? "No leads match your current search and filter criteria. Try clearing the filters."
                : "No leads have been received yet. Submissions from contact forms, quote requests, and Bella AI will appear here."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inq) => {
              const isRetrying = retryingId === inq.id;
              const isDeleting = deletingId === inq.id;
              const isDelivered = inq.email_status === "sent";

              return (
                <article
                  key={inq.id}
                  className="rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition p-5 sm:p-6 space-y-4 shadow-sm"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{inq.name}</h3>
                        {inq.company && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                            <Building2 className="h-3 w-3 text-slate-400" />
                            {inq.company}
                          </span>
                        )}
                        {inq.country && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-800/60 px-2 py-0.5 text-xs text-slate-400">
                            <Globe className="h-3 w-3 text-slate-400" />
                            {inq.country}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1.5">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          {inq.created_at || "Recent"}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">Source: <code className="text-slate-300 bg-slate-800/80 px-1.5 py-0.5 rounded">{inq.source || inq.page_url || "/"}</code></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Inquiry Type Badge */}
                      <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-400">
                        {inq.inquiry_type || "General Inquiry"}
                      </span>

                      {/* Email Status Indicator */}
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold inline-flex items-center gap-1 ${
                          isDelivered
                            ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                            : "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                        }`}
                        title={inq.email_provider || "Email dispatch status"}
                      >
                        {isDelivered ? (
                          <>
                            <CheckCircle2 className="h-3 w-3" />
                            <span>Emailed</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="h-3 w-3" />
                            <span>Pending</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Visitor Contact Quick Action Bar */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
                    {/* Direct Email */}
                    <a
                      href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.inquiry_type || "Inquiry")} — Unicure India Ltd`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 font-semibold text-slate-200 transition"
                    >
                      <Mail className="h-3.5 w-3.5 text-blue-400" />
                      <span>{inq.email}</span>
                    </a>

                    {/* Direct Phone / WhatsApp */}
                    {inq.phone && (
                      <>
                        <a
                          href={`tel:${inq.phone.replace(/[^0-9+]/g, "")}`}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 font-semibold text-slate-200 transition"
                        >
                          <Phone className="h-3.5 w-3.5 text-emerald-400" />
                          <span>{inq.phone}</span>
                        </a>

                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=Hello%20${encodeURIComponent(inq.name)}%2C%20thank%20you%20for%20contacting%20Unicure%20India%20Ltd.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/50 px-3 py-1.5 font-semibold text-emerald-300 transition"
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-emerald-400" />
                          <span>WhatsApp</span>
                        </a>
                      </>
                    )}
                  </div>

                  {/* Lead Message / Requirement */}
                  <div className="rounded-xl bg-slate-950/90 border border-slate-800/80 p-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Requirement / Message Details:
                    </div>
                    <p className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {inq.message}
                    </p>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
                    <div className="text-slate-500 text-[11px]">
                      Lead ID: <code className="font-mono text-slate-400">{inq.id}</code>
                      {inq.email_provider && (
                        <span className="ml-2">({inq.email_provider})</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRetryEmail(inq.id)}
                        disabled={isRetrying}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-800 hover:bg-slate-700 px-3 py-1.5 font-medium text-slate-300 transition cursor-pointer disabled:opacity-40"
                        title="Re-send notification email to humanrealityofficial@gmail.com"
                      >
                        <Send className={`h-3 w-3 ${isRetrying ? "animate-spin" : ""}`} />
                        <span>{isRetrying ? "Sending..." : "Re-trigger Email"}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteLead(inq.id)}
                        disabled={isDeleting}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-900/30 px-3 py-1.5 font-medium transition cursor-pointer disabled:opacity-40"
                        title="Delete lead record"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span>{isDeleting ? "Deleting..." : "Delete"}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
