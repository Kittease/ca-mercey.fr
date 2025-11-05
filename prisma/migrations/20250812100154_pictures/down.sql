BEGIN;

-- DropForeignKey
ALTER TABLE "photography"."picture_metadata" DROP CONSTRAINT "picture_metadata_picture_id_fkey";

-- DropForeignKey
ALTER TABLE "photography"."albums" DROP CONSTRAINT "albums_cover_picture_id_fkey";

-- DropForeignKey
ALTER TABLE "photography"."album_pictures" DROP CONSTRAINT "album_pictures_album_id_fkey";

-- DropForeignKey
ALTER TABLE "photography"."album_pictures" DROP CONSTRAINT "album_pictures_picture_id_fkey";

-- DropTable
DROP TABLE "photography"."pictures";

-- DropTable
DROP TABLE "photography"."picture_metadata";

-- DropTable
DROP TABLE "photography"."albums";

-- DropTable
DROP TABLE "photography"."album_pictures";

COMMIT;
