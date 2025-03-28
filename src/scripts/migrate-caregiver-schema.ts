import { db } from "../server/db/schema";
import { sql } from "@vercel/postgres";

async function migrateCaregiverSchema() {
  try {
    console.log("Starting migration of caregiver schema...");

    // Add new enum types
    await sql`
      DO $$ BEGIN
        CREATE TYPE "CareType" AS ENUM ('Child Care', 'Elderly Care', 'Both');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
        CREATE TYPE "Religion" AS ENUM ('Muslim', 'Christian', 'Jewish', 'Hindu', 'Buddhist', 'Sikh', 'Other', 'None');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
        CREATE TYPE "MuslimSect" AS ENUM ('Sunni', 'Shia', 'Sufi', 'Other');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
        CREATE TYPE "CareCapacity" AS ENUM ('Only one', 'Multiple');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
        CREATE TYPE "AvailabilityType" AS ENUM ('Recurring', 'One-time', 'Long term');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ BEGIN
        CREATE TYPE "CareTerm" AS ENUM ('Long term caregiver', 'Short term caregiver');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `;

    // Add new columns to careGivers table
    // Split hourly_rate into min and max
    await sql`
      DO $$ 
      BEGIN
        ALTER TABLE "careGivers" RENAME COLUMN "hourly_rate" TO "hourly_rate_min";
      EXCEPTION
        WHEN undefined_column THEN null;
      END $$;
    `;
    
    await sql`
      DO $$ 
      BEGIN
        ALTER TABLE "careGivers" ADD COLUMN IF NOT EXISTS "hourly_rate_max" numeric DEFAULT '0';
      EXCEPTION
        WHEN duplicate_column THEN null;
      END $$;
    `;

    // Add new form fields
    await sql`
      ALTER TABLE "careGivers" 
      ADD COLUMN IF NOT EXISTS "care_type" "CareType",
      ADD COLUMN IF NOT EXISTS "religion" "Religion",
      ADD COLUMN IF NOT EXISTS "muslim_sect" "MuslimSect",
      ADD COLUMN IF NOT EXISTS "ages_served" text[] DEFAULT '{}',
      ADD COLUMN IF NOT EXISTS "care_capacity" "CareCapacity",
      ADD COLUMN IF NOT EXISTS "term_of_care" "CareTerm",
      ADD COLUMN IF NOT EXISTS "years_experience" integer,
      ADD COLUMN IF NOT EXISTS "about_me" text,
      ADD COLUMN IF NOT EXISTS "availability_type" "AvailabilityType",
      ADD COLUMN IF NOT EXISTS "can_cook" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "has_transportation" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "can_shop_errands" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "can_help_with_pets" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "can_clean" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "can_organize" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "can_tutor" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "can_pack" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "can_meal_prep" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "is_vaccinated" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "is_smoker" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "first_aid_training" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "cpr_training" boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS "special_needs_care" boolean DEFAULT false;
    `;

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

migrateCaregiverSchema(); 