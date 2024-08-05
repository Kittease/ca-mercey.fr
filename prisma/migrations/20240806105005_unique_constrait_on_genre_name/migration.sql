BEGIN;

-- MigrateData
CREATE TEMP TABLE "temp_genres" AS
  WITH "unique_genres" AS (
    SELECT (ARRAY_AGG("id" ORDER BY "id"))[1] AS "id", "name"
    FROM "music"."genres"
    GROUP BY "name"
  )
  SELECT "genres"."id" AS "old_id", "unique_genres"."id" AS "new_id"
  FROM "music"."genres"
  JOIN "unique_genres" ON "genres"."name" = "unique_genres"."name"
  WHERE "genres"."id" <> "unique_genres"."id";
UPDATE "music"."artist_genres"
  SET "genre_id" = "temp_genres"."new_id"
  FROM "temp_genres"
  WHERE "artist_genres"."genre_id" = "temp_genres"."old_id";
UPDATE "music"."project_genres"
  SET "genre_id" = "temp_genres"."new_id"
  FROM "temp_genres"
  WHERE "project_genres"."genre_id" = "temp_genres"."old_id";
DELETE FROM "music"."genres"
  WHERE "id" IN (SELECT "old_id" FROM "temp_genres");
DROP TABLE "temp_genres";

-- AddIndex
ALTER TABLE "music"."genres" ADD CONSTRAINT "genres_name_key" UNIQUE ("name");

COMMIT;