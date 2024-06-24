ALTER TABLE "careGivers" ADD COLUMN "ethnic_background_tmp" text[] DEFAULT '{}';--> statement-breakpoint
UPDATE "careGivers" SET "ethnic_background_tmp" = ARRAY[ethnic_background];--> statement-breakpoint
ALTER TABLE "careGivers" DROP COLUMN "ethnic_background";--> statement-breakpoint
ALTER TABLE "careGivers" RENAME COLUMN "ethnic_background_tmp" TO "ethnic_background";--> statement-breakpoint
ALTER TABLE "careGivers" ALTER COLUMN "ethnic_background" DROP DEFAULT;--> statement-breakpoint
