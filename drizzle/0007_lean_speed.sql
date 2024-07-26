UPDATE "jobListings" SET "creator" = 'Anonymous' WHERE "creator" IS NULL;--> statement-breakpoint
UPDATE "jobListings" SET "date_posted" = now() WHERE "date_posted" IS NULL;--> statement-breakpoint
UPDATE "jobListings" SET "location" = 'Unknown location' WHERE "location" IS NULL;--> statement-breakpoint
