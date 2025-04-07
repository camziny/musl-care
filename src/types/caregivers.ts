export interface AvailabilityTime {
  day: string;
  startTime: string;
  endTime: string;
  recurring: boolean;
}

export interface ProfessionalSkills {
  firstAidTraining: boolean;
  cprTraining: boolean;
  specialNeedsCare: boolean;
}

export interface HourlyRate {
  min: number;
  max: number;
}

export type CareType = "Child Care" | "Elderly Care" | "Both" | string;
export type CareCapacity = "Only one" | "Multiple" | string;
export type AvailabilityType = "Recurring" | "One-time" | "Long term" | string;
export type Religion = "Muslim" | "Sikh" | "Hindu" | "Buddhist" | "Jain" | "Christian" | "Zoroastrian" | "no preference" | string;
export type MuslimSect = "Sunni" | "Shia" | "Ahmadiyya" | "Ismaili" | "Ibadi" | "Mahdavia" | "Barelvi" | "Deobandi" | "Alawite" | "Druze" | "Yazidi" | "Alevi" | "just Muslim" | string;
export type CareTerm = "Long term caregiver" | "Short term caregiver" | string;

export interface Caregiver {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description: string;
  image: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  email: string;
  backgroundChecked: boolean;
  
  aboutMe?: string;
  careType?: CareType;
  religion?: Religion;
  muslimSect?: MuslimSect;
  ethnicity?: string;
  languages?: string[];
  agesServed?: string[];
  careCapacity?: CareCapacity;
  termOfCare?: CareTerm;
  
  hourlyRate?: HourlyRate | string;
  yearsExperience?: number;
  availability?: AvailabilityTime[] | string;
  availabilityType?: AvailabilityType;
  
  canCook?: boolean;
  hasTransportation?: boolean;
  canShopErrands?: boolean;
  canHelpWithPets?: boolean;
  canClean?: boolean;
  canOrganize?: boolean;
  canTutor?: boolean;
  canPack?: boolean;
  canMealPrep?: boolean;
  
  isVaccinated?: boolean;
  isSmoker?: boolean;
  professionalSkills?: ProfessionalSkills | string;
}

export interface ServiceItem {
  id: keyof Pick<Caregiver, 
    'canCook' | 'hasTransportation' | 'canShopErrands' | 'canHelpWithPets' | 
    'canClean' | 'canOrganize' | 'canTutor' | 'canPack' | 'canMealPrep'>;
  name: string;
  icon: string;
}

export interface DayMapping {
  [key: string]: string;
}

export const RELIGIONS = ["Muslim", "Sikh", "Hindu", "Buddhist", "Jain", "Christian", "Zoroastrian", "no preference"];
export const MUSLIM_SECTS = ["Sunni", "Shia", "Ahmadiyya", "Ismaili", "Ibadi", "Mahdavia", "Barelvi", "Deobandi", "Alawite", "Druze", "Yazidi", "Alevi", "just Muslim"];
export const ETHNICITIES = ["Pakistani", "Indian", "Bangladeshi", "Sri Lankan", "Nepalese", "Afghan", "Bhutanese", "Maldivian", "Arab", "Kurdish", "Indonesian", "Malaysian", "no preference"];
export const LANGUAGES = ["Urdu", "Turkish", "Arabic", "Hindi", "Kurdish", "Punjabi", "Gujarati", "Bangla", "Balochi", "Farsi", "Dari", "Pashto", "Oriya", "Bhojpuri", "Sindhi", "Singhalese", "Marathi", "Tamil", "Telugu", "Malayalam", "Kannada", "Nepali", "Assamese", "Magahi", "Malay", "no preference"];
export const COUNTRIES = ["Pakistan", "India", "Bangladesh", "Nepal", "Bhutan", "Sri Lanka", "Afghanistan", "Maldives", "Palestine", "Lebanon", "Iraq", "Syria", "UAE", "Saudi Arabia", "Qatar", "Kuwait", "Yemen", "Libya", "Bahrain", "Jordan", "Indonesia", "Malaysia", "Djibouti", "Oman", "Tunisia", "Somalia", "Algeria", "Morocco", "Chad", "no preference"];
export const AGE_RANGES = [
  "Infant (0-1)",
  "Toddler (1-3)",
  "Preschool (3-5)",
  "School Age (5-12)",
  "Teenager (13-19)",
  "Adult (20-40)",
  "Middle Age (40-65)",
  "Senior (65+)"
]; 