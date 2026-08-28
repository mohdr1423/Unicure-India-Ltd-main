import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { logAdminAuthEvent } from "@/lib/auth-audit.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [{ title: "Reset password — Unicure India Ltd" }, { name: "robots", content: "noindex" }],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifyAdmin(userId: string) {
      const { data: isAdmin, error: roleErr } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      if (cancelled) return;
      if (roleErr || !isAdmin) {
        const { data: userData } = await supabase.auth.getUser();
        void logAdminAuthEvent({
          data: {
            event: "password_reset_role_check_failed",
            email: userData.user?.email ?? null,
            userId,
            success: false,
            reason: roleErr?.message ?? "User is not an admin",
            userAgent: navigator.userAgent,
          },
        }).catch(() => {});
        await supabase.auth.signOut();
        setLinkError(
          "This password reset link is not for an admin account. Please contact an existing admin if you need access.",
        );
        setReady(false);
        return;
      }
      setReady(true);
    }

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") && session?.user) {
        verifyAdmin(session.user.id);
      }
    });
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) verifyAdmin(data.session.user.id);
    });

    // If neither the recovery event nor an existing session shows up shortly,
    // the link is missing / already used / expired.
    const timer = setTimeout(() => {
      if (cancelled) return;
      setReady((r) => {
        if (!r) {
          setLinkError(
            (prev) =>
              prev ??
              "This reset link is invalid or has expired. Please request a new one from the sign-in page.",
          );
        }
        return r;
      });
    }, 4000);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      sub.subscription.unsubscribe();
    };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords do not match.");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      if (/same/i.test(error.message))
        return setError("New password must be different from your current password.");
      if (/weak|short|length/i.test(error.message))
        return setError("Please choose a stronger password (at least 8 characters).");
      return setError(error.message);
    }
    setDone(true);
    setTimeout(() => navigate({ to: "/admin" }), 1200);
  }

  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Set a new password</CardTitle>
          <CardDescription>
            {linkError
              ? "We couldn't validate this link."
              : ready
                ? "Enter a new password for your admin account."
                : "Validating your reset link…"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {linkError ? (
            <p className="text-sm text-destructive">{linkError}</p>
          ) : done ? (
            <p className="text-sm text-green-600">Password updated. Redirecting…</p>
          ) : (
            <form className="space-y-3" onSubmit={submit}>
              <div>
                <Label>New password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                  disabled={!ready}
                />
              </div>
              <div>
                <Label>Confirm password</Label>
                <Input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  minLength={8}
                  required
                  disabled={!ready}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button className="w-full" disabled={busy || !ready}>
                {busy ? "…" : "Update password"}
              </Button>
            </form>
          )}
          <div className="mt-6 text-center text-sm">
            <Link to="/auth" className="text-muted-foreground hover:text-foreground">
              ← Back to sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
