import { drizzle } from "drizzle-orm/vercel-postgres";
import {
  pgTable,
  serial,
  text,
  timestamp,
  pgEnum,
  numeric,
  jsonb,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { sql } from "@vercel/postgres";

export const userTypeEnum = pgEnum("UserType", ["caregiver", "careseeker"]);

export type UserTypeEnum = "caregiver" | "careseeker";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const careGivers = pgTable("careGivers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  phoneNumber: text("phone_number").notNull(),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").notNull(),
  userType: userTypeEnum("user_type").notNull(),
  userId: serial("user_id")
    .references(() => users.id)
    .notNull(),
  subscribed: boolean("subscribed").notNull().default(false),
  languages: text("languages").array().notNull().default([]),
  sect: text("sect").notNull().default(""),
  ethnicBackground: text("ethnic_background").array().notNull().default([]),
  hourlyRate: numeric("hourly_rate").notNull().default("0"),
  availability: jsonb("availability").notNull().default({}),
  backgroundChecked: boolean("background_checked").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const careSeekers = pgTable("careSeekers", {
  id: serial("id").primaryKey(),
  userId: serial("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const jobListings = pgTable("jobListings", {
  id: serial("id").primaryKey(),
  careSeekerId: integer("careSeeker_id")
    .references(() => careSeekers.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const schema = {
  users,
  careGivers,
  careSeekers,
  userTypeEnum,
  jobListings,
};

export const db = drizzle(sql, { schema });
