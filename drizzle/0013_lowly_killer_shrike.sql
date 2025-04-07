ALTER TABLE "jobListings" ADD COLUMN "guardian_name" text;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "guardian_image" text;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "children_images" text[];--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "phone_number" text;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "is_phone_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "is_email_verified" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "is_background_checked" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "state" text;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "postal_code" text;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "country" text DEFAULT 'United States';--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "care_type" "CareType";--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "number_of_people" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "ages_of_people" text[];--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "availability_type" "AvailabilityType";--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "availability" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "needs_cooking" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "needs_care" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "needs_feeding_changing" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "needs_shopping_errands" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "needs_pet_care" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "needs_cleaning" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "needs_organizing" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "needs_tutoring" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "needs_packing" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "needs_meal_prep" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "pet_details" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "requires_first_aid_training" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "requires_cpr_training" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "requires_special_needs_care" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "preferred_ethnicity" text[];--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "preferred_languages" text[];--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "preferred_religion" text;--> statement-breakpoint
ALTER TABLE "jobListings" ADD COLUMN "preferred_muslim_sect" text;