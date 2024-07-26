"use client";
import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  startDateInputId: string;
  endDateInputId?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({
  startDateInputId,
  endDateInputId,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleDateChange = (
    dates: [Date | null, Date | null] | Date | null
  ) => {
    if (Array.isArray(dates)) {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);

      const startDateInput = document.getElementById(
        startDateInputId
      ) as HTMLInputElement;
      const endDateInput = endDateInputId
        ? (document.getElementById(endDateInputId) as HTMLInputElement)
        : null;

      if (startDateInput) {
        startDateInput.value = start ? start.toISOString() : "";
      }
      if (endDateInput) {
        endDateInput.value = end ? end.toISOString() : "";
      }
    } else {
      setStartDate(dates);

      const startDateInput = document.getElementById(
        startDateInputId
      ) as HTMLInputElement;
      if (startDateInput) {
        startDateInput.value = dates ? dates.toISOString() : "";
      }
    }
  };

  return (
    <div>
      {endDateInputId ? (
        <ReactDatePicker
          selected={startDate || undefined}
          onChange={handleDateChange}
          startDate={startDate || undefined}
          endDate={endDate || undefined}
          selectsRange
          isClearable
          placeholderText="Select a date range"
          className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <ReactDatePicker
          selected={startDate || undefined}
          onChange={handleDateChange}
          isClearable
          placeholderText="Select a date"
          className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
};

export default DatePicker;
