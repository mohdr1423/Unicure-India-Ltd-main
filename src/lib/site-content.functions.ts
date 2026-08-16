import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data: isAdmin, error } = await ctx.supabase.rpc("has_role", {
    _user_id: ctx.userId,
    _role: "admin",
  });
  if (error || !isAdmin) throw new Error("Forbidden");
}

export type SiteContentRow = {
  key: string;
  draft: any;
  published: any;
  published_at: string | null;
  updated_at: string;
};

export const getSiteContentBlock = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: string }) => {
    if (!input?.key || typeof input.key !== "string" || input.key.length > 100) {
      throw new Error("Invalid key");
    }
    return input;
  })
  .handler(async ({ data, context }): Promise<SiteContentRow | null> => {
    await assertAdmin(context);
    const { data: row, error } = await context.supabase
      .from("site_content")
      .select("key, draft, published, published_at, updated_at")
      .eq("key", data.key)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row as SiteContentRow) ?? null;
  });

export const saveSiteContentDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: string; draft: unknown }) => {
    if (!input?.key || typeof input.key !== "string" || input.key.length > 100) {
      throw new Error("Invalid key");
    }
    if (input.draft === null || typeof input.draft !== "object") {
      throw new Error("Draft must be an object");
    }
    const size = JSON.stringify(input.draft).length;
    if (size > 200_000) throw new Error("Draft too large");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await context.supabase
      .from("site_content")
      .upsert(
        { key: data.key, draft: data.draft as any, updated_by: context.userId },
        { onConflict: "key" },
      );
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });

export const publishSiteContentBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: string }) => {
    if (!input?.key || typeof input.key !== "string") throw new Error("Invalid key");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: row, error: readErr } = await context.supabase
      .from("site_content")
      .select("draft")
      .eq("key", data.key)
      .maybeSingle();
    if (readErr) throw new Error(readErr.message);
    if (!row) throw new Error("Block not found");

    const { error } = await context.supabase
      .from("site_content")
      .update({
        published: row.draft,
        published_at: new Date().toISOString(),
        published_by: context.userId,
      })
      .eq("key", data.key);
    if (error) throw new Error(error.message);
    // Snapshot the newly published version for history/restore
    await context.supabase.from("site_content_versions").insert({
      key: data.key,
      snapshot: row.draft as any,
      published_by: context.userId,
    });
    return { ok: true as const };
  });

export const discardSiteContentDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: string }) => {
    if (!input?.key || typeof input.key !== "string") throw new Error("Invalid key");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: row, error: readErr } = await context.supabase
      .from("site_content")
      .select("published")
      .eq("key", data.key)
      .maybeSingle();
    if (readErr) throw new Error(readErr.message);
    if (!row) throw new Error("Block not found");

    const { error } = await context.supabase
      .from("site_content")
      .update({ draft: row.published })
      .eq("key", data.key);
    if (error) throw new Error(error.message);
    return { ok: true as const };
  });
export type SiteContentVersion = {
  id: string;
  key: string;
  snapshot: any;
  published_at: string;
  published_by: string | null;
};

export const listSiteContentVersions = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: string }) => {
    if (!input?.key || typeof input.key !== "string") throw new Error("Invalid key");
    return input;
  })
  .handler(async ({ data, context }): Promise<SiteContentVersion[]> => {
    await assertAdmin(context);
    const { data: rows, error } = await context.supabase
      .from("site_content_versions")
      .select("id, key, snapshot, published_at, published_by")
      .eq("key", data.key)
      .order("published_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return (rows ?? []) as SiteContentVersion[];
  });

export const restoreSiteContentVersion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { versionId: string }) => {
    if (!input?.versionId || typeof input.versionId !== "string") throw new Error("Invalid version");
    return input;
  })
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { data: v, error } = await context.supabase
      .from("site_content_versions")
      .select("key, snapshot")
      .eq("id", data.versionId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!v) throw new Error("Version not found");
    const { error: upErr } = await context.supabase
      .from("site_content")
      .update({ draft: v.snapshot as any })
      .eq("key", v.key);
    if (upErr) throw new Error(upErr.message);
    return { ok: true as const, key: v.key as string };
  });
