BEGIN;

-- AlterTable
ALTER TABLE "music"."projects"
  ADD COLUMN "release_year" VARCHAR(4),
  ADD COLUMN "release_month" VARCHAR(2),
  ADD COLUMN "release_day" VARCHAR(2);

-- MigrateData
UPDATE "music"."projects"
SET 
  "release_year" = CASE 
    WHEN "release_date_precision" IN ('YEAR', 'MONTH', 'DAY') THEN SUBSTR("release_date", 1, 4) 
  END,
  "release_month" = CASE 
    WHEN "release_date_precision" IN ('MONTH', 'DAY') THEN SUBSTR("release_date", 6, 2) 
  END,
  "release_day" = CASE 
    WHEN "release_date_precision" = 'DAY' THEN SUBSTR("release_date", 9, 2) 
  END;

-- AlterTable
ALTER TABLE "music"."projects"
  DROP COLUMN "release_date",
  DROP COLUMN "release_date_precision",
  ALTER COLUMN "release_year" SET NOT NULL;

-- DropEnum
DROP TYPE "music"."release_date_precision";

COMMIT;