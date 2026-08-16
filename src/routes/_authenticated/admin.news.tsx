import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MediaPicker } from "@/components/admin/MediaPicker";

export const Route = createFileRoute("/_authenticated/admin/news")({ component: NewsAdmin });

type News = { id: string; title: string; slug: string; excerpt: string | null; body: string | null; cover_url: string | null; published: boolean; published_at: string | null; };
const empty: Partial<News> = { title: "", slug: "", excerpt: "", body: "", cover_url: "", published: false };

function slugify(s: string) { return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

function NewsAdmin() {
  const [rows, setRows] = useState<News[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<News>>(empty);

  async function load() {
    const { data, error } = await supabase.from("news").select("*").order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setRows((data as News[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing.title) return toast.error("Title is required");
    const slug = editing.slug || slugify(editing.title!);
    const payload: any = { ...editing, slug };
    if (payload.published && !payload.published_at) payload.published_at = new Date().toISOString();
    delete payload.id;
    const res = editing.id
      ? await supabase.from("news").update(payload).eq("id", editing.id)
      : await supabase.from("news").insert(payload);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    setOpen(false); setEditing(empty); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this article?")) return;
    const { error } = await supabase.from("news").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">News</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(empty); }}>
          <DialogTrigger asChild><Button onClick={() => setEditing(empty)}><Plus className="h-4 w-4 mr-2" />New article</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>{editing.id ? "Edit" : "New"} article</DialogTitle></DialogHeader>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              <div><Label>Title</Label><Input value={editing.title ?? ""} onChange={(e)=>setEditing({...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value)})} /></div>
              <div><Label>Slug</Label><Input value={editing.slug ?? ""} onChange={(e)=>setEditing({...editing, slug: slugify(e.target.value)})} /></div>
              <MediaPicker
                label="Cover image"
                accept="image"
                defaultTag="news-cover"
                value={editing.cover_url ?? ""}
                onChange={(url)=>setEditing({...editing, cover_url: url})}
              />
              <div><Label>Excerpt</Label><Textarea rows={2} value={editing.excerpt ?? ""} onChange={(e)=>setEditing({...editing, excerpt: e.target.value})} /></div>
              <div><Label>Body (markdown or plain text)</Label><Textarea rows={10} value={editing.body ?? ""} onChange={(e)=>setEditing({...editing, body: e.target.value})} /></div>
              <div className="flex items-center gap-2"><Switch checked={!!editing.published} onCheckedChange={(v)=>setEditing({...editing, published: v})} /><Label>Published</Label></div>
            </div>
            <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>{rows.length} articles</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Title</TableHead><TableHead>Slug</TableHead><TableHead>Published</TableHead><TableHead className="w-32"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell className="text-muted-foreground">{r.slug}</TableCell>
                  <TableCell>{r.published ? "Yes" : "Draft"}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={()=>{setEditing(r); setOpen(true);}}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={()=>remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-6">No articles yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}