import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { config } from "@/lib/config";
import { publicConfig } from "@/lib/config/client-config";

export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    publicConfig.supabase.url,
    publicConfig.supabase.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function getAdminUser() {
  const {
    data: { user },
  } = await createClient().auth.getUser();

  if (!user) {
    return null;
  }

  const isAdmin = user.identities
    ? user.identities.some(
        (identity) =>
          config.adminIdentities.find(
            ({ provider, providerId }) =>
              identity.provider === provider && identity.id === providerId
          ) !== undefined
      )
    : false;

  if (!isAdmin) {
    return null;
  }

  return user;
}
