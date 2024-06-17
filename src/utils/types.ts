import { UserTypeEnum } from "@/server/db/schema";

export type ImageData = {
  url: string;
  altText: string;
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
  userType: UserTypeEnum;
  userId: number;
};
