import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { setRememberPreference, clearRememberPreference } from "@/lib/remember-me";
import { requestAdminPasswordReset } from "@/lib/admin-reset.functions";
import { logAdminAuthEvent } from "@/lib/auth-audit.functions";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
  head: () => ({ meta: [{ title: "Admin Sign in — Unicure India Ltd" }, { name: "robots", content: "noindex" }] }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [mode, setMode] = useState<"auth" | "signup" | "forgot">("auth");
  const [remember, setRemember] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setBusy(false);
      void logAdminAuthEvent({
        data: {
          event: "login_failed",
          email,
          success: false,
          reason: signInError.message,
          userAgent: navigator.userAgent,
        },
      }).catch(() => {});
      if (/confirm/i.test(signInError.message) || /not confirmed/i.test(signInError.message)) {
        return setError("Please confirm your email address before signing in. Check your inbox for the confirmation link.");
      }
      return setError(signInError.message);
    }

    // Admin-only gate: verify role via SECURITY DEFINER RPC.
    const { data: isAdmin, error: roleError } = await supabase.rpc("has_role", {
      _user_id: signInData.user!.id,
      _role: "admin",
    });

    if (roleError || !isAdmin) {
      // If not yet admin, redirect to request-admin page
      setBusy(false);
      navigate({ to: "/request-admin" });
      return;
    }

    setBusy(false);
    setRememberPreference(remember);
    void logAdminAuthEvent({
      data: {
        event: "login_success",
        email,
        userId: signInData.user!.id,
        success: true,
        userAgent: navigator.userAgent,
      },
    }).catch(() => {});
    navigate({ to: "/admin" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/admin",
      },
    });

    setBusy(false);
    if (signUpError) {
      return setError(signUpError.message);
    }

    if (signUpData.session) {
      setInfo("Account created! Redirecting to setup...");
      navigate({ to: "/request-admin" });
    } else {
      setInfo("Account created! If email confirmation is enabled on Supabase, please check your inbox to confirm your email, then sign in.");
    }
  }

  async function resendConfirmation() {
    if (!email) return setError("Enter your email above first.");
    setBusy(true);
    setError(null);
    setInfo(null);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: window.location.origin + "/admin" },
    });
    setBusy(false);
    if (error) return setError(error.message);
    setInfo("Confirmation email resent. Check your inbox.");
  }

  async function forgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);
    try {
      const result = await requestAdminPasswordReset({
        data: { email, redirectTo: window.location.origin + "/reset-password" },
      });
      setBusy(false);
      void logAdminAuthEvent({
        data: {
          event: "password_reset_requested",
          email,
          success: result.sent,
          reason: result.sent ? null : (result as { reason?: string }).reason ?? null,
          userAgent: navigator.userAgent,
        },
      }).catch(() => {});
      if (result.sent) {
        return setInfo("If this email belongs to an admin account, a password reset link has been sent. Check your inbox and spam folder.");
      }
      if (result.reason === "not_admin") {
        return setInfo("If this email belongs to an admin account, a password reset link has been sent. Check your inbox and spam folder.");
      }
      if (result.reason === "send_failed") {
        return setError("We couldn't send the reset email. Please try again in a moment.");
      }
      return setError("Something went wrong on our side. Please try again.");
    } catch (err) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Could not send reset email.");
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-muted/30 px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Unicure Admin</CardTitle>
            <div className="flex rounded-lg bg-muted p-1 text-xs">
              <button
                type="button"
                onClick={() => { setMode("auth"); setError(null); setInfo(null); }}
                className={`px-3 py-1 rounded font-medium transition ${mode === "auth" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(null); setInfo(null); }}
                className={`px-3 py-1 rounded font-medium transition ${mode === "signup" ? "bg-white shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                Sign Up
              </button>
            </div>
          </div>
          <CardDescription>
            {mode === "signup"
              ? "Register a new email and password to access admin tools."
              : mode === "forgot"
              ? "Enter your email to receive a password reset link."
              : "Enter your registered email and password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === "forgot" ? (
            <form className="space-y-3 mt-2" onSubmit={forgotPassword}>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {info && <p className="text-sm text-green-600">{info}</p>}
              <Button className="w-full" disabled={busy}>{busy ? "…" : "Send reset link"}</Button>
              <button
                type="button"
                onClick={() => { setMode("auth"); setError(null); setInfo(null); }}
                className="text-sm text-muted-foreground hover:text-foreground w-full text-center"
              >
                ← Back to sign in
              </button>
            </form>
          ) : mode === "signup" ? (
            <form className="space-y-3 mt-2" onSubmit={signUp}>
              <div>
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Create Password</Label>
                <Input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {info && <p className="text-sm text-green-600">{info}</p>}
              <Button className="w-full" disabled={busy}>{busy ? "…" : "Create Account & Continue"}</Button>
              <button
                type="button"
                onClick={() => { setMode("auth"); setError(null); setInfo(null); }}
                className="text-sm text-muted-foreground hover:text-foreground w-full text-center"
              >
                Already have an account? Sign in
              </button>
            </form>
          ) : (
            <form className="space-y-3 mt-2" onSubmit={signIn}>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="your-email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
                <Checkbox checked={remember} onCheckedChange={(v) => setRemember(v === true)} />
                Remember me on this device
              </label>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {info && <p className="text-sm text-green-600">{info}</p>}
              <Button className="w-full" disabled={busy}>{busy ? "…" : "Sign in"}</Button>
              <div className="flex flex-col gap-2 pt-2 text-center text-sm">
                <button
                  type="button"
                  onClick={resendConfirmation}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Resend confirmation email
                </button>
                <button
                  type="button"
                  onClick={() => { setMode("forgot"); setError(null); setInfo(null); }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </button>
              </div>
            </form>
          )}
          <div className="mt-6 pt-6 border-t border-border space-y-3">
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Local Testing & Development
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("unicure_dev_admin", "true");
                }
                navigate({ to: "/admin" });
              }}
              className="w-full border-primary/40 bg-primary/5 hover:bg-primary hover:text-white font-semibold text-primary transition shadow-sm"
            >
              ⚡ Enter Admin Dashboard (Instant Access)
            </Button>
          </div>

          <div className="mt-4 text-center text-sm">
            <Link to="/" className="text-muted-foreground hover:text-foreground">← Back to site</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}