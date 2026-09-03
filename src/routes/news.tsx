import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Image, Video, CalendarDays } from "lucide-react";
import { ScrollReveal, StaggerGrid, StaggerItem } from "@/components/site/ScrollReveal";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "Media Gallery — Unicure India Ltd" },
      {
        name: "description",
        content:
          "Photos, videos and events from Unicure India Ltd's manufacturing units and corporate life.",
      },
      { property: "og:title", content: "Media — Unicure India Ltd" },
      { property: "og:description", content: "Photos, videos and events." },
      { property: "og:url", content: "https://unicureindialtd.vercel.app/news" },
    ],
    links: [{ rel: "canonical", href: "https://unicureindialtd.vercel.app/news" }],
  }),
  component: NewsPage,
});

function NewsPage() {
  return (
    <SiteLayout>
      <PageHero
        eyebrow="Media"
        title="Gallery — Photos, Videos & Events."
        subtitle="A behind-the-scenes look at Unicure India Ltd — our units, teams and events."
      />
      <section className="py-24">
        <div className="container-x">
          <StaggerGrid className="grid gap-6 md:grid-cols-3">
            {[
              {
                i: Image,
                t: "Photos",
                d: "Manufacturing floor, R&D labs and quality operations across three units.",
              },
              { i: Video, t: "Videos", d: "Facility walk-throughs and process highlights." },
              {
                i: CalendarDays,
                t: "Events",
                d: "Industry meets, exhibitions and internal celebrations.",
              },
            ].map((v) => (
              <StaggerItem key={v.t}>
                <div className="rounded-2xl border border-border bg-white p-8 shadow-card hover:shadow-elegant transition-all h-full">
                  <v.i className="h-8 w-8 text-primary" />
                  <div className="mt-4 text-lg font-semibold">{v.t}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.d}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
          <ScrollReveal delay={0.2}>
            <div className="mt-16 text-center">
              <p className="text-sm text-muted-foreground">
                Interested in a facility tour or media inquiry?{" "}
                <Link to="/contact" className="font-semibold text-primary hover:underline">
                  Get in touch with our team →
                </Link>
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteLayout>
  );
}
