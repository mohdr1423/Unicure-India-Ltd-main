import { createFileRoute } from "@tanstack/react-router";
import { ContentBlockShell } from "@/components/admin/ContentBlockShell";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

type Link = { label: string; to: string };
type Column = { title: string; links: Link[] };
type Social = { label: string; url: string; icon: string };
type LegalLink = { label: string; url: string };
type FooterCfg = {
  tagline: string;
  since: string;
  columns: Column[];
  social: Social[];
  legal: LegalLink[];
  copyright: string;
};

const DEFAULTS: FooterCfg = {
  tagline: "",
  since: "Since 1984",
  columns: [],
  social: [],
  legal: [],
  copyright: "Unicure India. All rights reserved.",
};

export const Route = createFileRoute("/_authenticated/admin/footer")({
  component: FooterEditor,
  head: () => ({ meta: [{ title: "Footer — Admin" }, { name: "robots", content: "noindex" }] }),
});

function FooterEditor() {
  return (
    <ContentBlockShell<FooterCfg>
      keyName="footer"
      title="Footer"
      description="The area at the bottom of every page — link columns, social icons, and copyright."
      helpText="Add columns of related links (e.g. Company, Products), social profiles, and the small legal links along the very bottom row."
      defaultDraft={DEFAULTS}
      render={({ value, setValue }) => (
        <div className="space-y-8">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Tagline (below logo)</Label>
              <Textarea
                rows={2}
                value={value.tagline}
                onChange={(e) => setValue((p) => ({ ...p, tagline: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>"Since" line</Label>
              <Input
                value={value.since}
                onChange={(e) => setValue((p) => ({ ...p, since: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Copyright text</Label>
              <Input
                value={value.copyright}
                onChange={(e) => setValue((p) => ({ ...p, copyright: e.target.value }))}
              />
            </div>
          </div>

          <Section
            title="Link columns"
            onAdd={() =>
              setValue((p) => ({
                ...p,
                columns: [...p.columns, { title: "New column", links: [] }],
              }))
            }
          >
            {value.columns.map((col, ci) => (
              <div key={ci} className="rounded-md border p-3 space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Column title"
                    value={col.title}
                    onChange={(e) =>
                      setValue((p) => ({
                        ...p,
                        columns: p.columns.map((c, i) =>
                          i === ci ? { ...c, title: e.target.value } : c,
                        ),
                      }))
                    }
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() =>
                      setValue((p) => ({ ...p, columns: p.columns.filter((_, i) => i !== ci) }))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {col.links.map((l, li) => (
                  <div key={li} className="flex gap-2">
                    <Input
                      placeholder="Label"
                      className="max-w-[200px]"
                      value={l.label}
                      onChange={(e) =>
                        setValue((p) => ({
                          ...p,
                          columns: p.columns.map((c, i) =>
                            i === ci
                              ? {
                                  ...c,
                                  links: c.links.map((x, j) =>
                                    j === li ? { ...x, label: e.target.value } : x,
                                  ),
                                }
                              : c,
                          ),
                        }))
                      }
                    />
                    <Input
                      placeholder="/path"
                      value={l.to}
                      onChange={(e) =>
                        setValue((p) => ({
                          ...p,
                          columns: p.columns.map((c, i) =>
                            i === ci
                              ? {
                                  ...c,
                                  links: c.links.map((x, j) =>
                                    j === li ? { ...x, to: e.target.value } : x,
                                  ),
                                }
                              : c,
                          ),
                        }))
                      }
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        setValue((p) => ({
                          ...p,
                          columns: p.columns.map((c, i) =>
                            i === ci ? { ...c, links: c.links.filter((_, j) => j !== li) } : c,
                          ),
                        }))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setValue((p) => ({
                      ...p,
                      columns: p.columns.map((c, i) =>
                        i === ci
                          ? { ...c, links: [...c.links, { label: "New link", to: "/" }] }
                          : c,
                      ),
                    }))
                  }
                >
                  <Plus className="h-4 w-4 mr-1" /> Add link
                </Button>
              </div>
            ))}
          </Section>

          <Section
            title="Social links"
            onAdd={() =>
              setValue((p) => ({
                ...p,
                social: [...p.social, { label: "LinkedIn", url: "#", icon: "linkedin" }],
              }))
            }
          >
            {value.social.map((s, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Label"
                  className="max-w-[140px]"
                  value={s.label}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      social: p.social.map((x, idx) =>
                        idx === i ? { ...x, label: e.target.value } : x,
                      ),
                    }))
                  }
                />
                <Input
                  placeholder="Icon (linkedin, twitter, facebook, instagram, youtube)"
                  className="max-w-[240px]"
                  value={s.icon}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      social: p.social.map((x, idx) =>
                        idx === i ? { ...x, icon: e.target.value } : x,
                      ),
                    }))
                  }
                />
                <Input
                  placeholder="URL"
                  value={s.url}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      social: p.social.map((x, idx) =>
                        idx === i ? { ...x, url: e.target.value } : x,
                      ),
                    }))
                  }
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setValue((p) => ({ ...p, social: p.social.filter((_, idx) => idx !== i) }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </Section>

          <Section
            title="Legal links (bottom row)"
            onAdd={() =>
              setValue((p) => ({ ...p, legal: [...p.legal, { label: "New link", url: "#" }] }))
            }
          >
            {value.legal.map((l, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Label"
                  className="max-w-[200px]"
                  value={l.label}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      legal: p.legal.map((x, idx) =>
                        idx === i ? { ...x, label: e.target.value } : x,
                      ),
                    }))
                  }
                />
                <Input
                  placeholder="URL"
                  value={l.url}
                  onChange={(e) =>
                    setValue((p) => ({
                      ...p,
                      legal: p.legal.map((x, idx) =>
                        idx === i ? { ...x, url: e.target.value } : x,
                      ),
                    }))
                  }
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setValue((p) => ({ ...p, legal: p.legal.filter((_, idx) => idx !== i) }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </Section>
        </div>
      )}
    />
  );
}

function Section({
  title,
  children,
  onAdd,
}: {
  title: string;
  children: React.ReactNode;
  onAdd: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">{title}</Label>
        <Button type="button" variant="outline" size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
