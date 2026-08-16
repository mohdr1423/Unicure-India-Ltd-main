import { createFileRoute } from "@tanstack/react-router";
import { ContentBlockShell, Field } from "@/components/admin/ContentBlockShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Unit = { name: string; heading: string; address: string; email: string; phone: string };
type Channel = { icon: "phone" | "email"; title: string; value: string };

type ContactContent = {
  hero: { eyebrow: string; title: string; subtitle: string };
  units: Unit[];
  form_title: string;
  form_intro: string;
  channels: Channel[];
};

const DEFAULTS: ContactContent = {
  hero: {
    eyebrow: "Contact",
    title: "Get in touch with Unicure India.",
    subtitle: "Three manufacturing units across North India. Reach our sales, export or contract-manufacturing teams.",
  },
  units: [
    { name: "Unit-I", heading: "Manufacturing Unit", address: "C-21, 22 & 23 Sector-3, Noida-201301, Distt. Gautam Buddha Nagar (U.P.)", email: "humanrealityofficial@gmail.com", phone: "8882674843" },
    { name: "Unit-II", heading: "Manufacturing Unit", address: "Plot No. 46(B)/49B, Village Raipur, Bhagwanpur, Roorkee, Distt. Haridwar-247662, Uttarakhand", email: "humanrealityofficial@gmail.com", phone: "8882674843" },
    { name: "Unit-III", heading: "Manufacturing Unit", address: "Plot No. 112 & 113, Ecotech-12, Behind Greater Noida (West), Bishrakh, Gautam Buddha Nagar, Uttar Pradesh-201310", email: "humanrealityofficial@gmail.com", phone: "8882674843" },
  ],
  form_title: "Talk to our team",
  form_intro:
    "Whether you're an institutional buyer, an international distributor, or exploring a contract-manufacturing partnership — we'd love to hear from you.",
  channels: [
    { icon: "phone", title: "Sales & Quotes", value: "+91 8882674843" },
    { icon: "email", title: "General & Inquiries", value: "humanrealityofficial@gmail.com" },
    { icon: "email", title: "Direct Inquiries", value: "humanrealityofficial@gmail.com" },
  ],
};

export const Route = createFileRoute("/_authenticated/admin/contact")({
  component: ContactEditor,
  head: () => ({ meta: [{ title: "Contact page — Admin" }, { name: "robots", content: "noindex" }] }),
});

function ContactEditor() {
  return (
    <ContentBlockShell<ContactContent>
      keyName="page:contact"
      title="Contact page"
      description="Edit the Contact page hero, unit addresses, and inquiry channels."
      helpText="Everything autosaves as a draft. Nothing changes on the live site until you click Save & Publish."
      previewPath="/contact"
      defaultDraft={DEFAULTS}
      render={({ value, setValue }) => (
        <div className="space-y-8">
          <Group title="Page header">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Eyebrow">
                <Input value={value.hero.eyebrow}
                  onChange={(e) => setValue((p) => ({ ...p, hero: { ...p.hero, eyebrow: e.target.value } }))} />
              </Field>
              <Field label="Title">
                <Input value={value.hero.title}
                  onChange={(e) => setValue((p) => ({ ...p, hero: { ...p.hero, title: e.target.value } }))} />
              </Field>
              <Field label="Subtitle">
                <Textarea rows={2} value={value.hero.subtitle}
                  onChange={(e) => setValue((p) => ({ ...p, hero: { ...p.hero, subtitle: e.target.value } }))} />
              </Field>
            </div>
          </Group>

          <Group title="Manufacturing units" subtitle="Cards shown mid-page with each unit's address.">
            <div className="space-y-3">
              {value.units.map((u, i) => (
                <div key={i} className="rounded-md border p-3 space-y-2">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Field label="Label"><Input value={u.name}
                      onChange={(e) => setValue((p) => ({ ...p, units: p.units.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)) }))} /></Field>
                    <Field label="Heading"><Input value={u.heading}
                      onChange={(e) => setValue((p) => ({ ...p, units: p.units.map((x, j) => (j === i ? { ...x, heading: e.target.value } : x)) }))} /></Field>
                    <Field label="Phone"><Input value={u.phone}
                      onChange={(e) => setValue((p) => ({ ...p, units: p.units.map((x, j) => (j === i ? { ...x, phone: e.target.value } : x)) }))} /></Field>
                    <Field label="Email"><Input type="email" value={u.email}
                      onChange={(e) => setValue((p) => ({ ...p, units: p.units.map((x, j) => (j === i ? { ...x, email: e.target.value } : x)) }))} /></Field>
                  </div>
                  <Field label="Address"><Textarea rows={2} value={u.address}
                    onChange={(e) => setValue((p) => ({ ...p, units: p.units.map((x, j) => (j === i ? { ...x, address: e.target.value } : x)) }))} /></Field>
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm"
                      onClick={() => setValue((p) => ({ ...p, units: p.units.filter((_, j) => j !== i) }))}>
                      <Trash2 className="h-4 w-4 mr-1" /> Remove unit
                    </Button>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm"
                onClick={() => setValue((p) => ({
                  ...p, units: [...p.units, { name: "Unit", heading: "Manufacturing Unit", address: "", email: "", phone: "" }],
                }))}>
                <Plus className="h-4 w-4 mr-2" /> Add unit
              </Button>
            </div>
          </Group>

          <Group title="Inquiry section" subtitle="Text and contact channels next to the form.">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Section title">
                <Input value={value.form_title}
                  onChange={(e) => setValue((p) => ({ ...p, form_title: e.target.value }))} />
              </Field>
              <Field label="Intro paragraph">
                <Textarea rows={3} value={value.form_intro}
                  onChange={(e) => setValue((p) => ({ ...p, form_intro: e.target.value }))} />
              </Field>
            </div>
            <div className="space-y-3 mt-3">
              {value.channels.map((c, i) => (
                <div key={i} className="grid gap-2 sm:grid-cols-[120px_1fr_2fr_auto] items-end rounded-md border p-3">
                  <Field label={i === 0 ? "Icon" : ""} hint={i === 0 ? "phone or email" : undefined}>
                    <select
                      className="h-9 w-full rounded-md border bg-background px-2 text-sm"
                      value={c.icon}
                      onChange={(e) => setValue((p) => ({
                        ...p, channels: p.channels.map((x, j) => (j === i ? { ...x, icon: e.target.value as Channel["icon"] } : x)),
                      }))}>
                      <option value="phone">phone</option>
                      <option value="email">email</option>
                    </select>
                  </Field>
                  <Field label={i === 0 ? "Label" : ""}><Input value={c.title}
                    onChange={(e) => setValue((p) => ({ ...p, channels: p.channels.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) }))} /></Field>
                  <Field label={i === 0 ? "Value" : ""}><Input value={c.value}
                    onChange={(e) => setValue((p) => ({ ...p, channels: p.channels.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) }))} /></Field>
                  <Button variant="ghost" size="icon"
                    onClick={() => setValue((p) => ({ ...p, channels: p.channels.filter((_, j) => j !== i) }))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm"
                onClick={() => setValue((p) => ({
                  ...p, channels: [...p.channels, { icon: "email", title: "New", value: "" }],
                }))}>
                <Plus className="h-4 w-4 mr-2" /> Add channel
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