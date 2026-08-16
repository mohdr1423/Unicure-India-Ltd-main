import { createFileRoute } from "@tanstack/react-router";
import { ContentBlockShell, Field } from "@/components/admin/ContentBlockShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { HeroImageUploader } from "@/components/admin/HeroImageUploader";

type StatItem = { value: string; suffix: string; label: string };
type FeatureItem = { title: string; desc: string };

type HomepageContent = {
  hero: {
    image_url?: string;
    badge: string;
    headline_line1: string;
    headline_highlight: string;
    subheadline: string;
    cta_primary_label: string;
    cta_primary_to: string;
    cta_secondary_label: string;
    cta_secondary_to: string;
  };
  stats: StatItem[];
  capabilities: {
    eyebrow: string;
    title: string;
    description: string;
    items: FeatureItem[];
  };
  why: {
    eyebrow: string;
    title: string;
    items: FeatureItem[];
  };
};

const DEFAULTS: HomepageContent = {
  hero: {
    image_url: "",
    badge: "WHO-GMP Certified Manufacturer",
    headline_line1: "40+ Years of",
    headline_highlight: "Pharmaceutical Excellence",
    subheadline:
      "Trusted manufacturing partner producing 500+ life-saving formulations across tablets, capsules, injectables and more — delivered to 20+ countries with uncompromising quality.",
    cta_primary_label: "Explore Manufacturing",
    cta_primary_to: "/manufacturing",
    cta_secondary_label: "Contact Sales",
    cta_secondary_to: "/contact",
  },
  stats: [
    { value: "40", suffix: "+", label: "Years Experience" },
    { value: "500", suffix: "+", label: "Products" },
    { value: "600", suffix: "+", label: "Employees" },
    { value: "20", suffix: "+", label: "Export Countries" },
  ],
  capabilities: {
    eyebrow: "Manufacturing Capabilities",
    title: "End-to-end dosage form expertise",
    description:
      "Purpose-built facilities and validated processes across every major pharmaceutical dosage form.",
    items: [
      { title: "Tablets", desc: "High-speed compression, film & sugar coating." },
      { title: "Capsules", desc: "Hard gelatin & vegetarian capsule filling." },
      { title: "Oral Liquids", desc: "Syrups, suspensions & dry syrups." },
      { title: "Injectables", desc: "Sterile ampoules and vials." },
      { title: "Ointments & Gels", desc: "Semi-solid dosage manufacturing." },
      { title: "Sachets & Powders", desc: "Precision granulation & sachet filling." },
    ],
  },
  why: {
    eyebrow: "Why Unicure",
    title: "Built on science. Backed by compliance.",
    items: [
      { title: "WHO-GMP Certified", desc: "Fully compliant with international standards." },
      { title: "R&D Excellence", desc: "In-house formulation and analytical labs." },
      { title: "Quality Assurance", desc: "Multi-stage QA/QC at every batch." },
      { title: "Global Network", desc: "Serving distributors across 20+ countries." },
      { title: "Timely Delivery", desc: "Reliable supply chain and logistics." },
      { title: "Regulatory Ready", desc: "Documentation for global registrations." },
    ],
  },
};

export const Route = createFileRoute("/_authenticated/admin/homepage")({
  component: HomepageEditor,
  head: () => ({ meta: [{ title: "Homepage — Admin" }, { name: "robots", content: "noindex" }] }),
});

function HomepageEditor() {
  return (
    <ContentBlockShell<HomepageContent>
      keyName="homepage"
      title="Homepage editor"
      description="Change the hero, stats, capabilities, and 'why us' sections on your home page."
      helpText="Every field autosaves as a draft. Nothing changes on the live site until you click Save & Publish."
      previewPath="/"
      defaultDraft={DEFAULTS}
      render={({ value, setValue }) => (
        <div className="space-y-8">
          {/* HERO */}
          <Section title="Hero section" subtitle="The first thing visitors see at the top of your homepage.">
            <Field label="Hero image" hint="Upload a photo — crop, resize and compress it in place.">
              <HeroImageUploader
                value={value.hero.image_url}
                onChange={(url) =>
                  setValue((p) => ({ ...p, hero: { ...p.hero, image_url: url } }))
                }
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Badge text" hint="Small pill above the headline.">
                <Input
                  value={value.hero.badge}
                  onChange={(e) =>
                    setValue((p) => ({ ...p, hero: { ...p.hero, badge: e.target.value } }))
                  }
                />
              </Field>
              <Field label="Headline (first line)" hint='e.g. "40+ Years of"'>
                <Input
                  value={value.hero.headline_line1}
                  onChange={(e) =>
                    setValue((p) => ({ ...p, hero: { ...p.hero, headline_line1: e.target.value } }))
                  }
                />
              </Field>
              <Field label="Headline highlight" hint="The colored second line.">
                <Input
                  value={value.hero.headline_highlight}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      hero: { ...p.hero, headline_highlight: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Subheadline" hint="Two-sentence description under the headline.">
                <Textarea
                  rows={3}
                  value={value.hero.subheadline}
                  onChange={(e) =>
                    setValue((p) => ({ ...p, hero: { ...p.hero, subheadline: e.target.value } }))
                  }
                />
              </Field>
              <Field label="Primary button label">
                <Input
                  value={value.hero.cta_primary_label}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      hero: { ...p.hero, cta_primary_label: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Primary button link" hint='e.g. "/manufacturing"'>
                <Input
                  value={value.hero.cta_primary_to}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      hero: { ...p.hero, cta_primary_to: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Secondary button label">
                <Input
                  value={value.hero.cta_secondary_label}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      hero: { ...p.hero, cta_secondary_label: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Secondary button link">
                <Input
                  value={value.hero.cta_secondary_to}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      hero: { ...p.hero, cta_secondary_to: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>
          </Section>

          {/* STATS */}
          <Section title="Stats strip" subtitle="Four numbers shown at the bottom of the hero.">
            <div className="space-y-3">
              {value.stats.map((s, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[1fr_100px_2fr_auto] items-end">
                  <Field label={i === 0 ? "Number" : ""} hint={i === 0 ? "Digits only." : undefined}>
                    <Input
                      value={s.value}
                      onChange={(e) =>
                        setValue((p) => ({
                          ...p,
                          stats: p.stats.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)),
                        }))
                      }
                    />
                  </Field>
                  <Field label={i === 0 ? "Suffix" : ""} hint={i === 0 ? 'e.g. "+"' : undefined}>
                    <Input
                      value={s.suffix}
                      onChange={(e) =>
                        setValue((p) => ({
                          ...p,
                          stats: p.stats.map((x, j) => (j === i ? { ...x, suffix: e.target.value } : x)),
                        }))
                      }
                    />
                  </Field>
                  <Field label={i === 0 ? "Label" : ""}>
                    <Input
                      value={s.label}
                      onChange={(e) =>
                        setValue((p) => ({
                          ...p,
                          stats: p.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)),
                        }))
                      }
                    />
                  </Field>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      setValue((p) => ({ ...p, stats: p.stats.filter((_, j) => j !== i) }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setValue((p) => ({
                    ...p,
                    stats: [...p.stats, { value: "0", suffix: "+", label: "New stat" }],
                  }))
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add stat
              </Button>
            </div>
          </Section>

          {/* CAPABILITIES */}
          <Section
            title="Capabilities section"
            subtitle="Grid of what you manufacture. Icons stay the same — text is editable."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow">
                <Input
                  value={value.capabilities.eyebrow}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      capabilities: { ...p.capabilities, eyebrow: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Section title">
                <Input
                  value={value.capabilities.title}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      capabilities: { ...p.capabilities, title: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field label="Description" hint="Shown under the section title.">
                <Textarea
                  rows={2}
                  value={value.capabilities.description}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      capabilities: { ...p.capabilities, description: e.target.value },
                    }))
                  }
                />
              </Field>
            </div>
            <ItemList
              items={value.capabilities.items}
              onChange={(items) =>
                setValue((p) => ({ ...p, capabilities: { ...p.capabilities, items } }))
              }
              addLabel="Add capability"
            />
          </Section>

          {/* WHY */}
          <Section title="Why us section" subtitle="Reasons visitors should trust and choose you.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow">
                <Input
                  value={value.why.eyebrow}
                  onChange={(e) =>
                    setValue((p) => ({ ...p, why: { ...p.why, eyebrow: e.target.value } }))
                  }
                />
              </Field>
              <Field label="Section title">
                <Input
                  value={value.why.title}
                  onChange={(e) =>
                    setValue((p) => ({ ...p, why: { ...p.why, title: e.target.value } }))
                  }
                />
              </Field>
            </div>
            <ItemList
              items={value.why.items}
              onChange={(items) => setValue((p) => ({ ...p, why: { ...p.why, items } }))}
              addLabel="Add reason"
            />
          </Section>
        </div>
      )}
    />
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
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

function ItemList({
  items,
  onChange,
  addLabel,
}: {
  items: FeatureItem[];
  onChange: (items: FeatureItem[]) => void;
  addLabel: string;
}) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto] items-end rounded-md border p-3">
          <Field label={i === 0 ? "Title" : ""}>
            <Input
              value={it.title}
              onChange={(e) =>
                onChange(items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))
              }
            />
          </Field>
          <Field label={i === 0 ? "Description" : ""}>
            <Input
              value={it.desc}
              onChange={(e) =>
                onChange(items.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)))
              }
            />
          </Field>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onChange(items.filter((_, j) => j !== i))}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, { title: "New", desc: "" }])}
      >
        <Plus className="h-4 w-4 mr-2" /> {addLabel}
      </Button>
    </div>
  );
}