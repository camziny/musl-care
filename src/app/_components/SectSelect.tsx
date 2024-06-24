"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SectOption {
  value: string;
  label: string;
}

interface SectSelectProps {
  inputId: string;
}

const sectOptions: SectOption[] = [
  { value: "Sunni", label: "Sunni" },
  { value: "Shia", label: "Shia" },
  { value: "Sufi", label: "Sufi" },
  { value: "Ahmadiyya", label: "Ahmadiyya" },
];

const SectSelect: React.FC<SectSelectProps> = ({ inputId }) => {
  const [selectedSect, setSelectedSect] = useState<SectOption | null>(null);

  const handleSectChange = (value: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    if (input) {
      const selectedOption = sectOptions.find(
        (option) => option.value === value
      );
      if (selectedOption) {
        setSelectedSect(selectedOption);
        input.value = selectedOption.value;
      }
    }
  };

  return (
    <div>
      <Select onValueChange={handleSectChange}>
        <SelectTrigger className="w-full bg-stone-100">
          <SelectValue placeholder="Select sect" />
        </SelectTrigger>
        <SelectContent>
          {sectOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SectSelect;
