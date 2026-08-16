import { createFileRoute } from "@tanstack/react-router";
import { ContentBlockShell } from "@/components/admin/ContentBlockShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

type NavItem = { label: string; to: string };
type NavCfg = { items: NavItem[]; cta_label: string; cta_to: string };

const DEFAULTS: NavCfg = {
  items: [
    { label: "Home", to: "/" },
    { label: "About", to: "/about" },
    { label: "Products", to: "/products" },
    { label: "Contact", to: "/contact" },
  ],
  cta_label: "Get a Quote",
  cta_to: "/contact",
};

export const Route = createFileRoute("/_authenticated/admin/navigation")({
  component: NavigationEditor,
  head: () => ({ meta: [{ title: "Navigation — Admin" }, { name: "robots", content: "noindex" }] }),
});

function NavigationEditor() {
  return (
    <ContentBlockShell<NavCfg>
      keyName="nav"
      title="Top menu"
      description="Links visitors see across the top of every page, plus the call-to-action button."
      helpText="Each row is one link. Use the arrows to change the order, the trash icon to remove one, or Add link to add a new page."
      defaultDraft={DEFAULTS}
      render={({ value, setValue }) => (
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Menu items</Label>
            {value.items.map((item, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Input
                  placeholder="Label"
                  className="max-w-[200px]"
                  value={item.label}
                  onChange={(e) =>
                    setValue((p) => ({ ...p, items: p.items.map((it, idx) => idx === i ? { ...it, label: e.target.value } : it) }))
                  }
                />
                <Input
                  placeholder="/path"
                  value={item.to}
                  onChange={(e) =>
                    setValue((p) => ({ ...p, items: p.items.map((it, idx) => idx === i ? { ...it, to: e.target.value } : it) }))
                  }
                />
                <Button type="button" size="icon" variant="outline" disabled={i === 0}
                  onClick={() => setValue((p) => {
                    const items = [...p.items];
                    [items[i - 1], items[i]] = [items[i], items[i - 1]];
                    return { ...p, items };
                  })}>
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button type="button" size="icon" variant="outline" disabled={i === value.items.length - 1}
                  onClick={() => setValue((p) => {
                    const items = [...p.items];
                    [items[i + 1], items[i]] = [items[i], items[i + 1]];
                    return { ...p, items };
                  })}>
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button type="button" size="icon" variant="outline"
                  onClick={() => setValue((p) => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }))}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm"
              onClick={() => setValue((p) => ({ ...p, items: [...p.items, { label: "New link", to: "/" }] }))}>
              <Plus className="h-4 w-4 mr-1" /> Add link
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 pt-4 border-t">
            <div className="space-y-1.5">
              <Label>CTA label</Label>
              <Input value={value.cta_label} onChange={(e) => setValue((p) => ({ ...p, cta_label: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>CTA link</Label>
              <Input value={value.cta_to} onChange={(e) => setValue((p) => ({ ...p, cta_to: e.target.value }))} />
            </div>
          </div>
        </div>
      )}
    />
  );
}