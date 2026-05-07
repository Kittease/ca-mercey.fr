-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "authentication";

-- MoveTables
ALTER TABLE "public"."user" SET SCHEMA "authentication";
ALTER TABLE "public"."session" SET SCHEMA "authentication";
ALTER TABLE "public"."account" SET SCHEMA "authentication";
ALTER TABLE "public"."verification" SET SCHEMA "authentication";
