BEGIN;

-- CreateTable
CREATE TABLE "music"."favorite_projects" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "project_id" TEXT NOT NULL,

    CONSTRAINT "favorite_projects_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "music"."favorite_projects" ADD CONSTRAINT "favorite_projects_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "music"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
