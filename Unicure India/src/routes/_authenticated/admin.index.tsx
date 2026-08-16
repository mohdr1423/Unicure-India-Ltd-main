import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Palette, Menu, PanelBottom, Package, Newspaper, Briefcase, Download,
  UserPlus, ExternalLink, CheckCircle2, Circle, Sparkles, ArrowRight,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

const quickStart = [
  { to: "/admin/branding", title: "Set your brand", desc: "Colors, site name, phone & email.", icon: Palette },
  { to: "/admin/navigation", title: "Choose top menu links", desc: "What visitors see in the header.", icon: Menu },
  { to: "/admin/footer", title: "Fill in the footer", desc: "Link columns, socials, copyright.", icon: PanelBottom },
  { to: "/admin/products", title: "Add your first product", desc: "Show what you sell.", icon: Package },
  { to: "/admin/promote", title: "Invite another admin", desc: "Let a teammate help edit.", icon: UserPlus },
];

const sections = [
  { to: "/admin/products", title: "Products", desc: "Your product catalog.", icon: Package },
  { to: "/admin/news", title: "News", desc: "Articles and press releases.", icon: Newspaper },
  { to: "/admin/careers", title: "Careers", desc: "Open positions.", icon: Briefcase },
  { to: "/admin/downloads", title: "Downloads", desc: "Brochures and PDFs.", icon: Download },
];

function Dashboard() {
  return (
    <div className="space-y-8 max-w-5xl">
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 via-background to-background p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/15 text-primary p-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Welcome to your website admin</h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              This is where you change what people see on your website — the logo, colors, menu links,
              products, and more. Nothing goes live until you press <span className="font-medium text-foreground">Save & Publish</span>,
              and every change can be undone from <span className="font-medium text-foreground">History</span>.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <a href="/" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="h-4 w-4 mr-2" /> Open live site
                </Button>
              </a>
              <Link to="/admin/branding">
                <Button size="sm">
                  Start with branding <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Quick-start checklist</h2>
          <p className="text-sm text-muted-foreground">Do these five things and your site will feel yours.</p>
        </div>
        <ol className="rounded-lg border divide-y bg-background">
          {quickStart.map((s, i) => (
            <li key={s.to}>
              <Link
                to={s.to}
                className="flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition"
              >
                <div className="flex items-center gap-2 w-8 text-muted-foreground">
                  <Circle className="h-4 w-4" />
                  <span className="text-xs">{i + 1}</span>
                </div>
                <s.icon className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">Manage content</h2>
          <p className="text-sm text-muted-foreground">Update the pages visitors read.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((c) => (
            <Link key={c.to} to={c.to}>
              <Card className="hover:border-primary transition h-full">
                <CardHeader>
                  <c.icon className="h-6 w-6 text-primary" />
                  <CardTitle className="mt-2 text-base">{c.title}</CardTitle>
                  <CardDescription>{c.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-lg border bg-background p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
          <div className="text-sm">
            <div className="font-medium">Tips as you go</div>
            <ul className="list-disc pl-5 mt-1 space-y-1 text-muted-foreground">
              <li>Every editor autosaves as you type — you won't lose work.</li>
              <li>Click <span className="font-medium text-foreground">Live preview</span> in any editor to see how the site will look before publishing.</li>
              <li>Click <span className="font-medium text-foreground">History</span> to roll back to any earlier published version.</li>
              <li>Use the search box in the sidebar to find any section quickly.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}