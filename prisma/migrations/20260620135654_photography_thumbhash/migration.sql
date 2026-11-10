BEGIN;

-- AlterTable
ALTER TABLE "photography"."photos" ADD COLUMN "thumbhash" TEXT;

COMMIT;
