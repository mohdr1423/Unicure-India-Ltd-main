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
    try {
      await assertAdmin(context);
      const { data: row, error } = await context.supabase
        .from("site_content")
        .select("key, draft, published, published_at, updated_at")
        .eq("key", data.key)
        .maybeSingle();
      if (error) {
        console.error(`[getSiteContentBlock] Error fetching "${data.key}":`, error);
        return null;
      }
      return (row as SiteContentRow) ?? null;
    } catch (err) {
      console.error(`[getSiteContentBlock] Exception fetching "${data.key}":`, err);
      return null;
    }
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
    try {
      await assertAdmin(context);
      const { error } = await context.supabase
        .from("site_content")
        .upsert(
          { key: data.key, draft: data.draft as any, updated_by: context.userId },
          { onConflict: "key" },
        );
      if (error) {
        console.error(`[saveSiteContentDraft] Error saving "${data.key}":`, error);
        return { ok: false, error: error.message };
      }
      return { ok: true as const };
    } catch (err: any) {
      console.error(`[saveSiteContentDraft] Exception saving "${data.key}":`, err);
      return { ok: false, error: err?.message || String(err) };
    }
  });

export const publishSiteContentBlock = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: string }) => {
    if (!input?.key || typeof input.key !== "string") throw new Error("Invalid key");
    return input;
  })
  .handler(async ({ data, context }) => {
    try {
      await assertAdmin(context);
      const { data: row, error: readErr } = await context.supabase
        .from("site_content")
        .select("draft")
        .eq("key", data.key)
        .maybeSingle();
      if (readErr) {
        console.error(`[publishSiteContentBlock] Read error for "${data.key}":`, readErr);
        return { ok: false, error: readErr.message };
      }
      if (!row) return { ok: false, error: "Block not found" };

      const { error } = await context.supabase
        .from("site_content")
        .update({
          published: row.draft,
          published_at: new Date().toISOString(),
          published_by: context.userId,
        })
        .eq("key", data.key);
      if (error) {
        console.error(`[publishSiteContentBlock] Update error for "${data.key}":`, error);
        return { ok: false, error: error.message };
      }
      // Snapshot the newly published version for history/restore
      await context.supabase.from("site_content_versions").insert({
        key: data.key,
        snapshot: row.draft as any,
        published_by: context.userId,
      });
      return { ok: true as const };
    } catch (err: any) {
      console.error(`[publishSiteContentBlock] Exception publishing "${data.key}":`, err);
      return { ok: false, error: err?.message || String(err) };
    }
  });

export const discardSiteContentDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { key: string }) => {
    if (!input?.key || typeof input.key !== "string") throw new Error("Invalid key");
    return input;
  })
  .handler(async ({ data, context }) => {
    try {
      await assertAdmin(context);
      const { data: row, error: readErr } = await context.supabase
        .from("site_content")
        .select("published")
        .eq("key", data.key)
        .maybeSingle();
      if (readErr) {
        console.error(`[discardSiteContentDraft] Read error for "${data.key}":`, readErr);
        return { ok: false, error: readErr.message };
      }
      if (!row) return { ok: false, error: "Block not found" };

      const { error } = await context.supabase
        .from("site_content")
        .update({ draft: row.published })
        .eq("key", data.key);
      if (error) {
        console.error(`[discardSiteContentDraft] Update error for "${data.key}":`, error);
        return { ok: false, error: error.message };
      }
      return { ok: true as const };
    } catch (err: any) {
      console.error(`[discardSiteContentDraft] Exception discarding "${data.key}":`, err);
      return { ok: false, error: err?.message || String(err) };
    }
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
    try {
      await assertAdmin(context);
      const { data: rows, error } = await context.supabase
        .from("site_content_versions")
        .select("id, key, snapshot, published_at, published_by")
        .eq("key", data.key)
        .order("published_at", { ascending: false })
        .limit(20);
      if (error) {
        console.error(`[listSiteContentVersions] Error listing versions for "${data.key}":`, error);
        return [];
      }
      return (rows ?? []) as SiteContentVersion[];
    } catch (err) {
      console.error(`[listSiteContentVersions] Exception listing versions for "${data.key}":`, err);
      return [];
    }
  });

export const restoreSiteContentVersion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { versionId: string }) => {
    if (!input?.versionId || typeof input.versionId !== "string")
      throw new Error("Invalid version");
    return input;
  })
  .handler(async ({ data, context }) => {
    try {
      await assertAdmin(context);
      const { data: v, error } = await context.supabase
        .from("site_content_versions")
        .select("key, snapshot")
        .eq("id", data.versionId)
        .maybeSingle();
      if (error) {
        console.error(
          `[restoreSiteContentVersion] Error finding version "${data.versionId}":`,
          error,
        );
        return { ok: false, error: error.message, key: "" };
      }
      if (!v) return { ok: false, error: "Version not found", key: "" };
      const { error: upErr } = await context.supabase
        .from("site_content")
        .update({ draft: v.snapshot as any })
        .eq("key", v.key);
      if (upErr) {
        console.error(`[restoreSiteContentVersion] Update error for "${v.key}":`, upErr);
        return { ok: false, error: upErr.message, key: v.key as string };
      }
      return { ok: true as const, key: v.key as string };
    } catch (err: any) {
      console.error(`[restoreSiteContentVersion] Exception restoring "${data.versionId}":`, err);
      return { ok: false, error: err?.message || String(err), key: "" };
    }
  });
