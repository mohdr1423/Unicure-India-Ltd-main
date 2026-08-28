import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data: isAdmin, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error || !isAdmin) throw new Error("Forbidden");
}

export type AdminRequestRow = {
  id: string;
  user_id: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  note: string | null;
  decided_by: string | null;
  decided_at: string | null;
  created_at: string;
  updated_at: string;
};

export const listAdminRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminRequestRow[]> => {
    await assertAdmin(context);
    const { data, error } = await context.supabase
      .from("admin_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as AdminRequestRow[];
  });

export const decideAdminRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { requestId: string; decision: "approve" | "reject" }) => {
    if (!input?.requestId || typeof input.requestId !== "string")
      throw new Error("Invalid requestId");
    if (input.decision !== "approve" && input.decision !== "reject")
      throw new Error("Invalid decision");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);

    const { data: req, error: reqErr } = await context.supabase
      .from("admin_requests")
      .select("id, user_id, status")
      .eq("id", data.requestId)
      .maybeSingle();
    if (reqErr) throw new Error(reqErr.message);
    if (!req) throw new Error("Request not found");
    if (req.status !== "pending") throw new Error("Request already decided");

    const nextStatus = data.decision === "approve" ? "approved" : "rejected";

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    if (data.decision === "approve") {
      const { error: insertErr } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: req.user_id, role: "admin" });
      if (insertErr && !/duplicate|unique/i.test(insertErr.message)) {
        throw new Error(insertErr.message);
      }
    }

    const { error: updateErr } = await supabaseAdmin
      .from("admin_requests")
      .update({
        status: nextStatus,
        decided_by: context.userId,
        decided_at: new Date().toISOString(),
      })
      .eq("id", req.id);
    if (updateErr) throw new Error(updateErr.message);

    return { ok: true as const, status: nextStatus };
  });
