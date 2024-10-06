import { serverSideSchema } from "./types";

const loadConfig = () => {
  const parseResult = serverSideSchema.safeParse(process.env);

  if (!parseResult.success) {
    const errors = parseResult.error.issues.map(
      (issue) => ` - ${issue.path.join(".")}: ${issue.message}`
    );

    throw new Error(
      `Missing required env variables:\n\t${errors.join(",\n\t")}`
    );
  }

  const env = parseResult.data;

  return {
    nodeEnv: env.NODE_ENV,
    adminIdentities: env.ADMIN_IDENTITIES,
    database: {
      url: env.DATABASE_URL,
      directUrl: env.DIRECT_URL,
    },
    statsfmUserId: env.STATSFM_USER_ID,
    spotifyApi: {
      clientId: env.SPOTIFY_API_CLIENT_ID,
      clientSecret: env.SPOTIFY_API_CLIENT_SECRET,
    },
  };
};

export const config = loadConfig();
