import { createBrowserClient } from "@supabase/ssr";

import { publicConfig } from "@/lib/config/client-config";

export function createClient() {
  return createBrowserClient(
    publicConfig.supabase.url,
    publicConfig.supabase.anonKey
  );
}
