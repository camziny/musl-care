import { drizzle } from "drizzle-orm/vercel-postgres";
import { pgTable, serial, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { sql } from "@vercel/postgres";

const userTypeEnum = pgEnum("UserType", ["caregiver", "careseeker"]);

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
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const careSeekers = pgTable("careSeekers", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const schema = {
  users,
  careGivers,
  careSeekers,
};

export const db = drizzle(sql, { schema });