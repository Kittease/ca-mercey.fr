import { headers } from "next/headers";

import { auth } from "./server";

export async function getAdminUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user.isAdmin) {
    return null;
  }

  return session.user;
}
