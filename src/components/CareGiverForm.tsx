"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';

type CareType = "Child Care" | "Elderly Care" | "Both";
type Religion = "Muslim" | "Sikh" | "Hindu" | "Buddhist" | "Jain" | "Christian" | "Zoroastrian" | "no preference";
type MuslimSect = "Sunni" | "Shia" | "Ahmadiyya" | "Ismaili" | "Ibadi" | "Mahdavia" | "Barelvi" | "Deobandi" | "Alawite" | "Druze" | "Yazidi" | "Alevi" | "just Muslim";
type CareLength = "Long term caregiver" | "Short term caregiver";
type CareCapacity = "Only one" | "Multiple";

interface FormData {
  careType: CareType | "";
  religion: Religion | "";
  muslimSect: MuslimSect | "";
  ethnicity: string;
  languages: string[];
  country: string;
  agesServed: string[];
  careCapacity: CareCapacity | "";
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

export default function CareGiverForm() {
  const [formData, setFormData] = useState<FormData>({
    careType: "",
    religion: "",
    muslimSect: "",
    ethnicity: "",
    languages: [],
    country: "",
    agesServed: [],
    careCapacity: "",
    termOfCare: ""
  });

  const [showBackgroundCheckModal, setShowBackgroundCheckModal] = useState(false);

  // Reuse the same component styles from LookingForCare
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
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{children}</h2>
  );

  const Section = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <section className={`mb-12 ${className}`}>{children}</section>
  );

  const isFormComplete = () => {
    return (
      formData.careType &&
      formData.religion &&
      (formData.religion !== "Muslim" || formData.muslimSect) &&
      formData.ethnicity &&
      formData.languages.length > 0 &&
      formData.country &&
      formData.agesServed.length > 0 &&
      formData.careCapacity &&
      formData.termOfCare
    );
  };

  const handleSubmit = () => {
    if (isFormComplete()) {
      setShowBackgroundCheckModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Register as a Caregiver
          </h1>
          <p className="text-gray-600">
            Tell us about yourself to match with families in need of care
          </p>
        </header>

        <div className="space-y-12">
          {/* Similar sections as LookingForCare but with caregiver-specific options */}
          <Section>
            <SectionTitle>What type of care do you provide?</SectionTitle>
            <div className="grid grid-cols-3 gap-4">
              {["Child Care", "Elderly Care", "Both"].map((type) => (
                <SelectionButton
                  key={type}
                  selected={formData.careType === type}
                  onClick={() => setFormData(prev => ({ ...prev, careType: type as CareType }))}
                >
                  {type}
                </SelectionButton>
              ))}
            </div>
          </Section>

          {/* Religion Section */}
          <Section>
            <SectionTitle>Religious Background</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {RELIGIONS.map((religion) => (
                <SelectionButton
                  key={religion}
                  selected={formData.religion === religion}
                  onClick={() => setFormData(prev => ({ ...prev, religion: religion as Religion }))}
                >
                  {religion}
                </SelectionButton>
              ))}
            </div>
          </Section>

          {/* Muslim Sect Section - Conditional */}
          {formData.religion === "Muslim" && (
            <Section>
              <SectionTitle>Muslim Sect</SectionTitle>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {MUSLIM_SECTS.map((sect) => (
                  <SelectionButton
                    key={sect}
                    selected={formData.muslimSect === sect}
                    onClick={() => setFormData(prev => ({ ...prev, muslimSect: sect as MuslimSect }))}
                  >
                    {sect}
                  </SelectionButton>
                ))}
              </div>
            </Section>
          )}

          {/* Ethnicity Section */}
          <Section>
            <SectionTitle>Ethnicity</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {ETHNICITIES.map((ethnicity) => (
                <SelectionButton
                  key={ethnicity}
                  selected={formData.ethnicity === ethnicity}
                  onClick={() => setFormData(prev => ({ ...prev, ethnicity }))}
                >
                  {ethnicity}
                </SelectionButton>
              ))}
            </div>
          </Section>

          {/* Languages Section */}
          <Section>
            <SectionTitle>Languages Spoken</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {LANGUAGES.map((language) => (
                <SelectionButton
                  key={language}
                  selected={formData.languages.includes(language)}
                  onClick={() => {
                    const updatedLanguages = formData.languages.includes(language)
                      ? formData.languages.filter(l => l !== language)
                      : [...formData.languages, language];
                    setFormData(prev => ({ ...prev, languages: updatedLanguages }));
                  }}
                >
                  {language}
                </SelectionButton>
              ))}
            </div>
          </Section>

          {/* Country Section */}
          <Section>
            <SectionTitle>Country of Origin</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {COUNTRIES.map((country) => (
                <SelectionButton
                  key={country}
                  selected={formData.country === country}
                  onClick={() => setFormData(prev => ({ ...prev, country }))}
                >
                  {country}
                </SelectionButton>
              ))}
            </div>
          </Section>

          {/* Ages Served Section */}
          <Section>
            <SectionTitle>Ages You Can Care For</SectionTitle>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {AGE_RANGES.map((range) => (
                <SelectionButton
                  key={range}
                  selected={formData.agesServed.includes(range)}
                  onClick={() => {
                    const updatedAges = formData.agesServed.includes(range)
                      ? formData.agesServed.filter(age => age !== range)
                      : [...formData.agesServed, range];
                    setFormData(prev => ({ ...prev, agesServed: updatedAges }));
                  }}
                >
                  {range}
                </SelectionButton>
              ))}
            </div>
          </Section>

          <Section>
            <SectionTitle>How many individuals can you care for at once?</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              {["Only one", "Multiple"].map((capacity) => (
                <SelectionButton
                  key={capacity}
                  selected={formData.careCapacity === capacity}
                  onClick={() => setFormData(prev => ({ ...prev, careCapacity: capacity as CareCapacity }))}
                >
                  {capacity}
                </SelectionButton>
              ))}
            </div>
          </Section>

          {/* Term of Care Section */}
          <Section>
            <SectionTitle>Type of Care Commitment</SectionTitle>
            <div className="grid grid-cols-2 gap-4">
              {["Long term caregiver", "Short term caregiver"].map((term) => (
                <SelectionButton
                  key={term}
                  selected={formData.termOfCare === term}
                  onClick={() => setFormData(prev => ({ ...prev, termOfCare: term as CareLength }))}
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
              disabled={!isFormComplete()}
              className={`
                px-8 py-4 rounded-lg shadow-lg font-semibold
                ${isFormComplete()
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
              onClick={handleSubmit}
            >
              Complete Registration
            </motion.button>
          </Section>
        </div>
      </div>

      {/* Background Check Modal */}
      {showBackgroundCheckModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-8 max-w-md w-full"
          >
            <h3 className="text-xl font-bold mb-4">Background Check Required</h3>
            <p className="text-gray-600 mb-6">
              To complete your registration, you must pass a background check. 
              There is a fee associated with this process.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowBackgroundCheckModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {/* Handle background check process */}}
                className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
              >
                Proceed to Background Check
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
