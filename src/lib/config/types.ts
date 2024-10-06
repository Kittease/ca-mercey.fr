import { z } from "zod";

export enum NodeEnv {
  production = "production",
  development = "development",
  test = "test",
}

export const serverSideSchema = z.object({
  NODE_ENV: z.nativeEnum(NodeEnv),
  ADMIN_IDENTITIES: z
    .string()
    .transform((val): unknown => {
      try {
        return JSON.parse(val);
      } catch {
        return z.NEVER;
      }
    })
    .pipe(
      z.array(
        z.object({
          provider: z.string(),
          providerId: z.string(),
        })
      )
    ),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  STATSFM_USER_ID: z.string(),
  SPOTIFY_API_CLIENT_ID: z.string(),
  SPOTIFY_API_CLIENT_SECRET: z.string(),
});

export const clientSideSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
});
