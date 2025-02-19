"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

type CareType = "Child Care" | "Elderly Care" | "Both";
type Religion = "Muslim" | "Sikh" | "Hindu" | "Buddhist" | "Jain" | "Christian" | "Zoroastrian" | "no preference";
type MuslimSect = "Sunni" | "Shia" | "Ahmadiyya" | "Ismaili" | "Ibadi" | "Mahdavia" | "Barelvi" | "Deobandi" | "Alawite" | "Druze" | "Yazidi" | "Alevi" | "just Muslim";
type CareLength = "Long term care" | "Short term care";

interface FormData {
  careType: CareType | "";
  religion: Religion | "";
  muslimSect: MuslimSect | "";
  ethnicities: string[];
  languages: string[];
  countries: string[];
  numberOfPeople: number;
  agesOfPeople: string[];
  termOfCare: CareLength | "";
}

const RELIGIONS = ["Muslim", "Sikh", "Hindu", "Buddhist", "Jain", "Christian", "Zoroastrian", "no preference"] as const;
const MUSLIM_SECTS = ["Sunni", "Shia", "Ahmadiyya", "Ismaili", "Ibadi", "Mahdavia", "Barelvi", "Deobandi", "Alawite", "Druze", "Yazidi", "Alevi", "just Muslim"] as const;
const ETHNICITIES = ["Pakistani", "Indian", "Bangladeshi", "Sri Lankan", "Nepalese", "Afghan", "Bhutanese", "Maldivian", "Arab", "Kurdish", "Indonesian", "Malaysian", "no preference"];
const LANGUAGES = ["Urdu", "Turkish", "Arabic", "Hindi", "Kurdish", "Punjabi", "Gujarati", "Bangla", "Balochi", "Farsi", "Dari", "Pashto", "Oriya", "Bhojpuri", "Sindhi", "Singhalese", "Marathi", "Tamil", "Telugu", "Malayalam", "Kannada", "Nepali", "Assamese", "Magahi", "Malay", "no preference"];
const COUNTRIES = ["Pakistan", "India", "Bangladesh", "Nepal", "Bhutan", "Sri Lanka", "Afghanistan", "Maldives", "Palestine", "Lebanon", "Iraq", "Syria", "UAE", "Saudi Arabia", "Qatar", "Kuwait", "Yemen", "Libya", "Bahrain", "Jordan", "Indonesia", "Malaysia", "Djibouti", "Oman", "Tunisia", "Somalia", "Algeria", "Morocco", "Chad", "no preference"];
const AGE_RANGES = [
  "Infant (0-1)",
  "Toddler (1-3)",
  "Preschool (3-5)",
  "School Age (5-12)",
  "Teenager (13-19)",
  "Adult (20-40)",
  "Middle Age (40-65)",
  "Senior (65+)"
];

export default function LookingForCare() {
  const [formData, setFormData] = useState<FormData>({
    careType: "",
    religion: "",
    muslimSect: "",
    ethnicities: [],
    languages: [],
    countries: [],
    numberOfPeople: 0,
    agesOfPeople: [],
    termOfCare: ""
  });

  const handleCareTypeSelect = (type: CareType) => {
    setFormData(prev => ({ ...prev, careType: type }));
  };

  const handleReligionSelect = (religion: Religion) => {
    setFormData(prev => ({ ...prev, religion }));
  };

  const handleMuslimSectSelect = (sect: MuslimSect) => {
    setFormData(prev => ({ ...prev, muslimSect: sect }));
  };

  const handleMultiSelect = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? (prev[field] as string[]).includes(value)
          ? (prev[field] as string[]).filter(item => item !== value)
          : [...(prev[field] as string[]), value]
        : prev[field]
    }));
  };

  const handleNumberOfPeopleSelect = (num: number) => {
    setFormData(prev => ({ ...prev, numberOfPeople: num }));
  };

  const handleTermSelect = (term: CareLength) => {
    setFormData(prev => ({ ...prev, termOfCare: term }));
  };

  const SelectionButton = ({ 
    selected = false, 
    onClick, 
    children 
  }: { 
    selected?: boolean; 
    onClick: () => void; 
    children: React.ReactNode 
  }) => (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        px-6 py-3 rounded-lg text-sm font-medium
        transition-all duration-200 ease-in-out
        ${selected 
          ? 'bg-rose-100 text-rose-900 border-2 border-rose-500' 
          : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'}
      `}
    >
      {children}
    </motion.button>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      {children}
    </h2>
  );

  const Section = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <section className={`mb-12 ${className}`}>
      {children}
    </section>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Find Your Perfect Care Match
          </h1>
          <p className="text-gray-600">
            Tell us your preferences to find the ideal caregiver for your needs
          </p>
        </header>

        <div className="space-y-12">
          <Section>
            <SectionTitle>What type of care are you looking for?</SectionTitle>
            <div className="grid grid-cols-3 gap-4">
              {["Child Care", "Elderly Care", "Both"].map((type) => (
                <SelectionButton
                  key={type}
                  selected={formData.careType === type}
                  onClick={() => handleCareTypeSelect(type as CareType)}
                >
                  {type}
                </SelectionButton>
              ))}
            </div>
          </Section>

          <Section>
            <SectionTitle>Religious Preference</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {RELIGIONS.map((religion) => (
                <SelectionButton
                  key={religion}
                  selected={formData.religion === religion}
                  onClick={() => handleReligionSelect(religion as Religion)}
                >
                  {religion}
                </SelectionButton>
              ))}
            </div>
          </Section>

          {formData.religion === "Muslim" && (
            <Section>
              <SectionTitle>Muslim Sect Preference</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MUSLIM_SECTS.map((sect) => (
                  <SelectionButton
                    key={sect}
                    selected={formData.muslimSect === sect}
                    onClick={() => handleMuslimSectSelect(sect as MuslimSect)}
                  >
                    {sect}
                  </SelectionButton>
                ))}
              </div>
            </Section>
          )}

          <Section>
            <SectionTitle>Ethnicity Preferences</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ETHNICITIES.map((ethnicity) => (
                <SelectionButton
                  key={ethnicity}
                  selected={formData.ethnicities.includes(ethnicity)}
                  onClick={() => handleMultiSelect('ethnicities', ethnicity)}
                >
                  {ethnicity}
                </SelectionButton>
              ))}
            </div>
          </Section>

          <Section>
            <SectionTitle>Language Preferences</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {LANGUAGES.map((language) => (
                <SelectionButton
                  key={language}
                  selected={formData.languages.includes(language)}
                  onClick={() => handleMultiSelect('languages', language)}
                >
                  {language}
                </SelectionButton>
              ))}
            </div>
          </Section>

          <Section>
            <SectionTitle>Age Range of Care Needed</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AGE_RANGES.map((range) => (
                <SelectionButton
                  key={range}
                  selected={formData.agesOfPeople.includes(range)}
                  onClick={() => handleMultiSelect('agesOfPeople', range)}
                >
                  {range}
                </SelectionButton>
              ))}
            </div>
          </Section>

          <Section>
            <SectionTitle>Care Duration</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              {["Long term care", "Short term care"].map((term) => (
                <SelectionButton
                  key={term}
                  selected={formData.termOfCare === term}
                  onClick={() => handleTermSelect(term as CareLength)}
                >
                  {term}
                </SelectionButton>
              ))}
            </div>
          </Section>

          <Section className="text-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-8 py-4 rounded-lg shadow-lg"
              onClick={() => {/* Handle form submission */}}
            >
              Find Matches
            </motion.button>
          </Section>
        </div>
      </div>
    </div>
  );
}
