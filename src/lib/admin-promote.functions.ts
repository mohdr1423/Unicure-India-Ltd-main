import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type PromoteResult = {
  ok: true;
  userId: string;
  email: string | null;
  alreadyAdmin: boolean;
};

export const promoteUserToAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { identifier: string }) => {
    const id = (input?.identifier ?? "").trim();
    if (!id) throw new Error("Enter a user ID or email");
    if (id.length > 320) throw new Error("Input too long");
    return { identifier: id };
  })
  .handler(async ({ data, context }): Promise<PromoteResult> => {
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleErr || !isAdmin) throw new Error("Forbidden");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let userId: string | null = null;
    let email: string | null = null;

    if (UUID_RE.test(data.identifier)) {
      const { data: got, error } = await (supabaseAdmin as any).auth.admin.getUserById(data.identifier);
      if (error || !got?.user) throw new Error("No user found with that ID");
      userId = got.user.id;
      email = got.user.email ?? null;
    } else if (data.identifier.includes("@")) {
      // Paginated lookup by email (Supabase Admin API has no direct email lookup)
      const target = data.identifier.toLowerCase();
      let page = 1;
      const perPage = 200;
      // Cap at 20 pages (4000 users) to bound work
      while (page <= 20) {
        const { data: list, error } = await (supabaseAdmin as any).auth.admin.listUsers({ page, perPage });
        if (error) throw new Error(error.message);
        const users = list?.users ?? [];
        const found = users.find((u: any) => (u.email ?? "").toLowerCase() === target);
        if (found) {
          userId = found.id;
          email = found.email ?? null;
          break;
        }
        if (users.length < perPage) break;
        page += 1;
      }
      if (!userId) throw new Error("No user found with that email");
    } else {
      throw new Error("Enter a valid user ID (UUID) or email address");
    }

    const { data: existing, error: existErr } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", userId!)
      .eq("role", "admin")
      .maybeSingle();
    if (existErr) throw new Error(existErr.message);

    if (existing) {
      return { ok: true, userId: userId!, email, alreadyAdmin: true };
    }

    const { error: insertErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId!, role: "admin" });
    if (insertErr && !/duplicate|unique/i.test(insertErr.message)) {
      throw new Error(insertErr.message);
    }

    return { ok: true, userId: userId!, email, alreadyAdmin: false };
  });