import { createClient } from "@/lib/supabase/server";

import LogoutButton from "./_components/logout-button";

const LogoutPage = async () => {
  const user = await createClient().auth.getUser();

  return (
    <div className="flex min-h-full flex-col justify-center gap-y-8">
      <p>
        Actuellement connecté en tant que{" "}
        <span className="italic">{user.data.user?.email}</span>
      </p>
      <LogoutButton />
    </div>
  );
};

export default LogoutPage;
