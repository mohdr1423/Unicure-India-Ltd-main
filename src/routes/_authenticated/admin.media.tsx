import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Upload,
  Trash2,
  Copy,
  FileText,
  ImageIcon,
  RefreshCw,
  Search,
  Eye,
  ZoomIn,
  ZoomOut,
  ExternalLink,
  Download,
  Tag as TagIcon,
  X,
  Plus,
  Check,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaLibrary,
  head: () => ({
    meta: [{ title: "Media library — Admin" }, { name: "robots", content: "noindex" }],
  }),
});

const BUCKET = "public-uploads";
// 10-year signed URLs — bucket is private (workspace blocks public buckets),
// so we mint long-lived signed URLs to embed in products/news/downloads.
const SIGNED_TTL = 60 * 60 * 24 * 365 * 10;

type MediaItem = {
  name: string;
  path: string;
  size: number;
  updated_at: string | null;
  created_at: string | null;
  contentType: string;
  url: string;
  tags: string[];
};

const PRESET_TAGS = [
  "product-image",
  "news-cover",
  "download",
  "brochure",
  "certificate",
  "logo",
  "banner",
] as const;

type TypeFilter = "all" | "image" | "pdf";
type SortKey = "newest" | "oldest" | "name" | "size";

const TAG_STYLES: Record<string, string> = {
  "product-image": "bg-blue-100 text-blue-800 border-blue-200",
  "news-cover": "bg-purple-100 text-purple-800 border-purple-200",
  download: "bg-emerald-100 text-emerald-800 border-emerald-200",
  brochure: "bg-amber-100 text-amber-800 border-amber-200",
  certificate: "bg-rose-100 text-rose-800 border-rose-200",
  logo: "bg-slate-200 text-slate-800 border-slate-300",
  banner: "bg-cyan-100 text-cyan-800 border-cyan-200",
};
function tagClass(t: string) {
  return TAG_STYLES[t] ?? "bg-muted text-foreground border-border";
}

function isImage(type: string, name: string) {
  return type.startsWith("image/") || /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(name);
}
function fmtSize(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

function MediaLibrary() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [preview, setPreview] = useState<MediaItem | null>(null);
  const [activeTag, setActiveTag] = useState<string>("all"); // "all" | "untagged" | tag
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const fileRef = useRef<HTMLInputElement>(null);

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

    const [signedRes, tagsRes] = await Promise.all([
      paths.length
        ? supabase.storage.from(BUCKET).createSignedUrls(paths, SIGNED_TTL)
        : Promise.resolve({ data: [] as { path: string; signedUrl: string }[], error: null }),
      paths.length
        ? supabase.from("media_tags").select("storage_path, tags").in("storage_path", paths)
        : Promise.resolve({ data: [] as { storage_path: string; tags: string[] }[], error: null }),
    ]);

    const urlMap = new Map((signedRes.data ?? []).map((s) => [s.path, s.signedUrl]));
    const tagMap = new Map(
      ((tagsRes.data ?? []) as { storage_path: string; tags: string[] }[]).map((r) => [
        r.storage_path,
        r.tags ?? [],
      ]),
    );

    setItems(
      files.map((f) => ({
        name: f.name,
        path: f.name,
        size: (f.metadata?.size as number) ?? 0,
        updated_at: f.updated_at ?? null,
        created_at: (f as { created_at?: string | null }).created_at ?? null,
        contentType: (f.metadata?.mimetype as string) ?? "",
        url: urlMap.get(f.name) ?? "",
        tags: tagMap.get(f.name) ?? [],
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    let ok = 0;
    for (const file of Array.from(files)) {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });
      if (error) toast.error(`${file.name}: ${error.message}`);
      else ok++;
    }
    if (ok > 0) toast.success(`Uploaded ${ok} file${ok === 1 ? "" : "s"}`);
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    load();
  }

  async function handleDelete(path: string) {
    if (!confirm(`Delete "${path}"? This cannot be undone.`)) return;
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) return toast.error(error.message);
    // Best-effort clean up tags row.
    await supabase.from("media_tags").delete().eq("storage_path", path);
    toast.success("Deleted");
    setItems((prev) => prev.filter((i) => i.path !== path));
    setPreview((p) => (p?.path === path ? null : p));
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied — paste it into a product, news post, or download.");
    } catch {
      toast.error("Copy failed");
    }
  }

  async function saveTags(path: string, tags: string[]): Promise<void> {
    const clean = Array.from(new Set(tags.map((t) => t.trim().toLowerCase()).filter(Boolean)));
    const { error } = await supabase
      .from("media_tags")
      .upsert({ storage_path: path, tags: clean }, { onConflict: "storage_path" });
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((prev) => prev.map((i) => (i.path === path ? { ...i, tags: clean } : i)));
    setPreview((p) => (p?.path === path ? { ...p, tags: clean } : p));
  }

  const allTags = useMemo(() => {
    const set = new Set<string>(PRESET_TAGS);
    items.forEach((i) => i.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [items]);

  const tagCounts = useMemo(() => {
    const c = new Map<string, number>();
    items.forEach((i) => i.tags.forEach((t) => c.set(t, (c.get(t) ?? 0) + 1)));
    return c;
  }, [items]);
  const untaggedCount = useMemo(() => items.filter((i) => i.tags.length === 0).length, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = items.filter((i) => {
      if (q && !i.name.toLowerCase().includes(q) && !i.tags.some((t) => t.includes(q)))
        return false;
      const image = isImage(i.contentType, i.name);
      if (typeFilter === "image" && !image) return false;
      if (typeFilter === "pdf" && image) return false;
      if (activeTag === "untagged" && i.tags.length !== 0) return false;
      if (activeTag !== "all" && activeTag !== "untagged" && !i.tags.includes(activeTag))
        return false;
      return true;
    });
    const byName = (a: MediaItem, b: MediaItem) => a.name.localeCompare(b.name);
    const ts = (v: string | null) => (v ? new Date(v).getTime() : 0);
    if (sort === "newest") out = out.sort((a, b) => ts(b.created_at) - ts(a.created_at));
    else if (sort === "oldest") out = out.sort((a, b) => ts(a.created_at) - ts(b.created_at));
    else if (sort === "name") out = out.sort(byName);
    else if (sort === "size") out = out.sort((a, b) => b.size - a.size);
    return out;
  }, [items, query, typeFilter, activeTag, sort]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Media library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload images and PDFs, then copy the URL into product images, news covers, or download
            links.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="h-4 w-4 mr-2" /> {uploading ? "Uploading…" : "Upload"}
          </Button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </div>
      </div>

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleUpload(e.dataTransfer.files);
        }}
        className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-8 text-center text-sm text-muted-foreground"
      >
        Drag & drop images or PDFs here to upload, or click <strong>Upload</strong> above.
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by filename or tag…"
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TypeFilter)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="pdf">PDFs</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="name">Name (A–Z)</SelectItem>
              <SelectItem value="size">Largest first</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <FilterChip
            label={`All (${items.length})`}
            active={activeTag === "all"}
            onClick={() => setActiveTag("all")}
          />
          <FilterChip
            label={`Untagged (${untaggedCount})`}
            active={activeTag === "untagged"}
            onClick={() => setActiveTag("untagged")}
          />
          {allTags.map((t) => {
            const count = tagCounts.get(t) ?? 0;
            return (
              <FilterChip
                key={t}
                label={`${t} (${count})`}
                active={activeTag === t}
                onClick={() => setActiveTag(t)}
                tone={tagClass(t)}
              />
            );
          })}
        </div>
      </div>

      <div className="text-xs text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
        {items.length}
      </div>

      {loading ? (
        <div className="py-16 text-center text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          {items.length === 0
            ? "No files yet — upload your first image or PDF."
            : "No files match your search."}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filtered.map((f) => {
            const image = isImage(f.contentType, f.name);
            return (
              <div
                key={f.path}
                className="rounded-lg border bg-background overflow-hidden flex flex-col"
              >
                <button
                  type="button"
                  onClick={() => setPreview(f)}
                  className="aspect-square bg-muted grid place-items-center overflow-hidden group relative cursor-zoom-in"
                  aria-label={`Preview ${f.name}`}
                >
                  {image ? (
                    <img
                      src={f.url}
                      alt={f.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <FileText className="h-10 w-10" />
                      <span className="text-xs uppercase tracking-wide">PDF</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition grid place-items-center opacity-0 group-hover:opacity-100">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-foreground shadow">
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </span>
                  </div>
                </button>
                <div className="p-3 space-y-2 flex-1 flex flex-col">
                  <div className="text-xs font-medium truncate" title={f.name}>
                    {f.name}
                  </div>
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                    {image ? <ImageIcon className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                    <span>{fmtSize(f.size)}</span>
                  </div>
                  {f.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {f.tags.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className={`text-[10px] px-1.5 py-0.5 rounded border ${tagClass(t)}`}
                        >
                          {t}
                        </span>
                      ))}
                      {f.tags.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{f.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex gap-1 mt-auto">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2"
                      onClick={() => setPreview(f)}
                      aria-label="Preview"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 h-8 text-xs"
                      onClick={() => copyUrl(f.url)}
                    >
                      <Copy className="h-3 w-3 mr-1" /> Copy URL
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(f.path)}
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <PreviewDialog
        item={preview}
        onClose={() => setPreview(null)}
        onCopy={(url) => copyUrl(url)}
        onDelete={(path) => handleDelete(path)}
        onSaveTags={saveTags}
      />
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
  tone,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  tone?: string;
}) {
  const base = "text-xs px-2.5 py-1 rounded-full border transition";
  if (active)
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} bg-primary text-primary-foreground border-primary`}
      >
        {label}
      </button>
    );
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${base} ${tone ?? "bg-background text-muted-foreground hover:text-foreground border-border"}`}
    >
      {label}
    </button>
  );
}

function PreviewDialog({
  item,
  onClose,
  onCopy,
  onDelete,
  onSaveTags,
}: {
  item: MediaItem | null;
  onClose: () => void;
  onCopy: (url: string) => void;
  onDelete: (path: string) => void;
  onSaveTags: (path: string, tags: string[]) => Promise<void>;
}) {
  const [zoom, setZoom] = useState(1);
  const [draftTags, setDraftTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [savingTags, setSavingTags] = useState(false);
  useEffect(() => {
    setZoom(1);
    setDraftTags(item?.tags ?? []);
    setNewTag("");
  }, [item?.path, item?.tags]);

  if (!item) return null;
  const image = isImage(item.contentType, item.name);
  const dirty =
    JSON.stringify([...draftTags].sort()) !== JSON.stringify([...(item.tags ?? [])].sort());

  function toggle(t: string) {
    setDraftTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  }
  function addNewTag() {
    const t = newTag.trim().toLowerCase().replace(/\s+/g, "-");
    if (!t) return;
    if (!draftTags.includes(t)) setDraftTags((prev) => [...prev, t]);
    setNewTag("");
  }
  async function commit() {
    if (!item) return;
    setSavingTags(true);
    await onSaveTags(item.path, draftTags);
    setSavingTags(false);
    toast.success("Tags saved");
  }

  return (
    <Dialog open={!!item} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="p-0 max-w-6xl w-[95vw] h-[90vh] flex flex-col gap-0 overflow-hidden">
        <DialogTitle className="sr-only">Preview: {item.name}</DialogTitle>

        <div className="flex items-center gap-3 border-b px-4 py-3 bg-background shrink-0">
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium truncate">{item.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              {image ? <ImageIcon className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
              <span>{fmtSize(item.size)}</span>
              <span>•</span>
              <span>{item.contentType || (image ? "image" : "application/pdf")}</span>
            </div>
          </div>

          {image && (
            <div className="hidden sm:flex items-center gap-1 border rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2)))}
                aria-label="Zoom out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <div className="text-xs tabular-nums w-12 text-center">{Math.round(zoom * 100)}%</div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setZoom((z) => Math.min(5, +(z + 0.25).toFixed(2)))}
                aria-label="Zoom in"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Button variant="outline" size="sm" onClick={() => onCopy(item.url)}>
            <Copy className="h-3.5 w-3.5 mr-1.5" /> Copy URL
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={item.url} target="_blank" rel="noreferrer">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Open
            </a>
          </Button>
          {!image && (
            <Button variant="outline" size="sm" asChild>
              <a href={item.url} download={item.name}>
                <Download className="h-3.5 w-3.5 mr-1.5" /> Download
              </a>
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(item.path)}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" /> Delete
          </Button>
        </div>

        <div className="flex-1 min-h-0 flex overflow-hidden">
          <div className="flex-1 min-w-0 bg-[repeating-conic-gradient(#f3f4f6_0_25%,#ffffff_0_50%)] bg-[length:24px_24px]">
            {image ? (
              <div
                className="w-full h-full overflow-auto grid place-items-center p-6"
                onClick={onClose}
                role="button"
                aria-label="Close preview"
              >
                <img
                  src={item.url}
                  alt={item.name}
                  onClick={(e) => e.stopPropagation()}
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                  className="max-w-full max-h-full object-contain shadow-elegant transition-transform cursor-default"
                />
              </div>
            ) : (
              <iframe
                src={item.url}
                title={item.name}
                className="w-full h-full border-0 bg-white"
              />
            )}
          </div>
          <aside className="hidden md:flex flex-col w-72 shrink-0 border-l bg-background overflow-y-auto">
            <div className="p-4 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <TagIcon className="h-3.5 w-3.5" /> Tags
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Categorise this file so you can filter it quickly.
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {PRESET_TAGS.map((t) => {
                  const on = draftTags.includes(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggle(t)}
                      className={`text-xs px-2 py-1 rounded-full border transition inline-flex items-center gap-1 ${
                        on
                          ? tagClass(t)
                          : "bg-background text-muted-foreground hover:text-foreground border-border"
                      }`}
                    >
                      {on && <Check className="h-3 w-3" />}
                      {t}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Custom tags
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {draftTags
                    .filter((t) => !PRESET_TAGS.includes(t as (typeof PRESET_TAGS)[number]))
                    .map((t) => (
                      <span
                        key={t}
                        className={`text-xs px-2 py-1 rounded-full border inline-flex items-center gap-1 ${tagClass(t)}`}
                      >
                        {t}
                        <button type="button" onClick={() => toggle(t)} aria-label={`Remove ${t}`}>
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  {draftTags.filter((t) => !PRESET_TAGS.includes(t as (typeof PRESET_TAGS)[number]))
                    .length === 0 && (
                    <span className="text-[11px] text-muted-foreground">None yet.</span>
                  )}
                </div>
                <div className="flex gap-1">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addNewTag();
                      }
                    }}
                    placeholder="Add custom tag…"
                    className="h-8 text-xs"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 shrink-0"
                    onClick={addNewTag}
                    aria-label="Add tag"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={commit}
                  disabled={!dirty || savingTags}
                >
                  {savingTags ? "Saving…" : "Save tags"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setDraftTags(item.tags)}
                  disabled={!dirty || savingTags}
                >
                  Reset
                </Button>
              </div>
            </div>
          </aside>
        </div>

        <div className="border-t px-4 py-2 bg-muted/30 shrink-0">
          <div className="text-[11px] text-muted-foreground truncate font-mono" title={item.url}>
            {item.url}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
