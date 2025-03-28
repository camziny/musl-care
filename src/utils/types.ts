import { UserTypeEnum } from "@/server/db/schema";

export interface ImageData {
  url: string;
  alt: string;
}

export interface ProfessionalSkills {
  firstAidTraining: boolean;
  cprTraining: boolean;
  specialNeedsCare: boolean;
}

export interface AvailabilityTime {
  day: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
}

export type AvailabilityType = "Recurring" | "One-time" | "Long term" | "";
export type CareType = "Child Care" | "Elderly Care" | "Both" | "";
export type Religion = "Muslim" | "Christian" | "Jewish" | "Hindu" | "Buddhist" | "Sikh" | "Other" | "None" | "";
export type MuslimSect = "Sunni" | "Shia" | "Sufi" | "Other" | "";
export type CareCapacity = "Only one" | "Multiple" | "";
export type CareTerm = "Long term caregiver" | "Short term caregiver" | "";

export interface CareGiver {
  id?: number;
  name: string;
  description: string;
  image: ImageData;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  userType: UserTypeEnum;
  userId?: number;
  subscribed: boolean;
  
  // Cultural background
  languages: string[];
  sect: string;
  ethnicBackground: string[];
  
  // New form fields
  careType: CareType;
  religion: Religion;
  muslimSect?: MuslimSect;
  agesServed: string[];
  careCapacity: CareCapacity;
  termOfCare: CareTerm;
  
  // Professional info
  hourlyRateMin: number;
  hourlyRateMax: number;
  yearsExperience: number | null;
  aboutMe: string;
  
  // Availability
  availability: AvailabilityTime[];
  availabilityType: AvailabilityType;
  
  // Services
  canCook: boolean;
  hasTransportation: boolean;
  canShopErrands: boolean;
  canHelpWithPets: boolean;
  canClean: boolean; 
  canOrganize: boolean;
  canTutor: boolean;
  canPack: boolean;
  canMealPrep: boolean;
  
  // Health & Skills
  isVaccinated: boolean;
  isSmoker: boolean;
  professionalSkills: ProfessionalSkills;
  
  // Verification
  backgroundChecked: boolean;
  
  createdAt?: Date;
  updatedAt?: Date;
}
