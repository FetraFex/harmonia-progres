import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

export function createClient(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    // Defer the error to the first actual use. The client is constructed
    // during render — including static prerendering — which must not crash
    // the build when the env vars are not configured yet.
    return new Proxy({} as SupabaseClient, {
      get() {
        throw new Error(
          "Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local"
        );
      },
    });
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
}
