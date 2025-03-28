import { CareGiver, CareType, Religion, MuslimSect, CareCapacity, CareTerm, AvailabilityType } from "./types";

export type StringEnumType = 
  | CareType 
  | Religion 
  | MuslimSect 
  | CareCapacity 
  | CareTerm 
  | AvailabilityType;

export function asEnumType<T extends StringEnumType>(value: string, defaultValue: T | undefined = undefined): T | undefined {
  if (!value) return defaultValue;
  return value as T;
}

export function asCareType(value: string): CareType {
  return value as CareType;
}

export function asReligion(value: string): Religion {
  return value as Religion;
}

export function asMuslimSect(value: string): MuslimSect | undefined {
  return value ? (value as MuslimSect) : undefined;
}

export function asCareCapacity(value: string): CareCapacity {
  return value as CareCapacity;
}

export function asCareTerm(value: string): CareTerm {
  return value as CareTerm;
}

export function asAvailabilityType(value: string): AvailabilityType {
  return value as AvailabilityType;
}

export function createCareGiverFromForm(formData: any): Partial<CareGiver> {
  return {
    ...formData,
    careType: asCareType(formData.careType),
    religion: asReligion(formData.religion),
    muslimSect: asMuslimSect(formData.muslimSect),
    careCapacity: asCareCapacity(formData.careCapacity),
    termOfCare: asCareTerm(formData.termOfCare),
    availabilityType: asAvailabilityType(formData.availabilityType),
  };
} 