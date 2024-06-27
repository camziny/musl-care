"use client";

import React, { useState, useEffect } from "react";
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
  selectedSect?: string;
}

const sectOptions: SectOption[] = [
  { value: "Sunni", label: "Sunni" },
  { value: "Shia", label: "Shia" },
  { value: "Sufi", label: "Sufi" },
  { value: "Ahmadiyya", label: "Ahmadiyya" },
];

const SectSelect: React.FC<SectSelectProps> = ({
  inputId,
  selectedSect = "",
}) => {
  const [selectedSectOption, setSelectedSectOption] =
    useState<SectOption | null>(null);

  useEffect(() => {
    const initialSelectedSect =
      sectOptions.find((option) => option.value === selectedSect) || null;
    setSelectedSectOption(initialSelectedSect);
  }, [selectedSect]);

  const handleSectChange = (value: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const selectedOption = sectOptions.find((option) => option.value === value);

    if (selectedOption) {
      setSelectedSectOption(selectedOption);
      input.value = selectedOption.value;
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
