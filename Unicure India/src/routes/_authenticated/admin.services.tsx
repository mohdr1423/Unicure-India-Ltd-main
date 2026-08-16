import { createFileRoute } from "@tanstack/react-router";
import { ContentBlockShell, Field } from "@/components/admin/ContentBlockShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Capacity = { title: string; capacity: string };
type Unit = { name: string; location: string; year: string; text: string };

type ServicesContent = {
  hero: { eyebrow: string; title: string; subtitle: string };
  capacities: { eyebrow: string; title: string; items: Capacity[] };
  units: { eyebrow: string; title: string; items: Unit[] };
};

const DEFAULTS: ServicesContent = {
  hero: {
    eyebrow: "Manufacturing",
    title: "One of the largest OSD manufacturers in the country.",
    subtitle:
      "Three WHO-GMP approved plants engineered around cGMP (Schedule M) standards — from raw material handling to final packaging.",
  },
  capacities: {
    eyebrow: "Dosage Form Capacities",
    title: "Annual production capacity",
    items: [
      { title: "Tablets", capacity: "6,000 Millions" },
      { title: "Liquid Orals", capacity: "35.28 Millions" },
      { title: "Capsules", capacity: "1,200 Millions" },
      { title: "Sachets", capacity: "23 Millions" },
      { title: "Dry Syrups", capacity: "3.6 Millions" },
      { title: "Ointments & Creams", capacity: "500 Metric Tons" },
      { title: "Lotions", capacity: "3–5 Millions (avg 100ml)" },
      { title: "Dry Powders", capacity: "4,000 Metric Tons" },
    ],
  },
  units: {
    eyebrow: "Operational Units",
    title: "Three world-class facilities",
    items: [
      { name: "Unit-I", location: "Noida, Sector-3", year: "Established 1984", text: "WHO-GMP approved plant manufacturing Solid Oral Dosage forms (Tablets & Capsules), Dry Syrups, Oral Liquid formulations, preparations for external application, Beta-Lactam and Hormonal section." },
      { name: "Unit-II", location: "Roorkee, Uttarakhand", year: "Established 2006", text: "WHO-GMP approved plant manufacturing Solid Oral Dosage forms, Dry Powders, Oral Liquid formulations, preparations for external application, and Sex Hormone section." },
      { name: "Unit-III", location: "Greater Noida", year: "Established 2020", text: "WHO-GMP approved state-of-the-art OSD facility, designed as per international guidelines — PIC/S, EU and USFDA regulations." },
    ],
  },
};

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: ServicesEditor,
  head: () => ({ meta: [{ title: "Services page — Admin" }, { name: "robots", content: "noindex" }] }),
});

function ServicesEditor() {
  return (
    <ContentBlockShell<ServicesContent>
      keyName="page:services"
      title="Services / Manufacturing page"
      description="Edit the Manufacturing page hero, dosage form capacities, and operational units."
      helpText="Everything autosaves as a draft. Nothing changes on the live site until you click Save & Publish."
      previewPath="/manufacturing"
      defaultDraft={DEFAULTS}
      render={({ value, setValue }) => (
        <div className="space-y-8">
          <Group title="Page header">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow"><Input value={value.hero.eyebrow}
                onChange={(e) => setValue((p) => ({ ...p, hero: { ...p.hero, eyebrow: e.target.value } }))} /></Field>
              <Field label="Title"><Input value={value.hero.title}
                onChange={(e) => setValue((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))} /></Field>
              <Field label="Subtitle"><Textarea rows={2} value={value.hero.subtitle}
                onChange={(e) => setValue((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))} /></Field>
            </div>
          </Group>

          <Group title="Dosage form capacities" subtitle="Grid of production capacities.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow"><Input value={value.capacities.eyebrow}
                onChange={(e) => setValue((p) => ({ ...p, capacities: { ...p.capacities, eyebrow: e.target.value } }))} /></Field>
              <Field label="Section title"><Input value={value.capacities.title}
                onChange={(e) => setValue((p) => ({ ...p, capacities: { ...p.capacities, title: e.target.value } }))} /></Field>
            </div>
            <div className="space-y-3 mt-3">
              {value.capacities.items.map((c, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto] items-end rounded-md border p-3">
                  <Field label={i === 0 ? "Dosage form" : ""}><Input value={c.title}
                    onChange={(e) => setValue((p) => ({ ...p, capacities: { ...p.capacities, items: p.capacities.items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) } }))} /></Field>
                  <Field label={i === 0 ? "Capacity" : ""}><Input value={c.capacity}
                    onChange={(e) => setValue((p) => ({ ...p, capacities: { ...p.capacities, items: p.capacities.items.map((x, j) => (j === i ? { ...x, capacity: e.target.value } : x)) } }))} /></Field>
                  <Button variant="ghost" size="icon"
                    onClick={() => setValue((p) => ({ ...p, capacities: { ...p.capacities, items: p.capacities.items.filter((_, j) => j !== i) } }))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm"
                onClick={() => setValue((p) => ({ ...p, capacities: { ...p.capacities, items: [...p.capacities.items, { title: "", capacity: "" }] } }))}>
                <Plus className="h-4 w-4 mr-2" /> Add capacity
              </Button>
            </div>
          </Group>

          <Group title="Operational units" subtitle="Cards for each manufacturing facility.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow"><Input value={value.units.eyebrow}
                onChange={(e) => setValue((p) => ({ ...p, units: { ...p.units, eyebrow: e.target.value } }))} /></Field>
              <Field label="Section title"><Input value={value.units.title}
                onChange={(e) => setValue((p) => ({ ...p, units: { ...p.units, title: e.target.value } }))} /></Field>
            </div>
            <div className="space-y-3 mt-3">
              {value.units.items.map((u, i) => (
                <div key={i} className="rounded-md border p-3 space-y-2">
                  <div className="grid gap-2 sm:grid-cols-3">
                    <Field label="Name"><Input value={u.name}
                      onChange={(e) => setValue((p) => ({ ...p, units: { ...p.units, items: p.units.items.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) } }))} /></Field>
                    <Field label="Location"><Input value={u.location}
                      onChange={(e) => setValue((p) => ({ ...p, units: { ...p.units, items: p.units.items.map((x, j) => (j === i ? { ...x, location: e.target.value } : x)) } }))} /></Field>
                    <Field label="Year"><Input value={u.year}
                      onChange={(e) => setValue((p) => ({ ...p, units: { ...p.units, items: p.units.items.map((x, j) => (j === i ? { ...x, year: e.target.value } : x)) } }))} /></Field>
                  </div>
                  <Field label="Description"><Textarea rows={3} value={u.text}
                    onChange={(e) => setValue((p) => ({ ...p, units: { ...p.units, items: p.units.items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) } }))} /></Field>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm"
                      onClick={() => setValue((p) => ({ ...p, units: { ...p.units, items: p.units.items.filter((_, j) => j !== i) } }))}>
                      <Trash2 className="h-4 w-4 mr-1" /> Remove unit
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm"
                onClick={() => setValue((p) => ({ ...p, units: { ...p.units, items: [...p.units.items, { name: "", location: "", year: "", text: "" }] } }))}>
                <Plus className="h-4 w-4 mr-2" /> Add unit
              </Button>
            </div>
          </Group>
        </div>
      )}
    />
  );
}

function Group({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}