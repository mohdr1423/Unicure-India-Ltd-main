import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";
import productData from "@/data/products.json";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Product List — Unicure India Pharmaceutical Catalogue" },
      { name: "description", content: "Browse Unicure India's product list — tablets, capsules and formulations manufactured to IP, BP and USP pharmacopeial standards." },
      { property: "og:title", content: "Products — Unicure India" },
      { property: "og:description", content: "Browse our full pharmaceutical product list." },
      { property: "og:url", content: "/products" },
    ],
    links: [{ rel: "canonical", href: "/products" }],
  }),
  component: ProductsPage,
});

type Product = { name: string; cat: string };
const products = productData as Product[];
const categories = ["All", ...Array.from(new Set(products.map((p) => p.cat)))];

const PAGE_SIZE = 24;

function ProductsPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    setPage(1); // reset on filter change
    return products.filter(
      (p) =>
        (cat === "All" || p.cat === cat) &&
        p.name.toLowerCase().includes(q.toLowerCase()),
    );
  }, [q, cat]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <SiteLayout>
      <PageHero
        eyebrow="Products"
        title="Our Product List"
        subtitle="A curated portfolio of tablets, capsules and formulations manufactured to IP, BP and USP pharmacopeial standards."
      />
      <section className="py-16">
        <div className="container-x">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-full border border-border bg-white pl-11 pr-5 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <a
                href="/downloads"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-white shadow-glow"
              >
                <Download className="h-4 w-4" /> Download Brochure
              </a>
            </div>
          </ScrollReveal>

          <div className="mt-6 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  cat === c
                    ? "bg-primary text-white shadow-glow"
                    : "bg-secondary text-foreground hover:bg-secondary/70"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing <span className="font-semibold text-foreground">{paginated.length}</span> of{" "}
              {filtered.length} products
              {totalPages > 1 && (
                <span className="ml-1">(page {page} of {totalPages})</span>
              )}
            </span>
          </div>

          <StaggerGrid className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" key={`${cat}-${q}-${page}`}>
            {paginated.map((p) => (
              <StaggerItem key={p.name}>
                <div className="group rounded-2xl border border-border bg-white p-6 shadow-card hover:shadow-elegant hover:-translate-y-0.5 transition">
                  <div className="text-xs font-semibold uppercase tracking-widest text-primary">{p.cat}</div>
                  <h3 className="mt-3 text-base font-semibold leading-snug">{p.name}</h3>
                  <a
                    href="/contact"
                    className="mt-5 inline-block text-sm font-semibold text-primary group-hover:underline"
                  >
                    Request Quotation →
                  </a>
                </div>
              </StaggerItem>
            ))}
            {paginated.length === 0 && (
              <div className="col-span-full py-16 text-center text-muted-foreground">No products match your search.</div>
            )}
          </StaggerGrid>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border bg-white text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition shadow-card"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {getPageNumbers(page, totalPages).map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-2 text-muted-foreground">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`inline-flex items-center justify-center h-10 w-10 rounded-full text-sm font-semibold transition shadow-card ${
                      page === p
                        ? "bg-primary text-white shadow-glow"
                        : "border border-border bg-white text-foreground hover:bg-secondary"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center justify-center h-10 w-10 rounded-full border border-border bg-white text-foreground disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition shadow-card"
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

/** Generate pagination numbers: 1 2 ... 5 6 7 ... 20 */
function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  pages.push(1);
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}