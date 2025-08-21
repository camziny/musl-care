DO $$ BEGIN
 CREATE TYPE "public"."BusinessCategory" AS ENUM('Daycare', 'Tutoring', 'Senior recreation', 'Products', 'Clothing & Accessories', 'Catering', 'Food/restaurant', 'Umrah/Hajj booking', 'Legal services', 'Therapists');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."BusinessStatus" AS ENUM('pending', 'approved', 'rejected');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "businesses" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"owner_name" text,
	"category" "BusinessCategory" NOT NULL,
	"description" text,
	"address_line" text,
	"city" text,
	"state" text,
	"zip" text,
	"country" text DEFAULT 'United States',
	"website" text,
	"contact_email" text,
	"contact_phone" text,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"image_key" text,
	"image_url" text,
	"is_muslim_owned" boolean DEFAULT false NOT NULL,
	"is_arab_owned" boolean DEFAULT false NOT NULL,
	"is_south_asian_owned" boolean DEFAULT false NOT NULL,
	"status" "BusinessStatus" DEFAULT 'pending' NOT NULL,
	"review_note" text,
	"published_at" timestamp,
	"created_by_user_id" integer NOT NULL,
	"views_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "businesses_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "businesses" ADD CONSTRAINT "businesses_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
