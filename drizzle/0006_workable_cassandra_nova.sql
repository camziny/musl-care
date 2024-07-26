ALTER TABLE "jobListings" ADD COLUMN "creator" text DEFAULT 'Anonymous';--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "date_posted" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "location" text DEFAULT 'Unknown location';--> statement-breakpoint
