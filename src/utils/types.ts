import { UserTypeEnum } from "@/server/db/schema";

export type ImageData = {
  url: string;
  altText: string;
};

export type Availability = {
  days: string[];
  times: string[];
};

export type CareGiver = {
  id: number;
  name: string;
  image: ImageData;
  description: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  userType: "caregiver" | "careseeker";
  userId: number;
  subscribed: boolean;
  languages: string[];
  sect: string;
  ethnicBackground: string;
  hourlyRate: number;
  availability: Availability;
  backgroundChecked: boolean;
};
