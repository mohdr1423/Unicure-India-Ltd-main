import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type ManageableRole = "admin" | "editor";
const ALLOWED_ROLES: ManageableRole[] = ["admin", "editor"];

export type RoleRow = {
  user_id: string;
  email: string | null;
  full_name: string | null;
  roles: ManageableRole[];
  created_at: string | null;
};

async function requireAdmin(context: { supabase: any; userId: string }) {
  const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !isAdmin) throw new Error("Forbidden");
}

export const listRoleAssignments = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<RoleRow[]> => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role, created_at")
      .in("role", ALLOWED_ROLES);
    if (error) throw new Error(error.message);

    const grouped = new Map<string, { roles: Set<ManageableRole>; created_at: string | null }>();
    for (const r of roles ?? []) {
      const role = r.role as ManageableRole;
      if (!ALLOWED_ROLES.includes(role)) continue;
      const entry = grouped.get(r.user_id) ?? {
        roles: new Set<ManageableRole>(),
        created_at: r.created_at,
      };
      entry.roles.add(role);
      if (r.created_at && (!entry.created_at || r.created_at < entry.created_at)) {
        entry.created_at = r.created_at;
      }
      grouped.set(r.user_id, entry);
    }

    const userIds = [...grouped.keys()];
    if (userIds.length === 0) return [];

    const { data: profiles } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name")
      .in("id", userIds);
    const profileMap = new Map<string, { email: string | null; full_name: string | null }>(
      (profiles ?? []).map((p: any) => [p.id, { email: p.email, full_name: p.full_name }]),
    );

    return userIds
      .map((uid) => {
        const g = grouped.get(uid)!;
        const p = profileMap.get(uid) ?? { email: null, full_name: null };
        return {
          user_id: uid,
          email: p.email,
          full_name: p.full_name,
          roles: [...g.roles].sort(),
          created_at: g.created_at,
        };
      })
      .sort((a, b) => (a.email ?? a.user_id).localeCompare(b.email ?? b.user_id));
  });

async function resolveUser(identifier: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  if (UUID_RE.test(identifier)) {
    const { data, error } = await (supabaseAdmin as any).auth.admin.getUserById(identifier);
    if (error || !data?.user) throw new Error("No user found with that ID");
    return { id: data.user.id as string, email: (data.user.email ?? null) as string | null };
  }
  if (identifier.includes("@")) {
    const target = identifier.toLowerCase();
    let page = 1;
    const perPage = 200;
    while (page <= 20) {
      const { data: list, error } = await (supabaseAdmin as any).auth.admin.listUsers({
        page,
        perPage,
      });
      if (error) throw new Error(error.message);
      const users = list?.users ?? [];
      const found = users.find((u: any) => (u.email ?? "").toLowerCase() === target);
      if (found) return { id: found.id as string, email: (found.email ?? null) as string | null };
      if (users.length < perPage) break;
      page += 1;
    }
    throw new Error("No user found with that email");
  }
  throw new Error("Enter a valid user ID (UUID) or email address");
}

export const grantRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { identifier: string; role: ManageableRole }) => {
    const identifier = (input?.identifier ?? "").trim();
    if (!identifier) throw new Error("Enter a user ID or email");
    if (identifier.length > 320) throw new Error("Input too long");
    if (!ALLOWED_ROLES.includes(input?.role)) throw new Error("Invalid role");
    return { identifier, role: input.role };
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    const user = await resolveUser(data.identifier);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: user.id, role: data.role });
    if (error && !/duplicate|unique/i.test(error.message)) throw new Error(error.message);
    return { ok: true as const, userId: user.id, email: user.email, role: data.role };
  });

export const revokeRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; role: ManageableRole }) => {
    const userId = (input?.userId ?? "").trim();
    if (!UUID_RE.test(userId)) throw new Error("Invalid user id");
    if (!ALLOWED_ROLES.includes(input?.role)) throw new Error("Invalid role");
    return { userId, role: input.role };
  })
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    if (data.role === "admin" && data.userId === context.userId) {
      throw new Error("You can't revoke your own admin role");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", data.role);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
