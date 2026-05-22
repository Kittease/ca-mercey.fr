BEGIN;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "photography";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "postgis";

-- CreateEnum
CREATE TYPE "photography"."album_privacy" AS ENUM ('PUBLIC', 'UNLISTED', 'PRIVATE');

-- CreateTable
CREATE TABLE "photography"."photos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "short_id" TEXT NOT NULL,
    "storage_key" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "camera" TEXT,
    "lens" TEXT,
    "focal_length" DOUBLE PRECISION,
    "aperture" DOUBLE PRECISION,
    "exposure_time_numerator" INTEGER,
    "exposure_time_denominator" INTEGER,
    "iso" INTEGER,
    "location_name" TEXT,
    "location_coordinates" geometry(Point, 4326),
    "capture_time" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photography"."albums" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "short_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cover_photo" UUID,
    "privacy" "photography"."album_privacy" NOT NULL DEFAULT 'PRIVATE',
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photography"."album_photo" (
    "album_id" UUID NOT NULL,
    "photo_id" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "added_on" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "album_photo_pkey" PRIMARY KEY ("album_id","photo_id")
);

-- CreateTable
CREATE TABLE "photography"."gallery_photo" (
    "photo_id" UUID NOT NULL,
    "added_on" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gallery_photo_pkey" PRIMARY KEY ("photo_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "photos_short_id_key" ON "photography"."photos"("short_id");

-- CreateIndex
CREATE UNIQUE INDEX "photos_storage_key_key" ON "photography"."photos"("storage_key");

-- CreateIndex
CREATE INDEX "photos_capture_time_idx" ON "photography"."photos"("capture_time" DESC);

-- CreateIndex
CREATE INDEX "photos_location_coordinates_idx" ON "photography"."photos" USING GIST ("location_coordinates");

-- CreateIndex
CREATE UNIQUE INDEX "albums_short_id_key" ON "photography"."albums"("short_id");

-- CreateIndex
CREATE INDEX "albums_privacy_created_at_idx" ON "photography"."albums"("privacy", "created_at" DESC);

-- CreateIndex
CREATE INDEX "album_photo_photo_id_idx" ON "photography"."album_photo"("photo_id");

-- CreateIndex
CREATE UNIQUE INDEX "album_photo_album_id_position_key" ON "photography"."album_photo"("album_id", "position");

-- AddForeignKey
ALTER TABLE "photography"."albums" ADD CONSTRAINT "albums_cover_photo_fkey" FOREIGN KEY ("cover_photo") REFERENCES "photography"."photos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photography"."album_photo" ADD CONSTRAINT "album_photo_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "photography"."albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photography"."album_photo" ADD CONSTRAINT "album_photo_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photography"."photos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photography"."gallery_photo" ADD CONSTRAINT "gallery_photo_photo_id_fkey" FOREIGN KEY ("photo_id") REFERENCES "photography"."photos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
