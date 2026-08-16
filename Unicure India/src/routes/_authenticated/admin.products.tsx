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

export const Route = createFileRoute("/_authenticated/admin/products")({ component: ProductsAdmin });

type Product = {
  id: string; name: string; category: string; composition: string | null;
  packaging: string | null; therapeutic_area: string | null; image_url: string | null;
  is_active: boolean; sort_order: number;
};

const empty: Partial<Product> = { name: "", category: "General", composition: "", packaging: "", therapeutic_area: "", image_url: "", is_active: true, sort_order: 0 };

function ProductsAdmin() {
  const [rows, setRows] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Product>>(empty);

  async function load() {
    const { data, error } = await supabase.from("products").select("*").order("sort_order").order("name");
    if (error) return toast.error(error.message);
    setRows((data as Product[]) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function save() {
    if (!editing.name) return toast.error("Name is required");
    const payload = { ...editing };
    delete (payload as any).id;
    const res = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload as any);
    if (res.error) return toast.error(res.error.message);
    toast.success("Saved");
    setOpen(false); setEditing(empty); load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) setEditing(empty); }}>
          <DialogTrigger asChild><Button onClick={() => setEditing(empty)}><Plus className="h-4 w-4 mr-2" />Add product</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing.id ? "Edit" : "New"} product</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Name</Label><Input value={editing.name ?? ""} onChange={(e)=>setEditing({...editing, name: e.target.value})} /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Category</Label><Input value={editing.category ?? ""} onChange={(e)=>setEditing({...editing, category: e.target.value})} /></div>
                <div><Label>Therapeutic area</Label><Input value={editing.therapeutic_area ?? ""} onChange={(e)=>setEditing({...editing, therapeutic_area: e.target.value})} /></div>
              </div>
              <div><Label>Composition</Label><Textarea rows={2} value={editing.composition ?? ""} onChange={(e)=>setEditing({...editing, composition: e.target.value})} /></div>
              <div><Label>Packaging</Label><Input value={editing.packaging ?? ""} onChange={(e)=>setEditing({...editing, packaging: e.target.value})} /></div>
              <MediaPicker
                label="Product image"
                accept="image"
                defaultTag="product-image"
                value={editing.image_url ?? ""}
                onChange={(url)=>setEditing({...editing, image_url: url})}
              />
              <div className="grid grid-cols-2 gap-3 items-end">
                <div><Label>Sort order</Label><Input type="number" value={editing.sort_order ?? 0} onChange={(e)=>setEditing({...editing, sort_order: Number(e.target.value)})} /></div>
                <div className="flex items-center gap-2"><Switch checked={!!editing.is_active} onCheckedChange={(v)=>setEditing({...editing, is_active: v})} /><Label>Active</Label></div>
              </div>
            </div>
            <DialogFooter><Button onClick={save}>Save</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Card>
        <CardHeader><CardTitle>{rows.length} products</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Name</TableHead><TableHead>Category</TableHead><TableHead>Active</TableHead><TableHead className="w-32"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>{r.category}</TableCell>
                  <TableCell>{r.is_active ? "Yes" : "No"}</TableCell>
                  <TableCell className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={()=>{setEditing(r); setOpen(true);}}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={()=>remove(r.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-6">No products yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}