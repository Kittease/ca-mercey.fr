import { serverSideSchema } from "./types";

const loadConfig = () => {
  const parseResult = serverSideSchema.safeParse(process.env);

  if (!parseResult.success) {
    const errors = parseResult.error.issues.map(
      (issue) => ` - ${issue.path.join(".")}: ${issue.message}`,
    );

    throw new Error(
      `Missing required env variables:\n\t${errors.join(",\n\t")}`,
    );
  }

  const env = parseResult.data;

  return {
    nodeEnv: env.NODE_ENV,
    database: {
      url: env.DATABASE_URL,
      directUrl: env.DIRECT_URL,
    },
    filen: {
      email: env.FILEN_EMAIL,
      password: env.FILEN_PASSWORD,
      rootDirectory: env.FILEN_ROOT_DIRECTORY,
    },
    auth: {
      secret: env.BETTER_AUTH_SECRET,
      url: env.BETTER_AUTH_URL,
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    statsfmUserId: env.STATSFM_USER_ID,
    spotifyApi: {
      clientId: env.SPOTIFY_API_CLIENT_ID,
      clientSecret: env.SPOTIFY_API_CLIENT_SECRET,
    },
    spotifyNowPlayingUrl: env.SPOTIFY_NOW_PLAYING_URL,
    blob: {
      readWriteToken: env.BLOB_READ_WRITE_TOKEN,
    },
    cronSecret: env.CRON_SECRET,
  };
};

export const config = loadConfig();
