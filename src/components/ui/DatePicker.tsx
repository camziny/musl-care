"use client";
import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DatePickerProps {
  startDateInputId: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ startDateInputId }) => {
  const [startDate, setStartDate] = React.useState<Date | null>(new Date());
  React.useEffect(() => {
    const input = document.querySelector(`input[name="${startDateInputId}"]`) as HTMLInputElement | null;
    if (input && startDate) input.value = startDate.toISOString();
  }, [startDate, startDateInputId]);

  return (
    <div>
      <input type="hidden" name={startDateInputId} />
      <ReactDatePicker selected={startDate} onChange={(date) => setStartDate(date as Date)} className="border rounded px-3 py-2" />
    </div>
  );
};

export default DatePicker;
