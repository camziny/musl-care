DO $$ BEGIN
 CREATE TYPE "public"."AvailabilityType" AS ENUM('Recurring', 'One-time', 'Long term');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."CareCapacity" AS ENUM('Only one', 'Multiple');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."CareTerm" AS ENUM('Long term caregiver', 'Short term caregiver');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."CareType" AS ENUM('Child Care', 'Elderly Care', 'Both');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."MuslimSect" AS ENUM('Sunni', 'Shia', 'Sufi', 'Other');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."Religion" AS ENUM('Muslim', 'Christian', 'Jewish', 'Hindu', 'Buddhist', 'Sikh', 'Other', 'None');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "care_type" "CareType";--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "religion" "Religion";--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "muslim_sect" "MuslimSect";--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "ages_served" text[] DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "care_capacity" "CareCapacity";--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "term_of_care" "CareTerm";--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "hourly_rate_min" numeric DEFAULT '0';--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "hourly_rate_max" numeric DEFAULT '0';--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "years_experience" integer;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "about_me" text;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "availability_type" "AvailabilityType";--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "can_cook" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "has_transportation" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "can_shop_errands" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "can_help_with_pets" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "can_clean" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "can_organize" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "can_tutor" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "can_pack" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "can_meal_prep" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "is_vaccinated" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "is_smoker" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "first_aid_training" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "cpr_training" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" ADD COLUMN "special_needs_care" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "careGivers" DROP COLUMN IF EXISTS "hourly_rate";