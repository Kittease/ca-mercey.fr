"use client";

import { useRouter } from "next/navigation";

import { Routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/client";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await createClient().auth.signOut();
    void router.push(Routes.HOME);
  };

  return (
    <button onClick={() => handleLogout()} type="button">
      Se déconnecter
    </button>
  );
};

export default LogoutButton;
