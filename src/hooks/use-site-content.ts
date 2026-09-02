import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const cache = new Map<string, unknown>();

/** Read a published site_content block (anon-safe) by key. */
export function useSiteContent<T = Record<string, unknown>>(key: string): T | null {
  const [value, setValue] = useState<T | null>((cache.get(key) as T) ?? null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("site_content_published" as any)
          .select("published")
          .eq("key", key)
          .maybeSingle();

        if (error) {
          console.error(`[useSiteContent] Error loading content for "${key}":`, error);
        }

        if (!mounted) return;
        const v = ((data as any)?.published as T) ?? null;
        if (v) cache.set(key, v);
        setValue(v);
      } catch (err) {
        console.error(`[useSiteContent] Exception loading content for "${key}":`, err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [key]);

  return value;
}
