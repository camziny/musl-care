export type Religion = "Muslim" | "Sikh" | "Hindu" | "Buddhist" | "Jain" | "Christian" | "Zoroastrian" | "no preference" | string;
export type MuslimSect = "Sunni" | "Shia" | "Ahmadiyya" | "Ismaili" | "Ibadi" | "Mahdavia" | "Barelvi" | "Deobandi" | "Alawite" | "Druze" | "Yazidi" | "Alevi" | "just Muslim" | string;
export type CareType = "Child Care" | "Elderly Care" | "Both" | string;
export type AvailabilityType = "Recurring" | "One-time" | "Long term" | string;

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

export const RELIGIONS = [
  "Buddhist",
  "Christian",
  "Hindu",
  "Jain",
  "Muslim",
  "no preference",
  "Sikh",
  "Zoroastrian"
];

export const MUSLIM_SECTS = [
  "Ahmadiyya",
  "Alawite",
  "Alevi",
  "Barelvi",
  "Deobandi",
  "Druze",
  "Ibadi",
  "Ismaili",
  "just Muslim",
  "Mahdavia",
  "Shia",
  "Sunni",
  "Yazidi"
];

export const ETHNICITIES = [
  "Afghan",
  "Arab",
  "Bangladeshi",
  "Bhutanese",
  "Indian",
  "Indonesian",
  "Kurdish",
  "Malaysian",
  "Maldivian",
  "Nepalese",
  "no preference",
  "Pakistani",
  "Sri Lankan"
];

export const LANGUAGES = [
  "Arabic",
  "Assamese",
  "Balochi",
  "Bangla",
  "Bhojpuri",
  "Dari",
  "Farsi",
  "Gujarati",
  "Hindi",
  "Kannada",
  "Kurdish",
  "Magahi",
  "Malay",
  "Malayalam",
  "Marathi",
  "Nepali",
  "no preference",
  "Oriya",
  "Pashto",
  "Punjabi",
  "Sindhi",
  "Singhalese",
  "Tamil",
  "Telugu",
  "Turkish",
  "Urdu"
];

export const COUNTRIES = [
  "Afghanistan",
  "Algeria",
  "Bahrain",
  "Bangladesh",
  "Bhutan",
  "Chad",
  "Djibouti",
  "India",
  "Indonesia",
  "Iraq",
  "Jordan",
  "Kuwait",
  "Lebanon",
  "Libya",
  "Malaysia",
  "Maldives",
  "Morocco",
  "Nepal",
  "no preference",
  "Oman",
  "Pakistan",
  "Palestine",
  "Qatar",
  "Saudi Arabia",
  "Somalia",
  "Sri Lanka",
  "Syria",
  "Tunisia",
  "UAE",
  "Yemen"
];

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