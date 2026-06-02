import { Route } from "next";

export const Routes = {
  LOGIN: "/auth/login",
  LOGIN_ERROR: "/auth/login/error",
  LOGOUT: "/auth/logout",

  HOME: "/",
  MUSIC: "/music",
  FAVORITE_PROJECTS: "/music/favorites",
  ALBUM_SEARCH: "/music/album/search",

  ADMIN: "/admin",
  ADMIN_PHOTO: "/admin/photo",
  ADMIN_ALBUMS: "/admin/albums",
} satisfies Record<string, Route>;

export const PROTECTED_ROUTES: Route[] = [
  Routes.LOGOUT,
  Routes.ALBUM_SEARCH,
  Routes.ADMIN,
];
