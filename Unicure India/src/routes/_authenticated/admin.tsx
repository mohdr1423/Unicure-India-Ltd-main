import { useState } from "react";
import { createFileRoute, Link, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  LayoutDashboard, Package, Newspaper, Briefcase, Download, Settings,
  LogOut, Images, UserCheck, ShieldCheck, UserPlus, Palette, Menu,
  PanelBottom, Search, HelpCircle, ExternalLink, Home, Info, Mail, Factory,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminLayout,
  head: () => ({ meta: [{ title: "Admin — Unicure India Ltd" }, { name: "robots", content: "noindex" }] }),
});

type NavItem = { to: string; label: string; icon: any; exact?: boolean; hint?: string };
type NavGroup = { label: string; items: NavItem[] };

const groups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true, hint: "Start here" },
      { to: "/admin/inquiries", label: "Inquiries & Leads", icon: Mail, hint: "All website leads & dispatch logs" },
    ],
  },
  {
    label: "Look & feel",
    items: [
      { to: "/admin/branding", label: "Branding & colors", icon: Palette, hint: "Logo name, colors, contact" },
      { to: "/admin/navigation", label: "Top menu", icon: Menu, hint: "Header links & button" },
      { to: "/admin/homepage", label: "Homepage", icon: Home, hint: "Hero, stats, capabilities, why us" },
      { to: "/admin/footer", label: "Footer", icon: PanelBottom, hint: "Bottom of every page" },
    ],
  },
  {
    label: "Pages",
    items: [
      { to: "/admin/about", label: "About page", icon: Info, hint: "Story, values, timeline" },
      { to: "/admin/services", label: "Services page", icon: Factory, hint: "Manufacturing capacities & units" },
      { to: "/admin/contact", label: "Contact page", icon: Mail, hint: "Addresses & inquiry section" },
    ],
  },
  {
    label: "Content",
    items: [
      { to: "/admin/products", label: "Products", icon: Package },
      { to: "/admin/news", label: "News & articles", icon: Newspaper },
      { to: "/admin/careers", label: "Job openings", icon: Briefcase },
      { to: "/admin/downloads", label: "Downloads", icon: Download },
      { to: "/admin/media", label: "Images & files", icon: Images },
    ],
  },
  {
    label: "People & access",
    items: [
      { to: "/admin/requests", label: "Access requests", icon: UserCheck },
      { to: "/admin/roles", label: "Roles & permissions", icon: ShieldCheck, hint: "Grant admin or editor access" },
      { to: "/admin/promote", label: "Add an admin", icon: UserPlus },
      { to: "/admin/audit", label: "Sign-in history", icon: ShieldCheck },
    ],
  },
  {
    label: "Settings",
    items: [
      { to: "/admin/settings", label: "Site settings", icon: Settings },
    ],
  },
];

function AdminLayout() {
  const { loading, isAdmin, userId } = useAdmin();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  async function signOut() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("unicure_dev_admin");
    }
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (loading) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">Loading…</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="max-w-lg text-center space-y-4">
          <h1 className="text-2xl font-semibold">You're signed in but not an admin</h1>
          <p className="text-sm text-muted-foreground">
            Your user ID is <code className="rounded bg-muted px-1.5 py-0.5">{userId}</code>. Ask an existing admin — or run this once in the Cloud SQL editor to promote yourself:
          </p>
          <pre className="text-left text-xs bg-muted p-3 rounded overflow-x-auto">
{`INSERT INTO public.user_roles (user_id, role) VALUES ('${userId}', 'admin');`}
          </pre>
          <Button variant="outline" onClick={signOut}><LogOut className="h-4 w-4 mr-2" />Sign out</Button>
        </div>
      </div>
    );
  }

  return <AdminShell pathname={pathname} onSignOut={signOut} />;
}

function AdminShell({ pathname, onSignOut }: { pathname: string; onSignOut: () => void }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = groups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (i) =>
          !q ||
          i.label.toLowerCase().includes(q) ||
          (i.hint ?? "").toLowerCase().includes(q),
      ),
    }))
    .filter((g) => g.items.length);

  return (
    <div className="min-h-screen flex bg-muted/20">
      <aside className="w-64 shrink-0 border-r bg-background flex flex-col">
        <div className="px-5 py-4 border-b">
          <div className="font-semibold">Unicure Admin</div>
          <div className="text-xs text-muted-foreground">Manage your website</div>
        </div>
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search sections…"
              className="pl-8 h-9"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {filtered.length === 0 && (
            <div className="text-xs text-muted-foreground px-2">No matches.</div>
          )}
          {filtered.map((g) => (
            <div key={g.label} className="space-y-1">
              <div className="px-3 pb-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                {g.label}
              </div>
              {g.items.map((n) => {
                const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    to={n.to}
                    className={`flex items-start gap-2 rounded-md px-3 py-2 text-sm transition ${
                      active ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                    }`}
                  >
                    <n.icon className="h-4 w-4 mt-0.5 shrink-0" />
                    <span className="flex-1 leading-tight">
                      {n.label}
                      {n.hint && (
                        <span
                          className={`block text-[11px] ${
                            active ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}
                        >
                          {n.hint}
                        </span>
                      )}
                    </span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground px-3"
          >
            <ExternalLink className="h-3 w-3" /> View live site
          </a>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={onSignOut}>
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  );
}