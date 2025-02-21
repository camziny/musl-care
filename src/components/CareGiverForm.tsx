"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FormProgress } from "@/components/ui/FormProgress";

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
                className="inline-flex items-center px-3 py-1 rounded-full 
                  bg-slate-800 text-white text-sm"
              >
                {item}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item);
                  }}
                  className="ml-2 hover:text-slate-300 focus:outline-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
          {options.map((option) => {
            const isSelected = multiSelect 
              ? (selected as string[]).includes(option)
              : selected === option;

            return (
              <motion.div
                key={option}
                onClick={() => onSelect(option)}
                className={`
                  flex items-center p-4 rounded-lg cursor-pointer
                  transition-all duration-200 ease-in-out
                  ${isSelected 
                    ? 'bg-slate-800 text-white' 
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
      </div>
    );
  };

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
      window.location.href = '/background-check';
    }
  };

  const calculateCompletedSteps = () => {
    const steps = [
      formData.careType !== "",
      formData.religion !== "",
      formData.religion === "Muslim" ? formData.muslimSect !== "" : true,
      formData.ethnicity !== "",
      formData.languages.length > 0,
      formData.country !== "",
      formData.agesServed.length > 0,
      formData.careCapacity !== "",
      formData.termOfCare !== ""
    ];

    return steps.filter(Boolean).length;
  };

  const totalSteps = formData.religion === "Muslim" ? 9 : 8;
  const completedSteps = calculateCompletedSteps();

  return (
    <div className="w-full">
      <FormProgress totalSteps={totalSteps} completedSteps={completedSteps} />
      
      <div className="space-y-6">
        <SelectionList
          title="What type of care do you provide?"
          options={["Child Care", "Elderly Care", "Both"]}
          selected={formData.careType}
          onSelect={(value) => setFormData(prev => ({ ...prev, careType: value as CareType }))}
        />

        <SelectionList
          title="Religious Background"
          options={RELIGIONS}
          selected={formData.religion}
          onSelect={(value) => setFormData(prev => ({ ...prev, religion: value as Religion }))}
        />

        {formData.religion === "Muslim" && (
          <SelectionList
            title="Muslim Sect"
            options={MUSLIM_SECTS}
            selected={formData.muslimSect}
            onSelect={(value) => setFormData(prev => ({ ...prev, muslimSect: value as MuslimSect }))}
          />
        )}

        <SelectionList
          title="Ethnicity"
          options={ETHNICITIES}
          selected={formData.ethnicity}
          onSelect={(value) => setFormData(prev => ({ ...prev, ethnicity: value }))}
        />

        <SelectionList
          title="Languages Spoken"
          options={LANGUAGES}
          selected={formData.languages}
          onSelect={(value) => {
            const updatedLanguages = formData.languages.includes(value)
              ? formData.languages.filter(l => l !== value)
              : [...formData.languages, value];
            setFormData(prev => ({ ...prev, languages: updatedLanguages }));
          }}
          multiSelect
        />

        <SelectionList
          title="Country of Origin"
          options={COUNTRIES}
          selected={formData.country}
          onSelect={(value) => setFormData(prev => ({ ...prev, country: value }))}
        />

        <SelectionList
          title="Ages You Can Care For"
          options={AGE_RANGES}
          selected={formData.agesServed}
          onSelect={(value) => {
            const updatedAges = formData.agesServed.includes(value)
              ? formData.agesServed.filter(age => age !== value)
              : [...formData.agesServed, value];
            setFormData(prev => ({ ...prev, agesServed: updatedAges }));
          }}
          multiSelect
        />

        <SelectionList
          title="How many individuals can you care for at once?"
          options={["Only one", "Multiple"]}
          selected={formData.careCapacity}
          onSelect={(value) => setFormData(prev => ({ ...prev, careCapacity: value as CareCapacity }))}
        />

        <SelectionList
          title="Type of Care Commitment"
          options={["Long term caregiver", "Short term caregiver"]}
          selected={formData.termOfCare}
          onSelect={(value) => setFormData(prev => ({ ...prev, termOfCare: value as CareLength }))}
        />

        <div className="sticky bottom-0 bg-gray-50 pt-4 pb-6">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={!isFormComplete()}
            className={`
              w-full px-8 py-3 rounded-lg font-medium
              focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2
              ${isFormComplete()
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
            `}
            onClick={handleSubmit}
          >
            Complete Registration
          </motion.button>
        </div>
      </div>

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
