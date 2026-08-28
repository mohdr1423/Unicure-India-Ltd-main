import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { listAdminAuthAudit, type AdminAuthAuditRow } from "@/lib/auth-audit.functions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  component: AuditPage,
  head: () => ({
    meta: [{ title: "Auth audit log — Unicure Admin" }, { name: "robots", content: "noindex" }],
  }),
});

type EventFilter =
  | "all"
  | "login_success"
  | "login_failed"
  | "non_admin_blocked"
  | "password_reset_requested"
  | "password_reset_role_check_failed";

const EVENT_LABEL: Record<Exclude<EventFilter, "all">, string> = {
  login_success: "Sign-in success",
  login_failed: "Sign-in failed",
  non_admin_blocked: "Non-admin blocked",
  password_reset_requested: "Password reset requested",
  password_reset_role_check_failed: "Reset role-check failed",
};

function eventBadge(row: AdminAuthAuditRow) {
  const label = EVENT_LABEL[row.event];
  if (row.event === "login_success")
    return <Badge className="bg-green-600 hover:bg-green-600">{label}</Badge>;
  if (row.event === "password_reset_requested" && row.success)
    return <Badge variant="secondary">{label}</Badge>;
  return <Badge variant="destructive">{label}</Badge>;
}

function AuditPage() {
  const listFn = useServerFn(listAdminAuthAudit);
  const [event, setEvent] = useState<EventFilter>("all");
  const [search, setSearch] = useState("");
  const [applied, setApplied] = useState({ event, search });

  const query = useQuery({
    queryKey: ["admin-auth-audit", applied],
    queryFn: () => listFn({ data: { limit: 200, event: applied.event, search: applied.search } }),
  });

  const rows = query.data ?? [];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center gap-3">
        <ShieldCheck className="h-6 w-6 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold">Authentication audit log</h1>
          <p className="text-sm text-muted-foreground">
            Recent admin sign-in attempts, non-admin blocks, and password-reset events.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Latest 200 events matching the current filters.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setApplied({ event, search: search.trim() });
            }}
            className="flex flex-wrap items-end gap-3"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-muted-foreground mb-1 block">Search email</label>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="email contains…"
              />
            </div>
            <div className="w-56">
              <label className="text-xs text-muted-foreground mb-1 block">Event type</label>
              <Select value={event} onValueChange={(v) => setEvent(v as EventFilter)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All events</SelectItem>
                  {(Object.keys(EVENT_LABEL) as Array<keyof typeof EVENT_LABEL>).map((k) => (
                    <SelectItem key={k} value={k}>
                      {EVENT_LABEL[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit">Apply</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => query.refetch()}
              disabled={query.isFetching}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${query.isFetching ? "animate-spin" : ""}`} />{" "}
              Refresh
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {query.isLoading ? (
            <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
          ) : query.isError ? (
            <div className="p-8 text-center text-sm text-destructive">
              Failed to load audit log.
            </div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">No events found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Time</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>User ID</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>User agent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>{eventBadge(r)}</TableCell>
                      <TableCell className="max-w-[220px] truncate" title={r.email ?? ""}>
                        {r.email ?? "—"}
                      </TableCell>
                      <TableCell
                        className="font-mono text-[11px] text-muted-foreground max-w-[160px] truncate"
                        title={r.user_id ?? ""}
                      >
                        {r.user_id ?? "—"}
                      </TableCell>
                      <TableCell className="text-xs max-w-[260px] truncate" title={r.reason ?? ""}>
                        {r.reason ?? "—"}
                      </TableCell>
                      <TableCell
                        className="text-[11px] text-muted-foreground max-w-[220px] truncate"
                        title={r.user_agent ?? ""}
                      >
                        {r.user_agent ?? "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
