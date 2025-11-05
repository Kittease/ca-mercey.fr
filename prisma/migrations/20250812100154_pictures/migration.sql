BEGIN;

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "photography";

-- CreateTable
CREATE TABLE "photography"."pictures" (
    "id" TEXT NOT NULL,
    "short_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "pictures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photography"."picture_metadata" (
    "picture_id" TEXT NOT NULL,
    "date" TIMESTAMP(3),
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "camera" TEXT,
    "lens" TEXT,
    "focal_length" DOUBLE PRECISION,
    "aperture" TEXT,
    "exposure" TEXT,
    "iso" INTEGER,
    "location" TEXT,

    CONSTRAINT "picture_metadata_pkey" PRIMARY KEY ("picture_id")
);

-- CreateTable
CREATE TABLE "photography"."albums" (
    "id" TEXT NOT NULL,
    "short_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cover_picture_id" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "albums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "photography"."album_pictures" (
    "album_id" TEXT NOT NULL,
    "picture_id" TEXT NOT NULL,

    CONSTRAINT "album_pictures_pkey" PRIMARY KEY ("album_id","picture_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pictures_short_id_key" ON "photography"."pictures"("short_id");

-- CreateIndex
CREATE UNIQUE INDEX "albums_short_id_key" ON "photography"."albums"("short_id");

-- AddForeignKey
ALTER TABLE "photography"."picture_metadata" ADD CONSTRAINT "picture_metadata_picture_id_fkey" FOREIGN KEY ("picture_id") REFERENCES "photography"."pictures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photography"."albums" ADD CONSTRAINT "albums_cover_picture_id_fkey" FOREIGN KEY ("cover_picture_id") REFERENCES "photography"."pictures"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photography"."album_pictures" ADD CONSTRAINT "album_pictures_album_id_fkey" FOREIGN KEY ("album_id") REFERENCES "photography"."albums"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "photography"."album_pictures" ADD CONSTRAINT "album_pictures_picture_id_fkey" FOREIGN KEY ("picture_id") REFERENCES "photography"."pictures"("id") ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
