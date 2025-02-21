"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormProgress } from "@/components/ui/FormProgress";

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

const RELIGIONS = ["Muslim", "Sikh", "Hindu", "Buddhist", "Jain", "Christian", "Zoroastrian", "no preference"];
const MUSLIM_SECTS = ["Sunni", "Shia", "Ahmadiyya", "Ismaili", "Ibadi", "Mahdavia", "Barelvi", "Deobandi", "Alawite", "Druze", "Yazidi", "Alevi", "just Muslim"];
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

  const calculateCompletedSteps = () => {
    const steps = [
      formData.careType !== "",
      formData.religion !== "",
      formData.religion === "Muslim" ? formData.muslimSect !== "" : true,
      formData.ethnicities.length > 0,
      formData.languages.length > 0,
      formData.countries.length > 0,
      formData.agesOfPeople.length > 0,
      formData.termOfCare !== ""
    ];

    return steps.filter(Boolean).length;
  };

  const totalSteps = formData.religion === "Muslim" ? 8 : 7;
  const completedSteps = calculateCompletedSteps();

  const SelectionList = ({ 
    title, 
    options, 
    selected, 
    onSelect, 
    multiSelect = false 
  }: { 
    title: string;
    options: string[];
    selected: string | string[];
    onSelect: (value: string) => void;
    multiSelect?: boolean;
  }) => {
    const selectedItems = multiSelect 
      ? selected as string[]
      : selected ? [selected as string] : [];

    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        
        {selectedItems.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-3 py-1.5 rounded-full 
                  bg-slate-800 text-white text-sm group"
              >
                {item}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item);
                  }}
                  className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <ScrollArea className="h-[320px] -mx-2 px-2">
          <div className="space-y-1.5">
            {options.map((option) => {
              const isSelected = multiSelect 
                ? (selected as string[]).includes(option)
                : selected === option;

              return (
                <motion.div
                  key={option}
                  onClick={() => onSelect(option)}
                  className={`
                    flex items-center p-3.5 rounded-lg cursor-pointer
                    transition-all duration-200 ease-in-out
                    ${isSelected 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'hover:bg-slate-50 border border-gray-200'}
                  `}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="flex-1">{option}</span>
                  {isSelected && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="text-white ml-2"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  };

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
      <FormProgress totalSteps={totalSteps} completedSteps={completedSteps} />
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Your Care Match</h1>
              <p className="text-sm text-gray-600">Tell us your preferences to find the ideal caregiver</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-12 gap-6">
          {/* Sticky Info Panel */}
          <div className="md:col-span-4">
            <div className="sticky top-[88px] space-y-4">
              <div className="bg-white rounded-lg border p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">What We&apos;ll Need</h2>
                <ul className="space-y-2">
                  {[
                    'Type of care needed',
                    'Religious preferences',
                    'Cultural background',
                    'Language requirements',
                    'Care duration and schedule'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="text-slate-800 mr-2">•</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 text-white">
                <h2 className="text-lg font-semibold mb-3">Why These Details Matter</h2>
                <p className="text-sm text-slate-200 mb-3">
                  We use your preferences to match you with caregivers who align with your values and requirements.
                </p>
                <div className="flex items-center text-xs text-slate-300 border-t border-slate-700 pt-3">
                  <span className="mr-2">ℹ️</span>
                  <span>All matches are verified and background-checked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form Section - Scrollable */}
          <div className="md:col-span-8">
            <div className="space-y-4">
              <SelectionList
                title="What type of care are you looking for?"
                options={["Child Care", "Elderly Care", "Both"]}
                selected={formData.careType}
                onSelect={(value) => handleCareTypeSelect(value as CareType)}
              />

              <SelectionList
                title="Religious Preference"
                options={RELIGIONS}
                selected={formData.religion}
                onSelect={(value) => handleReligionSelect(value as Religion)}
              />

              {formData.religion === "Muslim" && (
                <SelectionList
                  title="Muslim Sect Preference"
                  options={MUSLIM_SECTS}
                  selected={formData.muslimSect}
                  onSelect={(value) => handleMuslimSectSelect(value as MuslimSect)}
                />
              )}

              <SelectionList
                title="Ethnicity Preferences"
                options={ETHNICITIES}
                selected={formData.ethnicities}
                onSelect={(value) => handleMultiSelect('ethnicities', value)}
                multiSelect
              />

              <SelectionList
                title="Language Preferences"
                options={LANGUAGES}
                selected={formData.languages}
                onSelect={(value) => handleMultiSelect('languages', value)}
                multiSelect
              />

              <SelectionList
                title="Country Preferences"
                options={COUNTRIES}
                selected={formData.countries}
                onSelect={(value) => handleMultiSelect('countries', value)}
                multiSelect
              />

              <SelectionList
                title="Age Range of Care Needed"
                options={AGE_RANGES}
                selected={formData.agesOfPeople}
                onSelect={(value) => handleMultiSelect('agesOfPeople', value)}
                multiSelect
              />

              <SelectionList
                title="Care Duration"
                options={["Long term care", "Short term care"]}
                selected={formData.termOfCare}
                onSelect={(value) => handleTermSelect(value as CareLength)}
              />

              <div className="sticky bottom-0 bg-gray-50 pt-4 pb-6">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full px-8 py-3 bg-slate-800 text-white rounded-lg 
                    hover:bg-slate-700 transition-all duration-200 font-medium
                    focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                  onClick={() => window.location.href = '/matches'}
                >
                  Find Matches
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
