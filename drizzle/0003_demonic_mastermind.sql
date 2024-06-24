ALTER TABLE "careGivers" ADD COLUMN "ethnic_background_tmp" text[] DEFAULT '{}';
UPDATE "careGivers" SET "ethnic_background_tmp" = ARRAY[ethnic_background];
ALTER TABLE "careGivers" DROP COLUMN "ethnic_background";
ALTER TABLE "careGivers" RENAME COLUMN "ethnic_background_tmp" TO "ethnic_background";
ALTER TABLE "careGivers" ALTER COLUMN "ethnic_background" DROP DEFAULT;
