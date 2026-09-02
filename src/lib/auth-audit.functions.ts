import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const EVENTS = [
  "login_success",
  "login_failed",
  "non_admin_blocked",
  "password_reset_requested",
  "password_reset_role_check_failed",
] as const;
type AuditEvent = (typeof EVENTS)[number];

/**
 * Public endpoint. Records an admin authentication event. Silently swallows
 * errors so audit logging never blocks the user flow. Only trusted event
 * strings are accepted; free-text `reason` is truncated.
 */
export const logAdminAuthEvent = createServerFn({ method: "POST" })
  .inputValidator(
    (input: {
      event: AuditEvent;
      email?: string | null;
      userId?: string | null;
      success: boolean;
      reason?: string | null;
      userAgent?: string | null;
    }) => {
      if (!EVENTS.includes(input?.event)) throw new Error("Invalid event type.");
      return {
        event: input.event,
        email: input.email ? String(input.email).slice(0, 320) : null,
        userId: input.userId ? String(input.userId).slice(0, 64) : null,
        success: Boolean(input.success),
        reason: input.reason ? String(input.reason).slice(0, 500) : null,
        userAgent: input.userAgent ? String(input.userAgent).slice(0, 500) : null,
      };
    },
  )
  .handler(async ({ data }) => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      await supabaseAdmin.from("admin_auth_audit").insert({
        event: data.event,
        email: data.email,
        user_id: data.userId,
        success: data.success,
        reason: data.reason,
        user_agent: data.userAgent,
      });
    } catch (err) {
      console.error("logAdminAuthEvent failed", err);
    }
    return { ok: true as const };
  });

export type AdminAuthAuditRow = {
  id: string;
  event: AuditEvent;
  email: string | null;
  user_id: string | null;
  success: boolean;
  reason: string | null;
  user_agent: string | null;
  created_at: string;
};

/**
 * Admin-only. Reads recent audit entries. Uses the admin client after
 * confirming the caller is an admin via the user-scoped RPC.
 */
export const listAdminAuthAudit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: { limit?: number; event?: AuditEvent | "all"; search?: string } | undefined) => ({
      limit: Math.min(Math.max(Number(input?.limit ?? 200), 1), 500),
      event:
        input?.event && input.event !== "all" && EVENTS.includes(input.event as AuditEvent)
          ? (input.event as AuditEvent)
          : null,
      search: input?.search ? String(input.search).trim().slice(0, 200) : "",
    }),
  )
  .handler(async ({ data, context }) => {
    try {
      const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
        _user_id: context.userId,
        _role: "admin",
      });
      if (roleErr || !isAdmin) {
        console.warn("[listAdminAuthAudit] Forbidden: user is not admin");
        return [];
      }

      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      let q = supabaseAdmin
        .from("admin_auth_audit")
        .select("id,event,email,user_id,success,reason,user_agent,created_at")
        .order("created_at", { ascending: false })
        .limit(data.limit);
      if (data.event) q = q.eq("event", data.event);
      if (data.search) q = q.ilike("email", `%${data.search}%`);

      const { data: rows, error } = await q;
      if (error) {
        console.error("[listAdminAuthAudit] Query error:", error);
        return [];
      }
      return (rows ?? []) as AdminAuthAuditRow[];
    } catch (err) {
      console.error("[listAdminAuthAudit] Exception listing audit events:", err);
      return [];
    }
  });
