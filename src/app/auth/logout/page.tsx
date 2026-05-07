import { headers } from "next/headers";

import { auth } from "@/lib/auth/server";

import LogoutButton from "./_components/logout-button";

const LogoutPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <div className="flex min-h-full flex-col justify-center gap-y-8">
      <p className="flex flex-row gap-x-1">
        <span>Actuellement connecté en tant que</span>

        <span className="italic">{session?.user.email}</span>
      </p>

      <LogoutButton />
    </div>
  );
};

export default LogoutPage;
