BEGIN;

-- DropForeignKey
ALTER TABLE "music"."artist_genres" DROP CONSTRAINT "artist_genres_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "music"."artist_genres" DROP CONSTRAINT "artist_genres_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "music"."project_genres" DROP CONSTRAINT "project_genres_project_id_fkey";

-- DropForeignKey
ALTER TABLE "music"."project_genres" DROP CONSTRAINT "project_genres_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "music"."project_artists" DROP CONSTRAINT "project_artists_project_id_fkey";

-- DropForeignKey
ALTER TABLE "music"."project_artists" DROP CONSTRAINT "project_artists_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "music"."tracks" DROP CONSTRAINT "tracks_project_id_fkey";

-- DropForeignKey
ALTER TABLE "music"."track_artists" DROP CONSTRAINT "track_artists_track_id_fkey";

-- DropForeignKey
ALTER TABLE "music"."track_artists" DROP CONSTRAINT "track_artists_artist_id_fkey";

-- DropTable
DROP TABLE "music"."genres";

-- DropTable
DROP TABLE "music"."artists";

-- DropTable
DROP TABLE "music"."artist_genres";

-- DropTable
DROP TABLE "music"."projects";

-- DropTable
DROP TABLE "music"."project_genres";

-- DropTable
DROP TABLE "music"."project_artists";

-- DropTable
DROP TABLE "music"."tracks";

-- DropTable
DROP TABLE "music"."track_artists";

-- DropEnum
DROP TYPE "music"."project_type";

-- DropEnum
DROP TYPE "music"."release_date_precision";

COMMIT;
