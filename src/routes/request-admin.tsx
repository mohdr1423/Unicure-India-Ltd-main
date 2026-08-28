import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { requestAdminRole } from "@/lib/admin-request.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Route = createFileRoute("/request-admin")({
  component: RequestAdminPage,
  head: () => ({
    meta: [
      { title: "Request admin access — Unicure India Ltd" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function RequestAdminPage() {
  const navigate = useNavigate();
  const call = useServerFn(requestAdminRole);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<null | "granted" | "pending_review" | "already_admin">(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSessionEmail(data.user?.email ?? null);
      if (data.user?.email) setEmail(data.user.email);
      setChecking(false);
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await call({ data: { email } });
      setResult(res.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Request admin access</CardTitle>
          <CardDescription>
            Confirm your signed-in email to request the admin role for /admin/* routes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {checking ? (
            <p className="text-sm text-muted-foreground">Checking your session…</p>
          ) : !sessionEmail ? (
            <div className="space-y-3">
              <p className="text-sm">You need to be signed in with a confirmed email first.</p>
              <Button onClick={() => navigate({ to: "/auth" })} className="w-full">
                Go to sign in
              </Button>
            </div>
          ) : result === "granted" ? (
            <div className="space-y-3">
              <p className="text-sm text-green-600">
                Admin role granted. You can now open the admin panel.
              </p>
              <Button onClick={() => navigate({ to: "/admin" })} className="w-full">
                Open /admin
              </Button>
            </div>
          ) : result === "already_admin" ? (
            <div className="space-y-3">
              <p className="text-sm text-green-600">You already have the admin role.</p>
              <Button onClick={() => navigate({ to: "/admin" })} className="w-full">
                Open /admin
              </Button>
            </div>
          ) : result === "pending_review" ? (
            <p className="text-sm">
              An admin already exists for this project, so new requests require approval from an
              existing admin. Ask a current admin to grant your account the role.
            </p>
          ) : (
            <form className="space-y-3" onSubmit={submit}>
              <div>
                <Label>Signed in as</Label>
                <p className="text-sm text-muted-foreground">{sessionEmail}</p>
              </div>
              <div>
                <Label>Confirm your signup email</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button className="w-full" disabled={busy}>
                {busy ? "…" : "Request admin role"}
              </Button>
              <p className="text-xs text-muted-foreground">
                Self-service promotion works only while no admin exists yet. After that, an existing
                admin must approve new requests.
              </p>
            </form>
          )}
          <div className="mt-6 text-center text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">
              ← Back to site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
