import { Link, useMatches } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  "/": "Home",
  "/about": "About Us",
  "/leadership": "Leadership Team",
  "/manufacturing": "Manufacturing Facilities",
  "/dosage-forms": "Dosage Forms & Capacities",
  "/contract-manufacturing": "Co-Manufacturing",
  "/products": "Products & Therapeutics",
  "/quality": "Quality & R&D",
  "/exports": "International Operations",
  "/contact": "Contact Us",
  "/careers": "Careers & Opportunities",
  "/pharmacovigilance": "Pharmacovigilance",
  "/certifications": "Certifications & Compliance",
  "/downloads": "Downloads & Brochures",
  "/clients": "Clients & Partners",
  "/news": "News & Updates",
  "/md-message": "MD's Message",
};

interface BreadcrumbsProps {
  theme?: "dark" | "light";
  className?: string;
}

export function Breadcrumbs({ theme = "light", className }: BreadcrumbsProps) {
  const matches = useMatches();
  const current = matches[matches.length - 1];
  const path = current?.pathname ?? "/";

  // Don't render on the root homepage
  if (path === "/") return null;

  const label = LABELS[path] ?? path.replace(/^\//, "").replace(/-/g, " ");

  const isDark = theme === "dark";

  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs font-medium select-none", className)}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            to="/"
            className={cn(
              "inline-flex items-center gap-1 transition-colors",
              isDark
                ? "text-white/70 hover:text-white"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </Link>
        </li>
        <li>
          <ChevronRight
            className={cn("h-3 w-3", isDark ? "text-white/40" : "text-muted-foreground/60")}
          />
        </li>
        <li>
          <span
            className={cn("font-semibold capitalize", isDark ? "text-white" : "text-foreground")}
          >
            {label}
          </span>
        </li>
      </ol>
    </nav>
  );
}
