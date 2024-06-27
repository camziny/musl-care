"use client";

import React, { useState, useEffect } from "react";
import { Availability, DayAvailability } from "@/utils/types";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const timesOfDay = ["Morning", "Afternoon", "Evening", "Night"];

interface AvailabilitySelectProps {
  inputId: string;
  selectedAvailability?: Availability;
}

const SelectAvailability: React.FC<AvailabilitySelectProps> = ({
  inputId,
  selectedAvailability = [],
}) => {
  const [availability, setAvailability] = useState<Record<string, string[]>>(
    {}
  );

  useEffect(() => {
    const initialAvailability = selectedAvailability.reduce(
      (acc, { day, times }) => ({ ...acc, [day]: times }),
      {}
    );
    setAvailability(initialAvailability);
  }, [selectedAvailability]);

  const handleDayChange = (day: string, selectedTimes: string[]) => {
    const newAvailability = { ...availability, [day]: selectedTimes };
    setAvailability(newAvailability);

    const availabilityArray = Object.keys(newAvailability).map((day) => ({
      day,
      times: newAvailability[day],
    }));

    const input = document.getElementById(inputId) as HTMLInputElement;
    input.value = JSON.stringify(availabilityArray);
  };

  return (
    <div>
      {daysOfWeek.map((day) => (
        <DayAvailabilitySelect
          key={day}
          day={day}
          onChange={handleDayChange}
          selectedAvailability={selectedAvailability}
        />
      ))}
    </div>
  );
};

interface DayAvailabilitySelectProps {
  day: string;
  onChange: (day: string, selectedTimes: string[]) => void;
  selectedAvailability: Availability;
}

const DayAvailabilitySelect: React.FC<DayAvailabilitySelectProps> = ({
  day,
  onChange,
  selectedAvailability,
}) => {
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);

  useEffect(() => {
    const initialTimes =
      selectedAvailability.find((avail: DayAvailability) => avail.day === day)
        ?.times || [];
    setSelectedTimes(initialTimes);
  }, [day, selectedAvailability]);

  const handleTimeChange = (time: string) => {
    const newSelectedTimes = selectedTimes.includes(time)
      ? selectedTimes.filter((t) => t !== time)
      : [...selectedTimes, time];
    setSelectedTimes(newSelectedTimes);
    onChange(day, newSelectedTimes);
  };

  return (
    <div className="my-2 p-4 border rounded-lg shadow-sm bg-white">
      <div className="font-medium mb-2">{day}</div>
      <div className="flex flex-wrap gap-2">
        {timesOfDay.map((time) => (
          <label
            key={time}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <input
              type="checkbox"
              value={time}
              checked={selectedTimes.includes(time)}
              onChange={() => handleTimeChange(time)}
              className="hidden"
            />
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full border ${
                selectedTimes.includes(time)
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              {selectedTimes.includes(time) && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              )}
            </div>
            <span>{time}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default SelectAvailability;
