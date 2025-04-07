import { relations } from "drizzle-orm/relations";
import { careSeekers, jobListings, users, careGivers } from "./schema";

export const jobListingsRelations = relations(jobListings, ({one}) => ({
	careSeeker: one(careSeekers, {
		fields: [jobListings.careSeeker_id],
		references: [careSeekers.id]
	}),
}));

export const careSeekersRelations = relations(careSeekers, ({one, many}) => ({
	jobListings: many(jobListings),
	user: one(users, {
		fields: [careSeekers.user_id],
		references: [users.id]
	}),
}));

export const careGiversRelations = relations(careGivers, ({one}) => ({
	user: one(users, {
		fields: [careGivers.user_id],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	careGivers: many(careGivers),
	careSeekers: many(careSeekers),
}));