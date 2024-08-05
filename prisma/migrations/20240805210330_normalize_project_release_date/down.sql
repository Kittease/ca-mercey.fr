BEGIN;

-- CreateEnum
CREATE TYPE "music"."release_date_precision" AS ENUM ('DAY', 'MONTH', 'YEAR');

-- AlterTable
ALTER TABLE "music"."projects"
  ADD COLUMN "release_date" TEXT,
  ADD COLUMN "release_date_precision" "music"."release_date_precision" NOT NULL DEFAULT 'DAY';

-- MigrateData
UPDATE "music"."projects"
SET 
  "release_date" = 
    CASE 
      WHEN "release_day" IS NOT NULL THEN "release_year" || '-' || "release_month" || '-' || "release_day"
      WHEN "release_month" IS NOT NULL THEN "release_year" || '-' || "release_month"
      ELSE "release_year" 
    END,
  "release_date_precision" = 
    CASE 
      WHEN "release_day" IS NOT NULL THEN 'DAY'::"music"."release_date_precision"
      WHEN "release_month" IS NOT NULL THEN 'MONTH'::"music"."release_date_precision"
      ELSE 'YEAR'::"music"."release_date_precision"
    END;

-- AlterTable
ALTER TABLE "music"."projects"
  DROP COLUMN "release_year",
  DROP COLUMN "release_month",
  DROP COLUMN "release_day",
  ALTER COLUMN "release_date" SET NOT NULL;

COMMIT;