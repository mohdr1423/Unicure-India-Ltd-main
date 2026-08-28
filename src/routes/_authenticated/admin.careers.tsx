import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import type { JobOpening } from "../api/careers";

export const Route = createFileRoute("/_authenticated/admin/careers")({ component: CareersAdmin });

type Job = JobOpening;
const empty: Partial<Job> = {
  title: "",
  department: "Manufacturing",
  location: "Noida, UP",
  employment_type: "Full-time",
  experience: "2-5 Years",
  qualifications: "B.Pharma / Graduate",
  description: "",
  apply_email: "careers@unicureindia.com",
  is_open: true,
};

function CareersAdmin() {
  const [rows, setRows] = useState<Job[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Job>>(empty);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      // 1. Try fetching from centralized careers API first
      const res = await fetch("/api/careers?all=true");
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.jobs)) {
          setRows(data.jobs);
          return;
        }
      }

      // 2. Fallback to Supabase
      const { data, error } = await supabase
        .from("job_openings")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setRows(data as Job[]);
      }
    } catch (err: any) {
      console.error("Failed to load jobs:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function save() {
    if (!editing.title?.trim()) {
      return toast.error("Job Title is required");
    }

    setSaving(true);
    try {
      const action = editing.id ? "update" : "create";
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, job: editing, id: editing.id }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        toast.success(editing.id ? "Job updated successfully" : "Job opening created");
        setOpen(false);
        setEditing(empty);
        load();
      } else {
        // Try fallback to Supabase
        const payload: any = { ...editing };
        delete payload.id;
        const supaRes = editing.id
          ? await supabase.from("job_openings").update(payload).eq("id", editing.id)
          : await supabase.from("job_openings").insert(payload);

        if (supaRes.error) {
          toast.error(data.message || supaRes.error.message);
        } else {
          toast.success("Saved");
          setOpen(false);
          setEditing(empty);
          load();
        }
      }
    } catch (err: any) {
      toast.error(`Error saving job: ${err?.message || "Check network"}`);
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to delete this job opening?")) return;
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        toast.success("Job deleted");
        load();
      } else {
        await supabase.from("job_openings").delete().eq("id", id);
        toast.success("Deleted");
        load();
      }
    } catch (err: any) {
      toast.error("Failed to delete job");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Careers Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage live job listings displayed on the public careers portal
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RotateCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Dialog
            open={open}
            onOpenChange={(o) => {
              setOpen(o);
              if (!o) setEditing(empty);
            }}
          >
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(empty)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Job Opening
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editing.id ? "Edit" : "New"} Job Opening</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                <div>
                  <Label>Job Title *</Label>
                  <Input
                    required
                    value={editing.title ?? ""}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    placeholder="e.g. Quality Control Analyst"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Department</Label>
                    <Input
                      value={editing.department ?? ""}
                      onChange={(e) => setEditing({ ...editing, department: e.target.value })}
                      placeholder="Manufacturing / QA / R&D"
                    />
                  </div>
                  <div>
                    <Label>Plant Location</Label>
                    <Input
                      value={editing.location ?? ""}
                      onChange={(e) => setEditing({ ...editing, location: e.target.value })}
                      placeholder="Greater Noida / Roorkee"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Employment Type</Label>
                    <Input
                      value={editing.employment_type ?? ""}
                      onChange={(e) => setEditing({ ...editing, employment_type: e.target.value })}
                      placeholder="Full-time"
                    />
                  </div>
                  <div>
                    <Label>Experience</Label>
                    <Input
                      value={editing.experience ?? ""}
                      onChange={(e) => setEditing({ ...editing, experience: e.target.value })}
                      placeholder="2-5 Years"
                    />
                  </div>
                </div>
                <div>
                  <Label>Required Qualifications</Label>
                  <Input
                    value={editing.qualifications ?? ""}
                    onChange={(e) => setEditing({ ...editing, qualifications: e.target.value })}
                    placeholder="B.Pharma / B.Sc Chemistry"
                  />
                </div>
                <div>
                  <Label>Description & Duties</Label>
                  <Textarea
                    rows={5}
                    value={editing.description ?? ""}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Responsibilities, daily analytical or machine operations..."
                  />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Switch
                    checked={!!editing.is_open}
                    onCheckedChange={(v) => setEditing({ ...editing, is_open: v })}
                  />
                  <Label>Accepting Applications (Active Status)</Label>
                </div>
              </div>
              <DialogFooter className="pt-3">
                <Button onClick={save} disabled={saving}>
                  {saving ? "Saving..." : "Save Job Opening"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{rows.length} Total Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{r.department}</TableCell>
                  <TableCell>{r.location}</TableCell>
                  <TableCell>{r.experience || "—"}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        r.is_open
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {r.is_open ? "Open" : "Closed"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => {
                          setEditing(r);
                          setOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(r.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {rows.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground py-6">
                    {loading
                      ? "Loading listings..."
                      : "No jobs found. Click 'Add Job Opening' to create one."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
