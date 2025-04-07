import { pgTable, foreignKey, pgEnum, serial, integer, text, timestamp, boolean, numeric, jsonb } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const AvailabilityType = pgEnum("AvailabilityType", ['Recurring', 'One-time', 'Long term'])
export const CareCapacity = pgEnum("CareCapacity", ['Only one', 'Multiple'])
export const CareTerm = pgEnum("CareTerm", ['Long term caregiver', 'Short term caregiver'])
export const CareType = pgEnum("CareType", ['Child Care', 'Elderly Care', 'Both'])
export const MuslimSect = pgEnum("MuslimSect", ['Sunni', 'Shia', 'Sufi', 'Other'])
export const Religion = pgEnum("Religion", ['Muslim', 'Christian', 'Jewish', 'Hindu', 'Buddhist', 'Sikh', 'Other', 'None'])
export const UserType = pgEnum("UserType", ['caregiver', 'careseeker'])


export const jobListings = pgTable("jobListings", {
	id: serial("id").primaryKey().notNull(),
	careSeeker_id: integer("careSeeker_id").notNull().references(() => careSeekers.id),
	title: text("title").default('Untitled Job').notNull(),
	description: text("description").default('No description provided').notNull(),
	creator: text("creator").default('Anonymous').notNull(),
	creator_user_id: text("creator_user_id").notNull(),
	date_posted: timestamp("date_posted", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	location: text("location").default('Unknown location').notNull(),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	metadata: text("metadata"),
});

export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	clerk_user_id: text("clerk_user_id").notNull(),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const careGivers = pgTable("careGivers", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	image: text("image").notNull(),
	phone_number: text("phone_number").notNull(),
	address: text("address").notNull(),
	city: text("city").notNull(),
	state: text("state").notNull(),
	postal_code: text("postal_code").notNull(),
	country: text("country").notNull(),
	user_type: UserType("user_type").notNull(),
	user_id: integer("user_id").notNull().references(() => users.id),
	subscribed: boolean("subscribed").default(false).notNull(),
	languages: text("languages").default('{}').array().notNull(),
	sect: text("sect").default('').notNull(),
	ethnic_background: text("ethnic_background").default('{}').array().notNull(),
	care_type: CareType("care_type"),
	religion: Religion("religion"),
	muslim_sect: MuslimSect("muslim_sect"),
	ages_served: text("ages_served").default('{}').array(),
	care_capacity: CareCapacity("care_capacity"),
	term_of_care: CareTerm("term_of_care"),
	hourly_rate_min: numeric("hourly_rate_min").default('0'),
	hourly_rate_max: numeric("hourly_rate_max").default('0'),
	years_experience: integer("years_experience"),
	about_me: text("about_me"),
	availability: jsonb("availability").default({}).notNull(),
	availability_type: AvailabilityType("availability_type"),
	can_cook: boolean("can_cook").default(false),
	has_transportation: boolean("has_transportation").default(false),
	can_shop_errands: boolean("can_shop_errands").default(false),
	can_help_with_pets: boolean("can_help_with_pets").default(false),
	can_clean: boolean("can_clean").default(false),
	can_organize: boolean("can_organize").default(false),
	can_tutor: boolean("can_tutor").default(false),
	can_pack: boolean("can_pack").default(false),
	can_meal_prep: boolean("can_meal_prep").default(false),
	is_vaccinated: boolean("is_vaccinated").default(false),
	is_smoker: boolean("is_smoker").default(false),
	first_aid_training: boolean("first_aid_training").default(false),
	cpr_training: boolean("cpr_training").default(false),
	special_needs_care: boolean("special_needs_care").default(false),
	background_checked: boolean("background_checked").default(false).notNull(),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const careSeekers = pgTable("careSeekers", {
	id: serial("id").primaryKey().notNull(),
	user_id: integer("user_id").notNull().references(() => users.id),
	created_at: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updated_at: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});