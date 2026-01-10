import { createSupabaseClient } from "@/lib/supabase/server";

import LogoutButton from "./_components/logout-button";

const LogoutPage = async () => {
  const supabase = await createSupabaseClient();
  const user = await supabase.auth.getUser();

  return (
    <div className="flex min-h-full flex-col justify-center gap-y-8">
      <p className="flex flex-row gap-x-1">
        <span>Actuellement connecté en tant que</span>

        <span className="italic">{user.data.user?.email}</span>
      </p>

      <LogoutButton />
    </div>
  );
};

export default LogoutPage;
