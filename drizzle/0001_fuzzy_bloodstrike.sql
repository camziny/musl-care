DO $$ BEGIN
 CREATE TYPE "public"."UserType" AS ENUM('caregiver', 'careseeker');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "subscribed" boolean DEFAULT false NOT NULL;
ALTER TABLE "careGivers" ADD COLUMN "languages" text[] DEFAULT '{}' NOT NULL;
ALTER TABLE "careGivers" ADD COLUMN "sect" text DEFAULT '' NOT NULL;
ALTER TABLE "careGivers" ADD COLUMN "ethnic_background" text DEFAULT '' NOT NULL;
ALTER TABLE "careGivers" ADD COLUMN "hourly_rate" numeric DEFAULT 0 NOT NULL;
ALTER TABLE "careGivers" ADD COLUMN "availability" jsonb DEFAULT '{}'::jsonb NOT NULL;
ALTER TABLE "careGivers" ADD COLUMN "background_checked" boolean DEFAULT false NOT NULL;
