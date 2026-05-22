import { z } from "zod";

export enum NodeEnv {
  production = "production",
  development = "development",
  test = "test",
}

export const serverSideSchema = z.object({
  NODE_ENV: z.enum(NodeEnv),
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  FILEN_EMAIL: z.string(),
  FILEN_PASSWORD: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  STATSFM_USER_ID: z.string(),
  SPOTIFY_API_CLIENT_ID: z.string(),
  SPOTIFY_API_CLIENT_SECRET: z.string(),
  SPOTIFY_NOW_PLAYING_URL: z.string(),
});
