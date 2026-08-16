import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FileText, ImageIcon, Search, Check, Library } from "lucide-react";
import { toast } from "sonner";

const BUCKET = "public-uploads";
const SIGNED_TTL = 60 * 60 * 24 * 365 * 10;

type Item = {
  path: string;
  size: number;
  contentType: string;
  url: string;
  tags: string[];
};

function stripQuery(s: string) { return s.split("?")[0]; }
function isImage(type: string, name: string) {
  return type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(stripQuery(name));
}
function isPdf(type: string, name: string) {
  return type === "application/pdf" || /\.pdf$/i.test(stripQuery(name));
}

export type MediaPickerProps = {
  value?: string | null;
  onChange: (url: string) => void;
  label?: string;
  /** Restrict to a file kind. */
  accept?: "image" | "pdf" | "any";
  /** Preferred tag to pre-filter (e.g. "product-image"). */
  defaultTag?: string;
  placeholder?: string;
};

export function MediaPicker({
  value,
  onChange,
  label,
  accept = "any",
  defaultTag,
  placeholder = "https://…  or pick from library",
}: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string>(defaultTag ?? "all");

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET).list("", {
      limit: 500,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    const files = (data ?? []).filter((f) => f.name && f.id);
    const paths = files.map((f) => f.name);
    const [signed, tags] = await Promise.all([
      paths.length
        ? supabase.storage.from(BUCKET).createSignedUrls(paths, SIGNED_TTL)
        : Promise.resolve({ data: [], error: null } as { data: { path: string; signedUrl: string }[]; error: null }),
      paths.length
        ? supabase.from("media_tags").select("storage_path, tags").in("storage_path", paths)
        : Promise.resolve({ data: [], error: null } as { data: { storage_path: string; tags: string[] }[]; error: null }),
    ]);
    const urlMap = new Map((signed.data ?? []).map((s) => [s.path, s.signedUrl]));
    const tagMap = new Map(((tags.data ?? []) as { storage_path: string; tags: string[] }[])
      .map((r) => [r.storage_path, r.tags ?? []]));
    setItems(files.map((f) => ({
      path: f.name,
      size: (f.metadata?.size as number) ?? 0,
      contentType: (f.metadata?.mimetype as string) ?? "",
      url: urlMap.get(f.name) ?? "",
      tags: tagMap.get(f.name) ?? [],
    })));
    setLoading(false);
  }, []);

  useEffect(() => { if (open) load(); }, [open, load]);

  const allTags = useMemo(() => {
    const s = new Set<string>();
    items.forEach((i) => i.tags.forEach((t) => s.add(t)));
    return Array.from(s).sort();
  }, [items]);

  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (accept === "image" && !isImage(it.contentType, it.path)) return false;
      if (accept === "pdf" && !isPdf(it.contentType, it.path)) return false;
      if (tag !== "all" && !it.tags.includes(tag)) return false;
      if (q) {
        const ql = q.toLowerCase();
        if (!it.path.toLowerCase().includes(ql) && !it.tags.some((t) => t.toLowerCase().includes(ql))) return false;
      }
      return true;
    });
  }, [items, accept, tag, q]);

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="flex gap-2">
        <Input
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" onClick={() => setOpen(true)}>
          <Library className="h-4 w-4 mr-2" />Library
        </Button>
      </div>
      {value && isImage("", value) && (
        <div className="rounded border bg-muted/40 p-2 w-24 h-24 overflow-hidden">
          <img src={value} alt="preview" className="w-full h-full object-contain" />
        </div>
      )}
      {value && isPdf("", value) && (
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" /> PDF selected
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader><DialogTitle>Select from media library</DialogTitle></DialogHeader>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search filenames or tags" className="pl-8" />
            </div>
            <div className="flex gap-1 flex-wrap">
              <button
                type="button"
                onClick={() => setTag("all")}
                className={`text-xs px-2 py-1 rounded border ${tag === "all" ? "bg-primary text-primary-foreground border-primary" : "bg-background"}`}
              >All</button>
              {allTags.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTag(t)}
                  className={`text-xs px-2 py-1 rounded border ${tag === t ? "bg-primary text-primary-foreground border-primary" : "bg-background"}`}
                >{t}</button>
              ))}
            </div>
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
            ) : filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No files match. Upload files from the <span className="font-medium">Media</span> section.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filtered.map((it) => {
                  const selected = value === it.url;
                  const img = isImage(it.contentType, it.path);
                  return (
                    <button
                      key={it.path}
                      type="button"
                      onClick={() => { onChange(it.url); setOpen(false); }}
                      className={`group relative border rounded overflow-hidden text-left hover:border-primary transition ${selected ? "border-primary ring-2 ring-primary/40" : ""}`}
                    >
                      <div className="aspect-square bg-muted flex items-center justify-center">
                        {img ? (
                          <img src={it.url} alt={it.path} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <div className="flex flex-col items-center text-muted-foreground">
                            <FileText className="h-8 w-8" />
                            <span className="text-[10px] mt-1 uppercase">{it.path.split(".").pop()}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-xs">
                        <div className="truncate font-medium">{it.path}</div>
                        {it.tags.length > 0 && (
                          <div className="truncate text-muted-foreground">{it.tags.join(", ")}</div>
                        )}
                      </div>
                      {selected && (
                        <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <div className="absolute top-1 left-1 bg-background/80 rounded p-0.5">
                        {img ? <ImageIcon className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}