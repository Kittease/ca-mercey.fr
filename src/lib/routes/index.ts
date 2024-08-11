import { Route } from "next";

export const Routes = {
  LOGIN: "/auth/login",
  LOGIN_ERROR: "/auth/login/error",
  LOGOUT: "/auth/logout",

  HOME: "/",
  MUSIC: "/music",
  ALBUM_SEARCH: "/music/album/search",

  API_AUTH_CALLBACK: "/auth/v1/callback",
} satisfies Record<string, Route>;

export const PROTECTED_ROUTES: Route[] = [Routes.LOGOUT, Routes.ALBUM_SEARCH];
