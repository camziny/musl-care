-- 1. Add the column without NOT NULL
ALTER TABLE "jobListings" ADD COLUMN "creator_user_id" text;

-- 2. Populate existing rows with default values
UPDATE "jobListings" SET "creator_user_id" = 'default_clerk_user_id';

-- 3. Add the NOT NULL constraint
ALTER TABLE "jobListings" ALTER COLUMN "creator_user_id" SET NOT NULL;
