import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  listRoleAssignments,
  grantRole,
  revokeRole,
  type ManageableRole,
  type RoleRow,
} from "@/lib/admin-roles.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, PencilLine, Trash2, UserCog } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/roles")({
  component: RolesPage,
  head: () => ({
    meta: [{ title: "Roles & permissions — Unicure India Ltd" }, { name: "robots", content: "noindex" }],
  }),
});

const ROLE_META: Record<ManageableRole, { label: string; description: string; icon: any }> = {
  admin: {
    label: "Admin",
    description: "Full access — manage roles, users, settings, and every page.",
    icon: ShieldCheck,
  },
  editor: {
    label: "Editor",
    description: "Can edit pages, products, news, media and downloads. No admin controls.",
    icon: PencilLine,
  },
};

function RolesPage() {
  const qc = useQueryClient();
  const list = useServerFn(listRoleAssignments);
  const grant = useServerFn(grantRole);
  const revoke = useServerFn(revokeRole);

  const rolesQuery = useQuery({
    queryKey: ["admin", "roles"],
    queryFn: () => list(),
  });

  const [identifier, setIdentifier] = useState("");
  const [role, setRole] = useState<ManageableRole>("editor");

  const grantMut = useMutation({
    mutationFn: (input: { identifier: string; role: ManageableRole }) => grant({ data: input }),
    onSuccess: (res) => {
      toast.success(`Granted ${ROLE_META[res.role].label} to ${res.email ?? res.userId}`);
      setIdentifier("");
      qc.invalidateQueries({ queryKey: ["admin", "roles"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to grant role"),
  });

  const revokeMut = useMutation({
    mutationFn: (input: { userId: string; role: ManageableRole }) => revoke({ data: input }),
    onSuccess: (_res, vars) => {
      toast.success(`Removed ${ROLE_META[vars.role].label} role`);
      qc.invalidateQueries({ queryKey: ["admin", "roles"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to revoke role"),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = identifier.trim();
    if (!value) return;
    grantMut.mutate({ identifier: value, role });
  }

  const rows = rolesQuery.data ?? [];

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Roles & permissions</h1>
        <p className="text-sm text-muted-foreground">
          Grant editor access to teammates so they can update site content without full admin controls.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(Object.keys(ROLE_META) as ManageableRole[]).map((r) => {
          const Icon = ROLE_META[r].icon;
          return (
            <Card key={r}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Icon className="h-4 w-4" /> {ROLE_META[r].label}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                {ROLE_META[r].description}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserCog className="h-4 w-4" /> Grant a role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-[1fr_180px_auto] sm:items-end">
            <div className="space-y-2">
              <Label htmlFor="identifier">User email or ID</Label>
              <Input
                id="identifier"
                placeholder="teammate@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                maxLength={320}
                autoComplete="off"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as ManageableRole)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={grantMut.isPending || !identifier.trim()}>
              {grantMut.isPending ? "Granting…" : "Grant role"}
            </Button>
          </form>
          <p className="mt-3 text-xs text-muted-foreground">
            The user must already have an account. Ask them to sign up at /auth first.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Current role assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {rolesQuery.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : rolesQuery.isError ? (
            <p className="text-sm text-destructive">
              {rolesQuery.error instanceof Error ? rolesQuery.error.message : "Failed to load"}
            </p>
          ) : rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No admins or editors yet.</p>
          ) : (
            <div className="divide-y">
              {rows.map((row: RoleRow) => (
                <div key={row.user_id} className="flex flex-wrap items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {row.email ?? row.full_name ?? row.user_id}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{row.user_id}</div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {row.roles.map((r) => (
                      <Badge key={r} variant={r === "admin" ? "default" : "secondary"} className="gap-1">
                        {ROLE_META[r].label}
                        <button
                          type="button"
                          className="ml-1 inline-flex text-muted-foreground hover:text-destructive"
                          onClick={() => {
                            if (confirm(`Remove ${ROLE_META[r].label} role from ${row.email ?? row.user_id}?`)) {
                              revokeMut.mutate({ userId: row.user_id, role: r });
                            }
                          }}
                          disabled={revokeMut.isPending}
                          aria-label={`Remove ${ROLE_META[r].label} role`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}