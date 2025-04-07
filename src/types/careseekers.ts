import { AvailabilityTime, Religion, MuslimSect, CareType, AvailabilityType, ProfessionalSkills } from './common';

export interface ServiceRequirements {
  needsCooking: boolean;
  needsCare: boolean;
  needsFeedingChanging: boolean;
  needsShoppingErrands: boolean;
  needsPetCare: boolean;
  needsCleaning: boolean;
  needsOrganizing: boolean;
  needsTutoring: boolean;
  needsPacking: boolean;
  needsMealPrep: boolean;
}

export interface PetDetails {
  type: string;
  description: string;
}

export interface PreferenceFilters {
  preferredEthnicity?: string[];
  preferredLanguages?: string[];
  preferredReligion?: Religion;
  preferredMuslimSect?: MuslimSect;
}

export interface CareSeeker {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  
  guardianName: string;
  guardianImage: string;
  childrenImages?: string[];
  
  phoneNumber: string;
  email: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isBackgroundChecked: boolean;
  
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  
  careType: CareType;
  numberOfPeople: number;
  agesOfPeople: string[];
  availabilityType: AvailabilityType;
  availability: AvailabilityTime[];
  
  serviceRequirements: ServiceRequirements;
  petDetails?: PetDetails[];
  
  requiredProfessionalSkills?: ProfessionalSkills;
  preferenceFilters?: PreferenceFilters;
  
  rating?: number;
  reviews?: {
    id: number;
    rating: number;
    comment: string;
    reviewerName: string;
    createdAt: Date;
  }[];
} 