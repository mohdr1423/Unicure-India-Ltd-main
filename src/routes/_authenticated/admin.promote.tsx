import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { promoteUserToAdmin } from "@/lib/admin-promote.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin/promote")({
  component: PromotePage,
  head: () => ({ meta: [{ title: "Promote admin — Unicure India Ltd" }, { name: "robots", content: "noindex" }] }),
});

function PromotePage() {
  const [identifier, setIdentifier] = useState("");
  const promote = useServerFn(promoteUserToAdmin);

  const mutate = useMutation({
    mutationFn: (id: string) => promote({ data: { identifier: id } }),
    onSuccess: (res) => {
      toast.success(
        res.alreadyAdmin
          ? `${res.email ?? res.userId} is already an admin.`
          : `Promoted ${res.email ?? res.userId} to admin.`,
      );
      setIdentifier("");
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to promote user"),
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = identifier.trim();
    if (!value) return;
    mutate.mutate(value);
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Promote user to admin</h1>
        <p className="text-sm text-muted-foreground">
          Grant admin access by user ID (UUID) or email. The user must already have an account.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" /> Grant admin role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="identifier">User ID or email</Label>
              <Input
                id="identifier"
                placeholder="user@example.com or 00000000-0000-0000-0000-000000000000"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                maxLength={320}
                autoComplete="off"
                required
              />
            </div>
            <Button type="submit" disabled={mutate.isPending || !identifier.trim()}>
              {mutate.isPending ? "Promoting…" : "Promote to admin"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}