"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LanguageOption {
  value: string;
  label: string;
}

interface LanguageSelectProps {
  inputId: string;
  selectedLanguages?: string[];
}

const languageOptions: LanguageOption[] = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
];

const LanguageSelect: React.FC<LanguageSelectProps> = ({
  inputId,
  selectedLanguages = [],
}) => {
  const [selectedLanguageOptions, setSelectedLanguageOptions] = useState<
    LanguageOption[]
  >([]);

  useEffect(() => {
    if (selectedLanguages.length > 0) {
      const initialSelectedLanguages = languageOptions.filter((option) =>
        selectedLanguages.includes(option.value)
      );
      setSelectedLanguageOptions(initialSelectedLanguages);
    }
  }, [selectedLanguages]);

  const handleLanguageChange = (value: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const selectedOption = languageOptions.find(
      (option) => option.value === value
    );

    if (selectedOption) {
      let updatedLanguages;
      if (selectedLanguageOptions.find((option) => option.value === value)) {
        updatedLanguages = selectedLanguageOptions.filter(
          (option) => option.value !== value
        );
      } else {
        updatedLanguages = [...selectedLanguageOptions, selectedOption];
      }
      setSelectedLanguageOptions(updatedLanguages);
      input.value = updatedLanguages.map((option) => option.value).join(",");
    }
  };

  const handleRemoveLanguage = (value: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const updatedLanguages = selectedLanguageOptions.filter(
      (option) => option.value !== value
    );
    setSelectedLanguageOptions(updatedLanguages);
    input.value = updatedLanguages.map((option) => option.value).join(",");
  };

  return (
    <div>
      <Select onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-full bg-stone-100">
          <SelectValue placeholder="Select languages" />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedLanguageOptions.map((language) => (
          <div
            key={language.value}
            className="flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded"
          >
            {language.label}
            <button
              type="button"
              className="ml-1 text-red-500"
              onClick={() => handleRemoveLanguage(language.value)}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelect;
