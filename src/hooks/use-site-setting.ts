import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Simple in-memory cache so revisiting pages doesn't re-query.
const cache = new Map<string, unknown>();

export function useSiteSetting<T = Record<string, unknown>>(key: string): T | null {
  const [value, setValue] = useState<T | null>((cache.get(key) as T) ?? null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", key)
          .maybeSingle();

        if (error) {
          console.error(`[useSiteSetting] Error loading setting for "${key}":`, error);
        }

        if (!mounted) return;
        const v = (data?.value as T) ?? null;
        if (v) cache.set(key, v);
        setValue(v);
      } catch (err) {
        console.error(`[useSiteSetting] Exception loading setting for "${key}":`, err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [key]);

  return value;
}
