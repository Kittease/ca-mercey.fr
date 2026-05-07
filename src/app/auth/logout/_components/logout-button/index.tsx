"use client";

import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth/client";
import { Routes } from "@/lib/routes";

const LogoutButton = () => {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    void router.push(Routes.HOME);
  };

  return (
    <button onClick={() => handleLogout()} type="button">
      Se déconnecter
    </button>
  );
};

export default LogoutButton;
