CREATE TABLE IF NOT EXISTS "jobListings" (
	"id" serial PRIMARY KEY NOT NULL,
	"careSeeker_id" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "jobListings" ADD CONSTRAINT "jobListings_careSeeker_id_careSeekers_id_fk" FOREIGN KEY ("careSeeker_id") REFERENCES "public"."careSeekers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "careSeekers" DROP COLUMN IF EXISTS "title";--> statement-breakpoint
ALTER TABLE "careSeekers" DROP COLUMN IF EXISTS "description";