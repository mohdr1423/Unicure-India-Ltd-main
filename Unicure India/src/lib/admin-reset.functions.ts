import { createServerFn } from "@tanstack/react-start";

/**
 * Public endpoint. Sends a password-reset email only if the address
 * belongs to an account with the `admin` role. Always returns the same
 * shape to the client so failures never leak whether an email exists.
 */
export const requestAdminPasswordReset = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string; redirectTo: string }) => {
    const email = String(input?.email ?? "")
      .trim()
      .toLowerCase();
    const redirectTo = String(input?.redirectTo ?? "");
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) throw new Error("Enter a valid email address.");
    if (!/^https?:\/\//.test(redirectTo)) throw new Error("Invalid redirect URL.");
    return { email, redirectTo };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: isAdmin, error: checkErr } = await (supabaseAdmin as any).rpc("email_is_admin", {
      _email: data.email,
    });
    if (checkErr) {
      // Log server-side, return generic message.
      console.error("email_is_admin failed", checkErr);
      return { sent: false as const, reason: "server_error" as const };
    }
    if (!isAdmin) {
      return { sent: false as const, reason: "not_admin" as const };
    }

    const { error: resetErr } = await supabaseAdmin.auth.resetPasswordForEmail(data.email, {
      redirectTo: data.redirectTo,
    });
    if (resetErr) {
      console.error("resetPasswordForEmail failed", resetErr);
      return { sent: false as const, reason: "send_failed" as const };
    }
    return { sent: true as const };
  });
