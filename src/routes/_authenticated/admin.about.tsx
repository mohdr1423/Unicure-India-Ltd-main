import { createFileRoute } from "@tanstack/react-router";
import { ContentBlockShell, Field } from "@/components/admin/ContentBlockShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Value = { title: string; text: string };
type Milestone = { year: string; title: string; text: string };

type AboutContent = {
  hero: { eyebrow: string; title: string; subtitle: string };
  story: { title: string; paragraphs: string[] };
  values: Value[];
  timeline: { title: string; items: Milestone[] };
};

const DEFAULTS: AboutContent = {
  hero: {
    eyebrow: "About Us",
    title: "Four decades of scientific rigor and pharmaceutical care.",
    subtitle:
      "Unicure India is a fully integrated pharmaceutical manufacturer headquartered in India, serving healthcare partners across the world.",
  },
  story: {
    title: "Our Story",
    paragraphs: [
      "What began in 1984 as a single-block manufacturing unit has grown into one of India's most trusted contract manufacturing partners. Every milestone in our journey has been driven by a single principle — patient safety comes first.",
      "Today, Unicure operates world-class facilities engineered to meet international GMP standards, backed by a scientific team that includes formulation chemists, microbiologists, and regulatory experts.",
    ],
  },
  values: [
    { title: "Mission", text: "Deliver affordable, quality pharmaceutical products that improve lives worldwide." },
    { title: "Vision", text: "Be the most trusted manufacturing partner in emerging global markets." },
    { title: "Values", text: "Integrity, science, compliance, and patient-first thinking." },
  ],
  timeline: {
    title: "Our Journey",
    items: [
      { year: "1984", title: "Founded", text: "Unicure India begins operations with a vision to democratize quality medicine." },
      { year: "1996", title: "WHO-GMP", text: "Achieved WHO-GMP certification for tablets and capsules." },
      { year: "2005", title: "Exports Begin", text: "First international shipments to Africa and Southeast Asia." },
      { year: "2014", title: "R&D Expansion", text: "New research center opens with advanced analytical capabilities." },
      { year: "2020", title: "Injectables", text: "Sterile injectable line commissioned to serve critical care markets." },
      { year: "2024", title: "40 Years", text: "Serving 20+ countries with 500+ formulations and 600+ employees." },
    ],
  },
};

export const Route = createFileRoute("/_authenticated/admin/about")({
  component: AboutEditor,
  head: () => ({ meta: [{ title: "About page — Admin" }, { name: "robots", content: "noindex" }] }),
});

function AboutEditor() {
  return (
    <ContentBlockShell<AboutContent>
      keyName="page:about"
      title="About page"
      description="Edit the About page hero, story, mission/vision/values, and timeline."
      helpText="Everything autosaves as a draft. Nothing changes on the live site until you click Save & Publish."
      previewPath="/about"
      defaultDraft={DEFAULTS}
      render={({ value, setValue }) => (
        <div className="space-y-8">
          <Group title="Page header" subtitle="Top banner of the About page.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow">
                <Input value={value.hero.eyebrow}
                  onChange={(e) => setValue((p) => ({ ...p, hero: { ...p.hero, eyebrow: e.target.value } }))} />
              </Field>
              <Field label="Title">
                <Input value={value.hero.title}
                  onChange={(e) => setValue((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))} />
              </Field>
              <Field label="Subtitle" hint="Short paragraph under the title.">
                <Textarea rows={3} value={value.hero.subtitle}
                  onChange={(e) => setValue((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))} />
              </Field>
            </div>
          </Group>

          <Group title="Our story" subtitle="Long-form text next to the lab photo.">
            <Field label="Section title">
              <Input value={value.story.title}
                onChange={(e) => setValue((p) => ({ ...p, story: { ...p.story, title: e.target.value } }))} />
            </Field>
            <div className="space-y-3 mt-3">
              {value.story.paragraphs.map((para, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <Textarea
                    rows={3}
                    value={para}
                    onChange={(e) =>
                      setValue((p) => ({
                        ...p,
                        story: {
                          ...p.story,
                          paragraphs: p.story.paragraphs.map((x, j) => (j === i ? e.target.value : x)),
                        },
                      }))
                    }
                  />
                  <Button variant="ghost" size="icon"
                    onClick={() => setValue((p) => ({
                      ...p,
                      story: { ...p.story, paragraphs: p.story.paragraphs.filter((_, j) => j !== i) },
                    }))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm"
                onClick={() => setValue((p) => ({
                  ...p, story: { ...p.story, paragraphs: [...p.story.paragraphs, ""] },
                }))}>
                <Plus className="h-4 w-4 mr-2" /> Add paragraph
              </Button>
            </div>
          </Group>

          <Group title="Mission, vision & values" subtitle="Three cards shown below the story.">
            <div className="space-y-3">
              {value.values.map((v, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto] items-end rounded-md border p-3">
                  <Field label={i === 0 ? "Title" : ""}>
                    <Input value={v.title}
                      onChange={(e) => setValue((p) => ({
                        ...p, values: p.values.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)),
                      }))} />
                  </Field>
                  <Field label={i === 0 ? "Text" : ""}>
                    <Input value={v.text}
                      onChange={(e) => setValue((p) => ({
                        ...p, values: p.values.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)),
                      }))} />
                  </Field>
                  <Button variant="ghost" size="icon"
                    onClick={() => setValue((p) => ({ ...p, values: p.values.filter((_, j) => j !== i) }))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm"
                onClick={() => setValue((p) => ({
                  ...p, values: [...p.values, { title: "New value", text: "" }],
                }))}>
                <Plus className="h-4 w-4 mr-2" /> Add value
              </Button>
            </div>
          </Group>

          <Group title="Journey timeline" subtitle="Key milestones over the years.">
            <Field label="Section title">
              <Input value={value.timeline.title}
                onChange={(e) => setValue((p) => ({ ...p, timeline: { ...p.timeline, title: e.target.value } }))} />
            </Field>
            <div className="space-y-3 mt-3">
              {value.timeline.items.map((m, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[120px_1fr_2fr_auto] items-end rounded-md border p-3">
                  <Field label={i === 0 ? "Year" : ""}>
                    <Input value={m.year}
                      onChange={(e) => setValue((p) => ({
                        ...p, timeline: { ...p.timeline, items: p.timeline.items.map((x, j) => (j === i ? { ...x, year: e.target.value } : x)) },
                      }))} />
                  </Field>
                  <Field label={i === 0 ? "Title" : ""}>
                    <Input value={m.title}
                      onChange={(e) => setValue((p) => ({
                        ...p, timeline: { ...p.timeline, items: p.timeline.items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) },
                      }))} />
                  </Field>
                  <Field label={i === 0 ? "Description" : ""}>
                    <Input value={m.text}
                      onChange={(e) => setValue((p) => ({
                        ...p, timeline: { ...p.timeline, items: p.timeline.items.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) },
                      }))} />
                  </Field>
                  <Button variant="ghost" size="icon"
                    onClick={() => setValue((p) => ({
                      ...p, timeline: { ...p.timeline, items: p.timeline.items.filter((_, j) => j !== i) },
                    }))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm"
                onClick={() => setValue((p) => ({
                  ...p, timeline: { ...p.timeline, items: [...p.timeline.items, { year: "", title: "", text: "" }] },
                }))}>
                <Plus className="h-4 w-4 mr-2" /> Add milestone
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