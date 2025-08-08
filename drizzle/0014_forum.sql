DO $$ BEGIN
    CREATE TYPE "ReportTarget" AS ENUM ('post', 'comment');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "ReportStatus" AS ENUM ('open', 'reviewed', 'dismissed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE "NotificationType" AS ENUM ('reply', 'mention');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "public_name" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "location_city" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "location_state" text;

CREATE TABLE IF NOT EXISTS "forum_categories" (
    "id" serial PRIMARY KEY,
    "slug" text NOT NULL,
    "name" text NOT NULL,
    "description" text,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "forum_posts" (
    "id" serial PRIMARY KEY,
    "category_id" integer NOT NULL REFERENCES "forum_categories"("id") ON DELETE CASCADE,
    "author_user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "tags" text[] DEFAULT '{}',
    "attachments" jsonb DEFAULT '[]',
    "is_hidden" boolean DEFAULT false NOT NULL,
    "like_count" integer DEFAULT 0 NOT NULL,
    "comment_count" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "forum_comments" (
    "id" serial PRIMARY KEY,
    "post_id" integer NOT NULL REFERENCES "forum_posts"("id") ON DELETE CASCADE,
    "author_user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "parent_comment_id" integer,
    "content" text NOT NULL,
    "is_hidden" boolean DEFAULT false NOT NULL,
    "like_count" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "comment_likes" (
    "id" serial PRIMARY KEY,
    "comment_id" integer NOT NULL REFERENCES "forum_comments"("id") ON DELETE CASCADE,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "created_at" timestamp DEFAULT now() NOT NULL,
    CONSTRAINT comment_likes_unique UNIQUE ("comment_id", "user_id")
);

CREATE TABLE IF NOT EXISTS "content_reports" (
    "id" serial PRIMARY KEY,
    "target_type" "ReportTarget" NOT NULL,
    "post_id" integer,
    "comment_id" integer,
    "reporter_user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "reason" text NOT NULL,
    "status" "ReportStatus" DEFAULT 'open' NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "direct_messages" (
    "id" serial PRIMARY KEY,
    "sender_user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "recipient_user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "content" text NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "read_at" timestamp
);

CREATE TABLE IF NOT EXISTS "notifications" (
    "id" serial PRIMARY KEY,
    "user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "type" "NotificationType" NOT NULL,
    "post_id" integer,
    "comment_id" integer,
    "actor_user_id" integer NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "read_at" timestamp
);

CREATE INDEX IF NOT EXISTS idx_forum_posts_category ON "forum_posts" ("category_id");
CREATE INDEX IF NOT EXISTS idx_forum_posts_created_at ON "forum_posts" ("created_at");
CREATE INDEX IF NOT EXISTS idx_forum_posts_tags ON "forum_posts" USING GIN ("tags");
CREATE INDEX IF NOT EXISTS idx_forum_comments_post ON "forum_comments" ("post_id");
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON "content_reports" ("status");
