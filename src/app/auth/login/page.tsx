"use client";

import { Routes } from "@/lib/routes";
import { createClient } from "@/lib/supabase/client";

const LoginPage = () => {
  const handleGoogleLogin = async () => {
    await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${Routes.API_AUTH_CALLBACK}`,
      },
    });
  };

  return (
    <button onClick={() => handleGoogleLogin()} type="button">
      Se connecter via Google
    </button>
  );
};

export default LoginPage;
