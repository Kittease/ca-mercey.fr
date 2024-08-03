BEGIN;


-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "music";

-- CreateEnum
CREATE TYPE "music"."project_type" AS ENUM ('ALBUM', 'COMPILATION', 'SINGLE');

-- CreateEnum
CREATE TYPE "music"."release_date_precision" AS ENUM ('DAY', 'MONTH', 'YEAR');

-- CreateTable
CREATE TABLE "music"."genres" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "genres_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music"."artists" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profile_picture_url" TEXT,

    CONSTRAINT "artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music"."artist_genres" (
    "artist_id" TEXT NOT NULL,
    "genre_id" UUID NOT NULL,

    CONSTRAINT "artist_genres_pkey" PRIMARY KEY ("artist_id","genre_id")
);

-- CreateTable
CREATE TABLE "music"."projects" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "music"."project_type" NOT NULL DEFAULT 'ALBUM',
    "cover_url" TEXT,
    "release_date" TEXT NOT NULL,
    "release_date_precision" "music"."release_date_precision" NOT NULL DEFAULT 'DAY',

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music"."project_genres" (
    "project_id" TEXT NOT NULL,
    "genre_id" UUID NOT NULL,

    CONSTRAINT "project_genres_pkey" PRIMARY KEY ("project_id","genre_id")
);

-- CreateTable
CREATE TABLE "music"."project_artists" (
    "project_id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,

    CONSTRAINT "project_artists_pkey" PRIMARY KEY ("project_id","artist_id")
);

-- CreateTable
CREATE TABLE "music"."project_tracks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "explicit" BOOLEAN NOT NULL DEFAULT false,
    "project_id" TEXT NOT NULL,
    "disc_number" INTEGER NOT NULL DEFAULT 1,
    "track_number" INTEGER NOT NULL,
    "audio_preview_url" TEXT,

    CONSTRAINT "project_tracks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "music"."track_artists" (
    "track_id" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,

    CONSTRAINT "track_artists_pkey" PRIMARY KEY ("track_id","artist_id")
);

-- AddForeignKey
ALTER TABLE "music"."artist_genres" ADD CONSTRAINT "artist_genres_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "music"."artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music"."artist_genres" ADD CONSTRAINT "artist_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "music"."genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music"."project_genres" ADD CONSTRAINT "project_genres_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "music"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music"."project_genres" ADD CONSTRAINT "project_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "music"."genres"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music"."project_artists" ADD CONSTRAINT "project_artists_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "music"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music"."project_artists" ADD CONSTRAINT "project_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "music"."artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music"."project_tracks" ADD CONSTRAINT "project_tracks_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "music"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music"."track_artists" ADD CONSTRAINT "track_artists_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "music"."project_tracks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "music"."track_artists" ADD CONSTRAINT "track_artists_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "music"."artists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


COMMIT;
