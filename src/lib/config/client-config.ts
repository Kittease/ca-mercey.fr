import { clientSideSchema } from "./types";

const loadPublicConfig = () => {
  // Need to explicitely pass each public variable for bundle substitution
  // https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser
  const parseResult = clientSideSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

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
    supabase: {
      url: env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    },
  };
};

export const publicConfig = loadPublicConfig();
