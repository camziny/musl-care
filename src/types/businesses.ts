import * as yup from "yup";

export type BusinessCategory =
  | "Daycare"
  | "Tutoring"
  | "Senior recreation"
  | "Products"
  | "Clothing & Accessories"
  | "Catering"
  | "Food/restaurant"
  | "Umrah/Hajj booking"
  | "Legal services"
  | "Therapists";

export type BusinessStatus = "pending" | "approved" | "rejected";

export interface BusinessCreateInput {
  name: string;
  ownerName?: string | null;
  category: BusinessCategory;
  description?: string | null;
  addressLine?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  website?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  socialLinks?: Record<string, string | null> | null;
  imageKey?: string | null;
  imageUrl?: string | null;
  isMuslimOwned?: boolean;
  isArabOwned?: boolean;
  isSouthAsianOwned?: boolean;
}

export interface BusinessUpdateInput extends Partial<BusinessCreateInput> {}

export interface BusinessListQuery {
  q?: string;
  category?: BusinessCategory | "all";
  city?: string;
  state?: string;
  isMuslimOwned?: boolean;
  isArabOwned?: boolean;
  isSouthAsianOwned?: boolean;
  sort?: "alphabetical" | "most_viewed" | "most_recent";
  page?: number;
  pageSize?: number;
}

export const businessCreateSchema = yup.object({
  name: yup.string().min(2).max(200).required(),
  ownerName: yup.string().max(200).nullable().optional(),
  category: yup
    .mixed<BusinessCategory>()
    .oneOf([
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
    ])
    .required(),
  description: yup.string().max(5000).nullable().optional(),
  addressLine: yup.string().max(500).nullable().optional(),
  city: yup.string().max(120).nullable().optional(),
  state: yup.string().max(120).nullable().optional(),
  zip: yup.string().max(20).nullable().optional(),
  country: yup.string().max(120).nullable().optional(),
  website: yup.string().url().max(500).nullable().optional(),
  contactEmail: yup.string().email().max(320).nullable().optional(),
  contactPhone: yup.string().max(50).nullable().optional(),
  socialLinks: yup
    .object()
    .noUnknown(true)
    .nullable()
    .optional(),
  imageKey: yup.string().max(500).nullable().optional(),
  imageUrl: yup.string().url().max(2000).nullable().optional(),
  isMuslimOwned: yup.boolean().optional(),
  isArabOwned: yup.boolean().optional(),
  isSouthAsianOwned: yup.boolean().optional(),
});

export const businessUpdateSchema = businessCreateSchema.partial();


