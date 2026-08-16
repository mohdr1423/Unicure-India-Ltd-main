import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const requestAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { email: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: userInfo, error: userErr } = await supabaseAdmin.auth.admin.getUserById(context.userId);
    if (userErr || !userInfo.user) throw new Error("Could not verify your account.");

    const user = userInfo.user;
    if (!user.email_confirmed_at) {
      throw new Error("Please confirm your email before requesting admin access.");
    }
    if ((user.email ?? "").toLowerCase() !== data.email.trim().toLowerCase()) {
      throw new Error("The email you entered does not match your signed-in account.");
    }

    const { data: alreadyAdmin } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (alreadyAdmin) return { status: "already_admin" as const };

    // Bootstrap: allow self-promotion only when no admin exists yet.
    const { count, error: countErr } = await supabaseAdmin
      .from("user_roles")
      .select("user_id", { count: "exact", head: true })
      .eq("role", "admin");
    if (countErr) throw new Error(countErr.message);

    if ((count ?? 0) > 0) {
      // Existing admins present — record a request for review.
      const { error: reqErr } = await supabaseAdmin
        .from("admin_requests")
        .upsert(
          { user_id: context.userId, email: user.email!, status: "pending" },
          { onConflict: "user_id" },
        );
      if (reqErr) throw new Error(reqErr.message);
      return { status: "pending_review" as const };
    }

    const { error: insertErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: context.userId, role: "admin" });
    if (insertErr) throw new Error(insertErr.message);

    return { status: "granted" as const };
  });