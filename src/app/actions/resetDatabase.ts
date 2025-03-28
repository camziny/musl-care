'use server'

import { db, schema } from '@/server/db/schema'
import { sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'
import * as dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// List of admin user IDs that are allowed to reset the database
const ADMIN_USER_IDS = ['user_2XWbT0z8aVfLfCi6OTHoKd6c2Bj', 'user_2i17DkNdU7fyhr0a5zOgUuIF5eh']; // Replace with your admin Clerk user ID

export async function resetAndInitializeDatabase() {
  try {
    // Check if the user is authenticated and authorized
    const { userId } = auth();
    if (!userId || !ADMIN_USER_IDS.includes(userId)) {
      console.error('Unauthorized reset attempt by user:', userId);
      return { success: false, message: 'Unauthorized. Only admins can reset the database.' };
    }

    console.log('Starting database reset and initialization...')
    
    // Log database connection info (omitting sensitive parts)
    const dbUrl = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';
    console.log('Database URL domain:', dbUrl.split('@')[1]?.split('/')[0] || 'No DB URL found');
    
    // Try a simple query to test connection
    try {
      const result = await db.execute(sql`SELECT current_database()`);
      console.log('Connected to database:', result.rows?.[0] || 'unknown');
    } catch (connError) {
      console.error('Database connection test failed:', connError);
      return { success: false, message: `Database connection error: ${connError instanceof Error ? connError.message : String(connError)}` };
    }
    
    // Drop existing tables if they exist
    console.log('Dropping existing tables...');
    await db.execute(sql`DROP TABLE IF EXISTS "jobListings" CASCADE`);
    console.log('Dropped jobListings table');
    await db.execute(sql`DROP TABLE IF EXISTS "careSeekers" CASCADE`);
    console.log('Dropped careSeekers table');
    await db.execute(sql`DROP TABLE IF EXISTS "careGivers" CASCADE`);
    console.log('Dropped careGivers table');
    await db.execute(sql`DROP TABLE IF EXISTS "users" CASCADE`);
    console.log('Dropped users table');
    
    // Drop existing types if they exist
    console.log('Dropping existing types...');
    const types = [
      'UserType', 'CareType', 'Religion', 'MuslimSect', 
      'CareCapacity', 'AvailabilityType', 'CareTerm'
    ];
    
    for (const type of types) {
      await db.execute(sql.raw(`DROP TYPE IF EXISTS "${type}" CASCADE`));
      console.log(`Dropped type ${type}`);
    }
    
    // Create types as defined in schema.ts
    console.log('Creating enum types...');
    await db.execute(sql`
      CREATE TYPE "UserType" AS ENUM('caregiver', 'careseeker');
      CREATE TYPE "CareType" AS ENUM('Child Care', 'Elderly Care', 'Both');
      CREATE TYPE "Religion" AS ENUM('Muslim', 'Christian', 'Jewish', 'Hindu', 'Buddhist', 'Sikh', 'Other', 'None');
      CREATE TYPE "MuslimSect" AS ENUM('Sunni', 'Shia', 'Sufi', 'Other');
      CREATE TYPE "CareCapacity" AS ENUM('Only one', 'Multiple');
      CREATE TYPE "AvailabilityType" AS ENUM('Recurring', 'One-time', 'Long term');
      CREATE TYPE "CareTerm" AS ENUM('Long term caregiver', 'Short term caregiver');
    `);
    console.log('Created all enum types');
    
    // Create tables in correct order based on schema.ts
    console.log('Creating users table...');
    await db.execute(sql`
      CREATE TABLE "users" (
        "id" SERIAL PRIMARY KEY,
        "clerk_user_id" TEXT NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('Created users table');
    
    console.log('Creating careGivers table...');
    await db.execute(sql`
      CREATE TABLE "careGivers" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "image" TEXT NOT NULL,
        "phone_number" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "postal_code" TEXT NOT NULL,
        "country" TEXT NOT NULL,
        "user_type" "UserType" NOT NULL,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "subscribed" BOOLEAN NOT NULL DEFAULT false,
        
        "languages" TEXT[] NOT NULL DEFAULT '{}',
        "sect" TEXT NOT NULL DEFAULT '',
        "ethnic_background" TEXT[] NOT NULL DEFAULT '{}',
        
        "care_type" "CareType",
        "religion" "Religion",
        "muslim_sect" "MuslimSect",
        "ages_served" TEXT[] DEFAULT '{}',
        "care_capacity" "CareCapacity",
        "term_of_care" "CareTerm",
        
        "hourly_rate_min" NUMERIC DEFAULT '0',
        "hourly_rate_max" NUMERIC DEFAULT '0',
        "years_experience" INTEGER,
        "about_me" TEXT,
        
        "availability" JSONB NOT NULL DEFAULT '{}',
        "availability_type" "AvailabilityType",
        
        "can_cook" BOOLEAN DEFAULT false,
        "has_transportation" BOOLEAN DEFAULT false,
        "can_shop_errands" BOOLEAN DEFAULT false,
        "can_help_with_pets" BOOLEAN DEFAULT false,
        "can_clean" BOOLEAN DEFAULT false,
        "can_organize" BOOLEAN DEFAULT false,
        "can_tutor" BOOLEAN DEFAULT false,
        "can_pack" BOOLEAN DEFAULT false,
        "can_meal_prep" BOOLEAN DEFAULT false,
        
        "is_vaccinated" BOOLEAN DEFAULT false,
        "is_smoker" BOOLEAN DEFAULT false,
        "first_aid_training" BOOLEAN DEFAULT false,
        "cpr_training" BOOLEAN DEFAULT false,
        "special_needs_care" BOOLEAN DEFAULT false,
        
        "background_checked" BOOLEAN NOT NULL DEFAULT false,
        
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('Created careGivers table');
    
    console.log('Creating careSeekers table...');
    await db.execute(sql`
      CREATE TABLE "careSeekers" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users"("id"),
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('Created careSeekers table');
    
    console.log('Creating jobListings table...');
    await db.execute(sql`
      CREATE TABLE "jobListings" (
        "id" SERIAL PRIMARY KEY,
        "careSeeker_id" INTEGER NOT NULL REFERENCES "careSeekers"("id"),
        "title" TEXT NOT NULL DEFAULT 'Untitled Job',
        "description" TEXT NOT NULL DEFAULT 'No description provided',
        "creator" TEXT NOT NULL DEFAULT 'Anonymous',
        "creator_user_id" TEXT NOT NULL,
        "date_posted" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "location" TEXT NOT NULL DEFAULT 'Unknown location',
        "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      )
    `);
    console.log('Created jobListings table');
    
    // Verify tables were created by querying them
    try {
      const usersResult = await db.execute(sql`SELECT COUNT(*) FROM "users"`);
      console.log('Users table verified, row count:', usersResult.rows?.[0] || '0');
      
      const caregiversResult = await db.execute(sql`SELECT COUNT(*) FROM "careGivers"`);
      console.log('CareGivers table verified, row count:', caregiversResult.rows?.[0] || '0');
      
      const careSeekersResult = await db.execute(sql`SELECT COUNT(*) FROM "careSeekers"`);
      console.log('CareSeekers table verified, row count:', careSeekersResult.rows?.[0] || '0');
      
      const jobListingsResult = await db.execute(sql`SELECT COUNT(*) FROM "jobListings"`);
      console.log('JobListings table verified, row count:', jobListingsResult.rows?.[0] || '0');
    } catch (verifyError) {
      console.error('Table verification failed:', verifyError);
      return { 
        success: false, 
        message: `Tables may not have been created properly: ${verifyError instanceof Error ? verifyError.message : String(verifyError)}` 
      };
    }
    
    console.log('Database reset and initialization completed successfully');
    revalidatePath('/');
    return { 
      success: true, 
      message: 'Database reset and initialization completed successfully. The schema has been rebuilt according to schema.ts.'
    };
  } catch (error) {
    console.error('Error resetting database:', error);
    return { success: false, message: `Error: ${error instanceof Error ? error.message : String(error)}` };
  }
} 