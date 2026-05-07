"use client";

import { authClient } from "@/lib/auth/client";
import { Routes } from "@/lib/routes";

const LoginPage = () => {
  const handleGoogleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: Routes.HOME,
      errorCallbackURL: Routes.LOGIN_ERROR,
    });
  };

  return (
    <button onClick={() => handleGoogleLogin()} type="button">
      Se connecter via Google
    </button>
  );
};

export default LoginPage;
