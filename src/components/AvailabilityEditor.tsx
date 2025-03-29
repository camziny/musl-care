"use client";

import { AvailabilityTime } from "@/utils/types";
import { useState } from "react";

interface AvailabilityEditorProps {
  initialAvailability?: AvailabilityTime[];
}

export default function AvailabilityEditor({ initialAvailability = [] }: AvailabilityEditorProps) {
  const [availability, setAvailability] = useState<AvailabilityTime[]>(initialAvailability);
  
  const formatTimeDisplay = (time: string) => {
    if (!time) return "";
    const hour = parseInt(time.split(':')[0]);
    
    if (hour === 0 || hour === 24) return "12:00 AM";
    if (hour === 12) return "12:00 PM";
    return hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
  };

  const handleTimeChange = (day: string, field: 'startTime' | 'endTime', value: string) => {
    setAvailability(prev => {
      const newAvailability = [...prev];
      const dayIndex = newAvailability.findIndex(a => a.day === day);
      
      if (dayIndex >= 0) {
        newAvailability[dayIndex] = {
          ...newAvailability[dayIndex],
          [field]: value
        };
      } else if (value) {
        newAvailability.push({
          day,
          startTime: field === 'startTime' ? value : "",
          endTime: field === 'endTime' ? value : "",
          recurring: true
        });
      }
      
      return newAvailability;
    });
  };

  const getTimeValue = (day: string, field: 'startTime' | 'endTime'): string => {
    const dayData = availability.find(a => a.day === day);
    return dayData ? dayData[field] || "" : "";
  };

  const daysOfWeek = [
    "Monday", "Tuesday", "Wednesday", "Thursday", 
    "Friday", "Saturday", "Sunday"
  ];

  return (
    <div>
      <h3 className="font-medium text-gray-700 mb-3">Weekly Schedule</h3>
      
      <div className="space-y-6">
        {daysOfWeek.map(day => {
          const timeSlot = availability.find(a => a.day === day);
          const hasTimeSlot = timeSlot && timeSlot.startTime && timeSlot.endTime;
          
          return (
            <div key={day} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{day}</h4>
                {hasTimeSlot && (
                  <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    {formatTimeDisplay(timeSlot.startTime)} - {formatTimeDisplay(timeSlot.endTime)}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <select
                    value={getTimeValue(day, 'startTime')}
                    onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                    className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Not Available</option>
                    {Array.from({length: 24}).map((_, i) => (
                      <option key={`start-${i}`} value={`${i}:00`}>
                        {i === 0 ? "12:00 AM (Midnight)" :
                         i === 12 ? "12:00 PM (Noon)" :
                         i < 12 ? `${i}:00 AM` : `${i-12}:00 PM`}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <select
                    value={getTimeValue(day, 'endTime')}
                    onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                    className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Not Available</option>
                    {Array.from({length: 24}).map((_, i) => (
                      <option key={`end-${i}`} value={`${i+1}:00`}>
                        {i+1 === 24 ? "12:00 AM (Midnight)" :
                         i+1 === 12 ? "12:00 PM (Noon)" :
                         i+1 < 12 ? `${i+1}:00 AM` : `${i+1-12}:00 PM`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <input 
        type="hidden" 
        id="availability" 
        name="availability" 
        value={JSON.stringify(availability)}
      />
    </div>
  );
} 