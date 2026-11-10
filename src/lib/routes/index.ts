import { Route } from "next";

export const Routes = {
  LOGIN: "/auth/login",
  LOGIN_ERROR: "/auth/login/error",
  LOGOUT: "/auth/logout",

  HOME: "/",

  GALLERY: "/gallery",
  GALLERY_WORLDVIEW: "/gallery/worldview",
  PHOTO_ALBUM: "/albums/:shortId",
  PHOTO_ALBUM_WORLDVIEW: "/albums/:shortId/worldview",
  PHOTO: "/photos/:id",
  PHOTO_THUMBNAIL: "/photos/:id/thumbnail",

  MUSIC: "/music",
  FAVORITE_PROJECTS: "/music/favorites",
  ALBUM_SEARCH: "/music/album/search",

  ADMIN: "/admin",
  ADMIN_PHOTO: "/admin/photo",
  ADMIN_ALBUMS: "/admin/albums",
  ADMIN_ALBUM: "/admin/albums/:shortId",
} satisfies Record<string, Route>;

export type Path = (typeof Routes)[keyof typeof Routes];

export const PROTECTED_ROUTES: Route[] = [
  Routes.LOGOUT,
  Routes.ALBUM_SEARCH,
  Routes.ADMIN,
];
