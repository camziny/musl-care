"use client";

import React, { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCountries } from "@/utils/fethCountries";

interface EthnicBackgroundSelectProps {
  inputId: string;
}

const EthnicBackgroundSelect: React.FC<EthnicBackgroundSelectProps> = ({
  inputId,
}) => {
  const [ethnicBackgroundOptions, setEthnicBackgroundOptions] = useState<any[]>(
    []
  );
  const [selectedOptions, setSelectedOptions] = useState<any[]>([]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const countries = await getCountries();
        setEthnicBackgroundOptions(countries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    loadCountries();
  }, []);

  const handleSelectChange = (value: string) => {
    const selectedOption = ethnicBackgroundOptions.find(
      (option) => option.value === value
    );
    if (selectedOption && !selectedOptions.includes(selectedOption)) {
      const updatedOptions = [...selectedOptions, selectedOption];
      setSelectedOptions(updatedOptions);

      const input = document.getElementById(inputId) as HTMLInputElement;
      input.value = updatedOptions.map((option) => option.value).join(",");
    }
  };

  const handleRemoveOption = (optionToRemove: any) => {
    const updatedOptions = selectedOptions.filter(
      (option) => option.value !== optionToRemove.value
    );
    setSelectedOptions(updatedOptions);

    const input = document.getElementById(inputId) as HTMLInputElement;
    input.value = updatedOptions.map((option) => option.value).join(",");
  };

  return (
    <div>
      <Select onValueChange={handleSelectChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select ethnic backgrounds" />
        </SelectTrigger>
        <SelectContent>
          {ethnicBackgroundOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <img
                src={option.flag}
                alt={option.label}
                className="inline-block w-5 h-5 mr-2"
              />
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="mt-2">
        {selectedOptions.map((option) => (
          <span
            key={option.value}
            className="inline-flex items-center bg-gray-200 text-gray-700 rounded-full px-3 py-1 m-1 text-sm font-semibold"
          >
            <img
              src={option.flag}
              alt={option.label}
              className="inline-block w-4 h-4 mr-1"
            />
            {option.label}
            <button
              onClick={() => handleRemoveOption(option)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default EthnicBackgroundSelect;
