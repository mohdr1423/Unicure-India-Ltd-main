import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listAdminRequests,
  decideAdminRequest,
  type AdminRequestRow,
} from "@/lib/admin-requests-manage.functions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/requests")({
  component: RequestsPage,
  head: () => ({
    meta: [{ title: "Admin requests — Unicure India Ltd" }, { name: "robots", content: "noindex" }],
  }),
});

function RequestsPage() {
  const list = useServerFn(listAdminRequests);
  const decide = useServerFn(decideAdminRequest);
  const qc = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-requests"],
    queryFn: () => list(),
  });

  const mutate = useMutation({
    mutationFn: (vars: { requestId: string; decision: "approve" | "reject" }) =>
      decide({ data: vars }),
    onSuccess: (res) => {
      toast.success(
        res.status === "approved"
          ? "Request approved — user is now an admin."
          : "Request rejected.",
      );
      qc.invalidateQueries({ queryKey: ["admin-requests"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to update request"),
  });

  const rows = data ?? [];
  const pending = rows.filter((r) => r.status === "pending");
  const decided = rows.filter((r) => r.status !== "pending");

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold">Admin access requests</h1>
        <p className="text-sm text-muted-foreground">
          Approve or reject users who have requested admin access to /admin/*.
        </p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {error && (
        <p className="text-sm text-destructive">
          {error instanceof Error ? error.message : "Failed to load requests"}
        </p>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pending ({pending.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending requests.</p>
          ) : (
            pending.map((r) => (
              <RequestRow
                key={r.id}
                row={r}
                busy={mutate.isPending}
                onDecide={(decision) => mutate.mutate({ requestId: r.id, decision })}
              />
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">History ({decided.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {decided.length === 0 ? (
            <p className="text-sm text-muted-foreground">No past decisions.</p>
          ) : (
            decided.map((r) => <RequestRow key={r.id} row={r} />)
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function RequestRow({
  row,
  busy,
  onDecide,
}: {
  row: AdminRequestRow;
  busy?: boolean;
  onDecide?: (decision: "approve" | "reject") => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border p-3">
      <div className="min-w-0">
        <div className="font-medium truncate">{row.email}</div>
        <div className="text-xs text-muted-foreground">
          Requested {new Date(row.created_at).toLocaleString()}
          {row.decided_at && ` · decided ${new Date(row.decided_at).toLocaleString()}`}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <StatusBadge status={row.status} />
        {onDecide && (
          <>
            <Button size="sm" variant="outline" disabled={busy} onClick={() => onDecide("reject")}>
              <XCircle className="h-4 w-4 mr-1" /> Reject
            </Button>
            <Button size="sm" disabled={busy} onClick={() => onDecide("approve")}>
              <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: AdminRequestRow["status"] }) {
  if (status === "approved")
    return (
      <Badge className="bg-green-600 hover:bg-green-600">
        <CheckCircle2 className="h-3 w-3 mr-1" />
        Approved
      </Badge>
    );
  if (status === "rejected")
    return (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Rejected
      </Badge>
    );
  return (
    <Badge variant="secondary">
      <Clock className="h-3 w-3 mr-1" />
      Pending
    </Badge>
  );
}
