BEGIN;

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "hypopg" WITH SCHEMA "music" VERSION "1.4.1";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "index_advisor" WITH SCHEMA "music" VERSION "0.2.0";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions" VERSION "1.10";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions" VERSION "1.3";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions" VERSION "0.2.0";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium" VERSION "3.1.8";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog" VERSION "1.0";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault" VERSION "0.2.8";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions" VERSION "1.1";

-- DropForeignKey
ALTER TABLE "photography"."albums" DROP CONSTRAINT "albums_cover_photo_fkey";

-- DropForeignKey
ALTER TABLE "photography"."album_photo" DROP CONSTRAINT "album_photo_album_id_fkey";

-- DropForeignKey
ALTER TABLE "photography"."album_photo" DROP CONSTRAINT "album_photo_photo_id_fkey";

-- DropForeignKey
ALTER TABLE "photography"."gallery_photo" DROP CONSTRAINT "gallery_photo_photo_id_fkey";

-- DropTable
DROP TABLE "photography"."photos";

-- DropTable
DROP TABLE "photography"."albums";

-- DropTable
DROP TABLE "photography"."album_photo";

-- DropTable
DROP TABLE "photography"."gallery_photo";

-- DropEnum
DROP TYPE "photography"."album_privacy";

COMMIT;
