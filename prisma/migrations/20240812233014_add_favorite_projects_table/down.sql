BEGIN;

-- DropForeignKey
ALTER TABLE "music"."favorite_projects" DROP CONSTRAINT "favorite_projects_project_id_fkey";

-- DropTable
DROP TABLE "music"."favorite_projects";

COMMIT;
