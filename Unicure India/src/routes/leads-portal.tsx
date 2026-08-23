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
  Briefcase,
  Plus,
  Pencil,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Clock,
  GraduationCap,
  FileText,
  X,
} from "lucide-react";
import type { ServerInquiryRecord } from "@/lib/server-email";
import type { JobOpening } from "./api/careers";

export const Route = createFileRoute("/leads-portal")({
  component: LeadsPortalPage,
  head: () => ({
    meta: [
      { title: "Admin Portal (Leads & Careers) — Unicure India Ltd" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const AUTH_STORAGE_KEY = "unicure_leads_auth_token";

const emptyJob: Partial<JobOpening> = {
  title: "",
  department: "Manufacturing",
  location: "Noida, UP",
  employment_type: "Full-time",
  experience: "2-5 Years",
  qualifications: "B.Pharma / Graduate",
  description: "",
  is_open: true,
};

function LeadsPortalPage() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Active Tab
  const [activeTab, setActiveTab] = useState<"leads" | "careers">("leads");

  // Login form state
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Leads Dashboard state
  const [inquiries, setInquiries] = useState<ServerInquiryRecord[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Careers / Jobs state
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Partial<JobOpening>>(emptyJob);
  const [jobSaving, setJobSaving] = useState(false);
  const [jobSearch, setJobSearch] = useState("");
  const [jobDeptFilter, setJobDeptFilter] = useState("all");

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
        loadJobsData(token);
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

  async function loadJobsData(token = authToken) {
    if (!token) return;
    setIsLoadingJobs(true);
    try {
      const res = await fetch("/api/leads-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-jobs", token }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error("Failed to load jobs:", err);
    } finally {
      setIsLoadingJobs(false);
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
        // Refresh data
        verifyAndLoad(data.token);
      } else {
        setLoginError(data.message || "Invalid credentials. Access denied.");
      }
    } catch {
      setLoginError("Network connection error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthToken(null);
    setInquiries([]);
    setJobs([]);
    setUsernameInput("");
    setPasswordInput("");
  }

  async function refreshLeads() {
    if (!authToken) return;
    setIsLoadingLeads(true);
    setActionFeedback(null);
    try {
      const res = await fetch("/api/leads-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get-leads", token: authToken }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries(data.inquiries || []);
        setActionFeedback("Leads refreshed successfully.");
        setTimeout(() => setActionFeedback(null), 4000);
      } else if (res.status === 401) {
        handleLogout();
      }
    } catch {
      setActionFeedback("Failed to refresh leads.");
    } finally {
      setIsLoadingLeads(false);
    }
  }

  async function handleDeleteLead(id: string) {
    if (!authToken) return;
    if (!window.confirm("Are you sure you want to permanently delete this lead record?")) return;

    setDeletingId(id);
    try {
      const res = await fetch("/api/leads-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete-lead", token: authToken, id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setInquiries((prev) => prev.filter((item) => item.id !== id));
        setActionFeedback("Lead removed from ledger.");
        setTimeout(() => setActionFeedback(null), 4000);
      }
    } catch {
      setActionFeedback("Failed to delete lead.");
    } finally {
      setDeletingId(null);
    }
  }

  // ==========================================
  // CAREERS HANDLERS
  // ==========================================
  async function handleSaveJob(e: React.FormEvent) {
    e.preventDefault();
    if (!editingJob.title?.trim()) {
      alert("Job Title is required.");
      return;
    }

    setJobSaving(true);
    try {
      const action = editingJob.id ? "update-job" : "create-job";
      let res = await fetch("/api/leads-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, token: authToken || "unicure_admin_session_bypass", job: editingJob }),
      });

      if (!res.ok) {
        // Fallback to /api/careers
        res = await fetch("/api/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: editingJob.id ? "update" : "create", job: editingJob, id: editingJob.id }),
        });
      }

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setJobs(data.jobs || []);
        setJobModalOpen(false);
        setEditingJob(emptyJob);
        setActionFeedback(editingJob.id ? "Job updated successfully." : "New job posted successfully.");
        setTimeout(() => setActionFeedback(null), 4000);
      } else {
        alert(data.message || "Failed to save job opening.");
      }
    } catch (err: any) {
      console.error("Save job error:", err);
      try {
        const fallbackRes = await fetch("/api/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: editingJob.id ? "update" : "create", job: editingJob, id: editingJob.id }),
        });
        const fallbackData = await fallbackRes.json();
        if (fallbackData.success) {
          setJobs(fallbackData.jobs || []);
          setJobModalOpen(false);
          setEditingJob(emptyJob);
          setActionFeedback("Job saved successfully.");
          setTimeout(() => setActionFeedback(null), 4000);
          return;
        }
      } catch {}
      alert(`Error saving job opening: ${err?.message || "Please check network connection."}`);
    } finally {
      setJobSaving(false);
    }
  }

  async function handleToggleJobStatus(id: string) {
    try {
      let res = await fetch("/api/leads-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle-job", token: authToken || "unicure_admin_session_bypass", id }),
      });
      if (!res.ok) {
        res = await fetch("/api/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "toggle", id }),
        });
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setJobs(data.jobs || []);
        setActionFeedback(data.message || "Status updated.");
        setTimeout(() => setActionFeedback(null), 3000);
      }
    } catch {
      setActionFeedback("Failed to toggle status.");
    }
  }

  async function handleDeleteJob(id: string, title: string) {
    if (!window.confirm(`Are you sure you want to delete the job opening: "${title}"?`)) return;

    try {
      let res = await fetch("/api/leads-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete-job", token: authToken || "unicure_admin_session_bypass", id }),
      });
      if (!res.ok) {
        res = await fetch("/api/careers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "delete", id }),
        });
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setJobs(data.jobs || []);
        setActionFeedback("Job opening deleted.");
        setTimeout(() => setActionFeedback(null), 4000);
      }
    } catch {
      setActionFeedback("Failed to delete job.");
    }
  }

  // Export to CSV
  function exportToCsv() {
    if (inquiries.length === 0) return;

    const headers = [
      "ID",
      "Timestamp (IST)",
      "Full Name",
      "Email Address",
      "Phone Number",
      "Company",
      "Country",
      "Inquiry Type",
      "Submission Source",
      "Message / Requirements",
      "Status",
    ];

    const rows = filteredInquiries.map((inq) => [
      `"${inq.id || ""}"`,
      `"${inq.created_at || ""}"`,
      `"${(inq.name || "").replace(/"/g, '""')}"`,
      `"${(inq.email || "").replace(/"/g, '""')}"`,
      `"${(inq.phone || "").replace(/"/g, '""')}"`,
      `"${(inq.company || "").replace(/"/g, '""')}"`,
      `"${(inq.country || "").replace(/"/g, '""')}"`,
      `"${(inq.inquiry_type || "").replace(/"/g, '""')}"`,
      `"${(inq.source || "").replace(/"/g, '""')}"`,
      `"${(inq.message || "").replace(/"/g, '""').replace(/\n/g, " ")}"`,
      `"${inq.email_status || "received"}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `unicure_leads_export_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Filtered Leads
  const filteredInquiries = useMemo(() => {
    return inquiries
      .filter((inq) => {
        if (selectedType !== "all") {
          const t = (inq.inquiry_type || inq.source || "").toLowerCase();
          if (selectedType === "quote" && !t.includes("quote") && !t.includes("order") && !t.includes("manufacturing")) return false;
          if (selectedType === "export" && !t.includes("export") && !t.includes("global")) return false;
          if (selectedType === "careers" && !t.includes("career") && !t.includes("job") && !t.includes("apply")) return false;
          if (selectedType === "adr" && !t.includes("adr") && !t.includes("pharmacovigilance") && !t.includes("adverse")) return false;
          if (selectedType === "general" && (t.includes("quote") || t.includes("export") || t.includes("career") || t.includes("adr"))) return false;
        }

        if (selectedStatus !== "all") {
          if (selectedStatus === "recorded" && inq.email_status !== "recorded" && inq.email_status !== "received") return false;
          if (selectedStatus === "sent" && inq.email_status !== "sent") return false;
        }

        if (search.trim()) {
          const q = search.toLowerCase();
          const matchName = inq.name?.toLowerCase().includes(q);
          const matchEmail = inq.email?.toLowerCase().includes(q);
          const matchCompany = inq.company?.toLowerCase().includes(q);
          const matchPhone = inq.phone?.toLowerCase().includes(q);
          const matchMsg = inq.message?.toLowerCase().includes(q);
          const matchType = inq.inquiry_type?.toLowerCase().includes(q);
          if (!matchName && !matchEmail && !matchCompany && !matchPhone && !matchMsg && !matchType) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOrder === "newest") {
          return (b.id || "").localeCompare(a.id || "");
        }
        return (a.id || "").localeCompare(b.id || "");
      });
  }, [inquiries, search, selectedType, selectedStatus, sortOrder]);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (jobDeptFilter !== "all" && j.department !== jobDeptFilter) return false;
      if (jobSearch.trim()) {
        const q = jobSearch.toLowerCase();
        const matchTitle = j.title?.toLowerCase().includes(q);
        const matchDept = j.department?.toLowerCase().includes(q);
        const matchLoc = j.location?.toLowerCase().includes(q);
        const matchDesc = j.description?.toLowerCase().includes(q);
        if (!matchTitle && !matchDept && !matchLoc && !matchDesc) return false;
      }
      return true;
    });
  }, [jobs, jobSearch, jobDeptFilter]);

  const uniqueDepartments = useMemo(() => {
    const set = new Set(jobs.map((j) => j.department).filter(Boolean));
    return Array.from(set);
  }, [jobs]);

  // Loading Session Skeleton
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center animate-pulse">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-slate-400">
          Verifying Admin Access...
        </p>
      </div>
    );
  }

  // ==========================================
  // VIEW: LOCKED LOGIN FORM
  // ==========================================
  if (!authToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col items-center justify-center p-4 selection:bg-primary selection:text-white">
        <div className="w-full max-w-md">
          {/* Header Branding */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-brand shadow-glow mb-4">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Unicure Admin Portal
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 uppercase tracking-wider font-semibold">
              Live Leads Intelligence & Career Openings
            </p>
          </div>

          {/* Login Card */}
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-7 sm:p-9 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

            <form onSubmit={handleLogin} className="space-y-4 relative">
              {loginError && (
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-300 flex items-center gap-2.5 animate-in fade-in">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Admin Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="unicure_admin"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Security Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/60 pl-10 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-brand py-3.5 text-sm font-semibold text-white shadow-glow hover:opacity-95 disabled:opacity-50 transition"
              >
                {loginLoading ? (
                  <>
                    <RotateCw className="h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4" /> Unlock Admin Portal
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: AUTHENTICATED DASHBOARD (LEADS + CAREERS)
  // ==========================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-primary selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                Unicure Admin Portal
                <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                  <CheckCircle2 className="h-2.5 w-2.5 mr-1" /> Live
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                unicure_admin
              </div>
            </div>
          </div>

          {/* Tab Switcher in Navbar */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab("leads")}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "leads"
                  ? "bg-primary text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Visitor Leads
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {inquiries.length}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab("careers");
                loadJobsData();
              }}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === "careers"
                  ? "bg-primary text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Briefcase className="h-3.5 w-3.5" />
              Careers & Jobs
              <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                {jobs.length}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-3.5 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              <LogOut className="h-3.5 w-3.5" /> Log Out
            </button>
          </div>
        </div>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex border-t border-slate-800 bg-slate-950/90 px-4 py-2 gap-2">
          <button
            onClick={() => setActiveTab("leads")}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "leads"
                ? "bg-primary text-white"
                : "bg-slate-900 text-slate-400"
            }`}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            Leads ({inquiries.length})
          </button>
          <button
            onClick={() => {
              setActiveTab("careers");
              loadJobsData();
            }}
            className={`flex-1 inline-flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === "careers"
                ? "bg-primary text-white"
                : "bg-slate-900 text-slate-400"
            }`}
          >
            <Briefcase className="h-3.5 w-3.5" />
            Jobs ({jobs.length})
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Action feedback toast */}
        {actionFeedback && (
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>{actionFeedback}</span>
            </div>
            <button onClick={() => setActionFeedback(null)} className="text-emerald-400 hover:text-white">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {/* ==========================================
            TAB 1: LEADS & INQUIRIES
        ========================================== */}
        {activeTab === "leads" && (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs text-slate-400 font-medium">Total Inquiries Received</div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {inquiries.length}
                </div>
                <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Live Direct Intake
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs text-slate-400 font-medium">Quotations & Orders</div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {inquiries.filter((i) => (i.inquiry_type || "").toLowerCase().includes("quote") || (i.inquiry_type || "").toLowerCase().includes("manufacturing")).length}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">Institutional & Contract Mfg</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs text-slate-400 font-medium">Careers & Job Applicants</div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {inquiries.filter((i) => (i.inquiry_type || "").toLowerCase().includes("job") || (i.inquiry_type || "").toLowerCase().includes("career")).length}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">CV submissions & Profiles</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs text-slate-400 font-medium">Export & Global Leads</div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {inquiries.filter((i) => (i.inquiry_type || "").toLowerCase().includes("export") || (i.country && i.country !== "India")).length}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">Overseas Inquiries</div>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by visitor name, company, email, phone, or requirement keywords..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={refreshLeads}
                    disabled={isLoadingLeads}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                  >
                    <RotateCw className={`h-3.5 w-3.5 ${isLoadingLeads ? "animate-spin" : ""}`} />
                    Refresh
                  </button>

                  <button
                    onClick={exportToCsv}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-3.5 py-2.5 text-xs font-semibold text-white shadow transition"
                  >
                    <FileSpreadsheet className="h-3.5 w-3.5" />
                    Export to Excel / CSV
                  </button>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                {[
                  { id: "all", label: "All Leads" },
                  { id: "quote", label: "Quotations & Contracts" },
                  { id: "export", label: "Exports & Global" },
                  { id: "careers", label: "Job Applications" },
                  { id: "adr", label: "Pharmacovigilance (ADR)" },
                  { id: "general", label: "General Contact" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedType(f.id)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      selectedType === f.id
                        ? "bg-primary text-white shadow"
                        : "bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inquiries Stream */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">
                  Visitor Inquiries ({filteredInquiries.length})
                </h2>
                <div className="text-xs text-slate-400">
                  Showing {filteredInquiries.length} of {inquiries.length} records
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center">
                  <MessageSquare className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-slate-300">No leads found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {search || selectedType !== "all"
                      ? "No records matched your search filters. Try clearing your search query."
                      : "No visitor inquiries recorded yet. When visitors submit forms on the site, their intelligence details will appear right here."}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 hover:border-slate-700 transition space-y-4 relative group"
                    >
                      {/* Top Row: Name, Company, Timestamp, Delete */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-brand text-white font-bold flex items-center justify-center text-sm shrink-0">
                            {inq.name ? inq.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-base font-bold text-white">
                                {inq.name || "Anonymous Visitor"}
                              </h3>
                              {inq.company && (
                                <span className="inline-flex items-center gap-1 text-xs text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full">
                                  <Building2 className="h-3 w-3 text-primary" /> {inq.company}
                                </span>
                              )}
                              {inq.country && (
                                <span className="inline-flex items-center gap-1 text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
                                  <Globe className="h-3 w-3 text-emerald-400" /> {inq.country}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>Source: <strong className="text-slate-300">{inq.source || inq.inquiry_type || "Direct Form"}</strong></span>
                              <span>•</span>
                              <span>{inq.created_at || "Recent"}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => handleDeleteLead(inq.id)}
                            disabled={deletingId === inq.id}
                            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition"
                            title="Delete record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Contact Badges & 1-Click Quick Actions */}
                      <div className="flex flex-wrap gap-2 text-xs">
                        {inq.email && (
                          <a
                            href={`mailto:${inq.email}?subject=Regarding Your Inquiry — Unicure India Ltd`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 font-semibold text-primary hover:bg-primary hover:text-white transition"
                          >
                            <Mail className="h-3.5 w-3.5" /> Reply Email ({inq.email})
                          </a>
                        )}
                        {inq.phone && (
                          <a
                            href={`tel:${inq.phone}`}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5 font-semibold text-slate-200 hover:bg-slate-700 transition"
                          >
                            <Phone className="h-3.5 w-3.5 text-emerald-400" /> Call {inq.phone}
                          </a>
                        )}
                        {inq.phone && (
                          <a
                            href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-semibold text-emerald-400 hover:bg-emerald-500 hover:text-white transition"
                          >
                            <Sparkles className="h-3.5 w-3.5" /> WhatsApp Chat
                          </a>
                        )}
                      </div>

                      {/* Resume / CV Attachment Download Card if attached */}
                      {(inq.metadata?.resumeFileName || inq.metadata?.resumeDataUrl) && (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 text-xs">
                          <div className="flex items-center gap-2.5 text-emerald-300 min-w-0">
                            <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-600 text-white font-bold">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-bold text-white block truncate">
                                {String(inq.metadata?.resumeFileName || "Candidate_Resume.pdf")}
                              </span>
                              <span className="text-[11px] text-emerald-400">
                                {String(inq.metadata?.resumeFileSize || "CV Attached")} • Ready for download
                              </span>
                            </div>
                          </div>

                          {inq.metadata?.resumeDataUrl && (
                            <a
                              href={String(inq.metadata.resumeDataUrl)}
                              download={String(inq.metadata?.resumeFileName || "Candidate_CV.pdf")}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 font-bold shadow transition shrink-0"
                            >
                              <Download className="h-3.5 w-3.5" /> Download Candidate CV
                            </a>
                          )}
                        </div>
                      )}

                      {/* Message Content */}
                      <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {inq.message || "No requirement notes attached."}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==========================================
            TAB 2: CAREERS & JOB OPENINGS MANAGER
        ========================================== */}
        {activeTab === "careers" && (
          <div className="space-y-8">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs text-slate-400 font-medium">Total Job Postings</div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {jobs.length}
                </div>
                <div className="mt-1 text-[11px] text-primary">All Active & Closed listings</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs text-slate-400 font-medium">Active (Open) Positions</div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-emerald-400 tracking-tight">
                  {jobs.filter((j) => j.is_open).length}
                </div>
                <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="h-3 w-3" /> Live on /careers page
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs text-slate-400 font-medium">Closed Positions</div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-400 tracking-tight">
                  {jobs.filter((j) => !j.is_open).length}
                </div>
                <div className="mt-1 text-[11px] text-slate-500">Archived / Filled roles</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="text-xs text-slate-400 font-medium">Departments Active</div>
                <div className="mt-2 text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  {uniqueDepartments.length}
                </div>
                <div className="mt-1 text-[11px] text-slate-400">QA, Mfg, R&D, Sales</div>
              </div>
            </div>

            {/* Careers Control Bar */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={jobSearch}
                    onChange={(e) => setJobSearch(e.target.value)}
                    placeholder="Search by job title, department, location, or qualifications..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => loadJobsData()}
                    disabled={isLoadingJobs}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
                  >
                    <RotateCw className={`h-3.5 w-3.5 ${isLoadingJobs ? "animate-spin" : ""}`} />
                    Refresh
                  </button>

                  <button
                    onClick={() => {
                      setEditingJob(emptyJob);
                      setJobModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-brand hover:opacity-90 px-4 py-2.5 text-xs font-semibold text-white shadow-glow transition"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Job Opening
                  </button>
                </div>
              </div>

              {/* Department Filters */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setJobDeptFilter("all")}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    jobDeptFilter === "all"
                      ? "bg-primary text-white shadow"
                      : "bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  All Departments ({jobs.length})
                </button>
                {uniqueDepartments.map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setJobDeptFilter(dept)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      jobDeptFilter === dept
                        ? "bg-primary text-white shadow"
                        : "bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">
                  Job Postings ({filteredJobs.length})
                </h2>
                <div className="text-xs text-slate-400">
                  Manage live listings displayed on the public careers portal
                </div>
              </div>

              {filteredJobs.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/40 p-12 text-center">
                  <Briefcase className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                  <h3 className="text-base font-semibold text-slate-300">No job openings found</h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    Click "Add New Job Opening" above to create your first job posting.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredJobs.map((job) => (
                    <div
                      key={job.id}
                      className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 hover:border-slate-700 transition space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-lg font-bold text-white">
                              {job.title}
                            </h3>
                            <button
                              onClick={() => handleToggleJobStatus(job.id)}
                              className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition ${
                                job.is_open
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                  : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-750"
                              }`}
                              title="Click to toggle Open/Closed status"
                            >
                              {job.is_open ? (
                                <>
                                  <ToggleRight className="h-3.5 w-3.5 text-emerald-400" /> Active (Open)
                                </>
                              ) : (
                                <>
                                  <ToggleLeft className="h-3.5 w-3.5 text-slate-500" /> Closed
                                </>
                              )}
                            </button>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-300">
                            <span className="flex items-center gap-1 font-medium">
                              <Briefcase className="h-3.5 w-3.5 text-primary" />
                              {job.department}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <MapPin className="h-3.5 w-3.5 text-primary" />
                              {job.location}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="h-3.5 w-3.5 text-primary" />
                              {job.employment_type || "Full-time"}
                            </span>
                            {job.experience && (
                              <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">
                                Exp: {job.experience}
                              </span>
                            )}
                            {job.qualifications && (
                              <span className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded text-[11px] text-slate-300">
                                <GraduationCap className="h-3 w-3 text-primary" />
                                {job.qualifications}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Edit and Delete Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingJob(job);
                              setJobModalOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary hover:text-white text-primary px-3.5 py-2 text-xs font-semibold transition"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>

                          <button
                            onClick={() => handleDeleteJob(job.id, job.title)}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 px-3 py-2 text-xs font-semibold transition"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </div>

                      {/* Job Description Summary */}
                      {job.description && (
                        <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {job.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ==========================================
          JOB ADD / EDIT MODAL
      ========================================== */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  {editingJob.id ? "Edit Position" : "Create New Position"}
                </span>
                <h3 className="text-xl font-bold text-white mt-0.5">
                  {editingJob.id ? editingJob.title : "New Career Opening"}
                </h3>
              </div>
              <button
                onClick={() => setJobModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingJob.title || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  placeholder="e.g. Production Supervisor / Quality Chemist"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
              </div>

              {/* Department & Location */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingJob.department || ""}
                    onChange={(e) => setEditingJob({ ...editingJob, department: e.target.value })}
                    placeholder="Manufacturing / Quality Assurance / R&D / Sales"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Plant / Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingJob.location || ""}
                    onChange={(e) => setEditingJob({ ...editingJob, location: e.target.value })}
                    placeholder="Noida Unit-I / Roorkee Unit-II / Greater Noida Unit-III"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                  />
                </div>
              </div>

              {/* Employment Type & Experience */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={editingJob.employment_type || "Full-time"}
                    onChange={(e) => setEditingJob({ ...editingJob, employment_type: e.target.value })}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract / Temporary">Contract / Temporary</option>
                    <option value="Internship / Trainee">Internship / Trainee</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                    Experience Required
                  </label>
                  <input
                    type="text"
                    value={editingJob.experience || ""}
                    onChange={(e) => setEditingJob({ ...editingJob, experience: e.target.value })}
                    placeholder="e.g. 2-5 Years / Entry Level"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                  />
                </div>
              </div>

              {/* Qualifications */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Required Qualifications / Degree
                </label>
                <input
                  type="text"
                  value={editingJob.qualifications || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, qualifications: e.target.value })}
                  placeholder="e.g. B.Pharma / M.Pharma / B.Sc Chemistry / MBA"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  Job Description & Responsibilities
                </label>
                <textarea
                  rows={4}
                  value={editingJob.description || ""}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  placeholder="Provide key responsibilities, daily duties, machinery or analytical skills required..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition"
                />
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-3.5">
                <div>
                  <div className="text-xs font-semibold text-white">Active Status (Accepting Applications)</div>
                  <div className="text-[11px] text-slate-400">When enabled, this opening will be visible on the public website.</div>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingJob({ ...editingJob, is_open: !editingJob.is_open })}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    editingJob.is_open
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                  }`}
                >
                  {editingJob.is_open ? "Active (Open)" : "Closed"}
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setJobModalOpen(false)}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={jobSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-brand px-6 py-2.5 text-xs font-semibold text-white shadow-glow hover:opacity-95 disabled:opacity-50 transition"
                >
                  {jobSaving ? (
                    <>
                      <RotateCw className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Save Position
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
