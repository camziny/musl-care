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
export const careTypeEnum = pgEnum("CareType", ["Child Care", "Elderly Care", "Both"]);
export const religionEnum = pgEnum("Religion", ["Muslim", "Christian", "Jewish", "Hindu", "Buddhist", "Sikh", "Other", "None"]);
export const muslimSectEnum = pgEnum("MuslimSect", ["Sunni", "Shia", "Sufi", "Other"]);
export const careCapacityEnum = pgEnum("CareCapacity", ["Only one", "Multiple"]);
export const availabilityTypeEnum = pgEnum("AvailabilityType", ["Recurring", "One-time", "Long term"]);
export const careTermEnum = pgEnum("CareTerm", ["Long term caregiver", "Short term caregiver"]);
export const reportTargetEnum = pgEnum("ReportTarget", ["post", "comment"]);
export const reportStatusEnum = pgEnum("ReportStatus", ["open", "reviewed", "dismissed"]);
export const notificationTypeEnum = pgEnum("NotificationType", ["reply", "mention"]);

export const businessCategoryEnum = pgEnum("BusinessCategory", [
  "Daycare",
  "Tutoring",
  "Senior recreation",
  "Products",
  "Clothing & Accessories",
  "Catering",
  "Food/restaurant",
  "Umrah/Hajj booking",
  "Legal services",
  "Therapists",
]);

export const businessStatusEnum = pgEnum("BusinessStatus", [
  "pending",
  "approved",
  "rejected",
]);

export type UserTypeEnum = "caregiver" | "careseeker";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  publicName: text("public_name"),
  locationCity: text("location_city"),
  locationState: text("location_state"),
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
  
  careType: careTypeEnum("care_type"),
  religion: religionEnum("religion"),
  muslimSect: muslimSectEnum("muslim_sect"),
  agesServed: text("ages_served").array().default([]),
  careCapacity: careCapacityEnum("care_capacity"),
  termOfCare: careTermEnum("term_of_care"),
  
  hourlyRateMin: numeric("hourly_rate_min").default("0"),
  hourlyRateMax: numeric("hourly_rate_max").default("0"),
  yearsExperience: integer("years_experience"),
  aboutMe: text("about_me"),
  
  availability: jsonb("availability").notNull().default({}),
  availabilityType: availabilityTypeEnum("availability_type"),
  
  canCook: boolean("can_cook").default(false),
  hasTransportation: boolean("has_transportation").default(false),
  canShopErrands: boolean("can_shop_errands").default(false),
  canHelpWithPets: boolean("can_help_with_pets").default(false),
  canClean: boolean("can_clean").default(false),
  canOrganize: boolean("can_organize").default(false),
  canTutor: boolean("can_tutor").default(false),
  canPack: boolean("can_pack").default(false),
  canMealPrep: boolean("can_meal_prep").default(false),
  
  isVaccinated: boolean("is_vaccinated").default(false),
  isSmoker: boolean("is_smoker").default(false),
  firstAidTraining: boolean("first_aid_training").default(false),
  cprTraining: boolean("cpr_training").default(false),
  specialNeedsCare: boolean("special_needs_care").default(false),
  
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
  title: text("title").notNull().default("Untitled Job"),
  description: text("description").notNull().default("No description provided"),
  creator: text("creator").notNull().default("Anonymous"),
  creatorUserId: text("creator_user_id").notNull(),
  datePosted: timestamp("date_posted").defaultNow().notNull(),
  
  guardianName: text("guardian_name"),
  guardianImage: text("guardian_image"),
  childrenImages: text("children_images").array(),
  
  phoneNumber: text("phone_number"),
  email: text("email"),
  isPhoneVerified: boolean("is_phone_verified").default(false),
  isEmailVerified: boolean("is_email_verified").default(false),
  isBackgroundChecked: boolean("is_background_checked").default(false),
  
  location: text("location").notNull().default("Unknown location"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  postalCode: text("postal_code"),
  country: text("country").default("United States"),
  
  careType: careTypeEnum("care_type"),
  numberOfPeople: integer("number_of_people").default(1),
  agesOfPeople: text("ages_of_people").array(),
  availabilityType: availabilityTypeEnum("availability_type"),
  availability: jsonb("availability").default({}),
  
  needsCooking: boolean("needs_cooking").default(false),
  needsCare: boolean("needs_care").default(false),
  needsFeedingChanging: boolean("needs_feeding_changing").default(false),
  needsShoppingErrands: boolean("needs_shopping_errands").default(false),
  needsPetCare: boolean("needs_pet_care").default(false),
  needsCleaning: boolean("needs_cleaning").default(false),
  needsOrganizing: boolean("needs_organizing").default(false),
  needsTutoring: boolean("needs_tutoring").default(false),
  needsPacking: boolean("needs_packing").default(false),
  needsMealPrep: boolean("needs_meal_prep").default(false),
  
  petDetails: jsonb("pet_details").default([]),
  
  requiresFirstAidTraining: boolean("requires_first_aid_training").default(false),
  requiresCprTraining: boolean("requires_cpr_training").default(false),
  requiresSpecialNeedsCare: boolean("requires_special_needs_care").default(false),
  
  preferredEthnicity: text("preferred_ethnicity").array(),
  preferredLanguages: text("preferred_languages").array(),
  preferredReligion: text("preferred_religion"),
  preferredMuslimSect: text("preferred_muslim_sect"),
  
  metadata: text("metadata"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  ownerName: text("owner_name"),
  category: businessCategoryEnum("category").notNull(),
  description: text("description"),
  addressLine: text("address_line"),
  city: text("city"),
  state: text("state"),
  zip: text("zip"),
  country: text("country").default("United States"),
  website: text("website"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  socialLinks: jsonb("social_links").default({}),
  imageKey: text("image_key"),
  imageUrl: text("image_url"),
  isMuslimOwned: boolean("is_muslim_owned").default(false).notNull(),
  isArabOwned: boolean("is_arab_owned").default(false).notNull(),
  isSouthAsianOwned: boolean("is_south_asian_owned").default(false).notNull(),
  status: businessStatusEnum("status").default("pending").notNull(),
  reviewNote: text("review_note"),
  publishedAt: timestamp("published_at"),
  createdByUserId: integer("created_by_user_id").references(() => users.id).notNull(),
  viewsCount: integer("views_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const forumCategories = pgTable("forum_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forumPosts = pgTable("forum_posts", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").references(() => forumCategories.id).notNull(),
  authorUserId: integer("author_user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array().default([]),
  attachments: jsonb("attachments").default([]),
  isHidden: boolean("is_hidden").default(false).notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  commentCount: integer("comment_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const forumComments = pgTable("forum_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").references(() => forumPosts.id).notNull(),
  authorUserId: integer("author_user_id").references(() => users.id).notNull(),
  parentCommentId: integer("parent_comment_id"),
  content: text("content").notNull(),
  isHidden: boolean("is_hidden").default(false).notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const commentLikes = pgTable("comment_likes", {
  id: serial("id").primaryKey(),
  commentId: integer("comment_id").references(() => forumComments.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contentReports = pgTable("content_reports", {
  id: serial("id").primaryKey(),
  targetType: reportTargetEnum("target_type").notNull(),
  postId: integer("post_id"),
  commentId: integer("comment_id"),
  reporterUserId: integer("reporter_user_id").references(() => users.id).notNull(),
  reason: text("reason").notNull(),
  status: reportStatusEnum("status").default("open").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const directMessages = pgTable("direct_messages", {
  id: serial("id").primaryKey(),
  senderUserId: integer("sender_user_id").references(() => users.id).notNull(),
  recipientUserId: integer("recipient_user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: notificationTypeEnum("type").notNull(),
  postId: integer("post_id"),
  commentId: integer("comment_id"),
  actorUserId: integer("actor_user_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
});

export const schema = {
  users,
  careGivers,
  careSeekers,
  userTypeEnum,
  careTypeEnum,
  religionEnum,
  muslimSectEnum,
  careCapacityEnum,
  availabilityTypeEnum,
  careTermEnum,
  jobListings,
  reportTargetEnum,
  reportStatusEnum,
  notificationTypeEnum,
  forumCategories,
  forumPosts,
  forumComments,
  commentLikes,
  contentReports,
  directMessages,
  notifications,
  businessCategoryEnum,
  businessStatusEnum,
  businesses,
};

export const db = drizzle(sql, { schema });
