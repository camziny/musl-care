import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AvailabilityTime } from '@/types/common';

interface AvailabilitySelectorProps {
  availability: AvailabilityTime[];
  availabilityType: string;
  onAvailabilityChange: (newAvailability: AvailabilityTime[]) => void;
  onAvailabilityTypeChange: (newType: string) => void;
  scrollRestoreEnabled?: boolean;
}

export const AvailabilitySelector = ({
  availability,
  availabilityType,
  onAvailabilityChange,
  onAvailabilityTypeChange,
  scrollRestoreEnabled = true
}: AvailabilitySelectorProps) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const scrollRef = useRef<number>(0);
  
  const [modalState, setModalState] = useState({
    showTimeModal: false,
    selectedDay: '',
  });
  
  const captureScrollPosition = () => {
    if (scrollRestoreEnabled) {
      scrollRef.current = window.scrollY;
    }
  };
  
  const formatTimeDisplay = (startTime: string, endTime: string) => {
    const formattedStart = formatTime(startTime).replace(':00', '');
    let formattedEnd = formatTime(endTime).replace(':00', '');
    
    if (endTime === "24:00") {
      formattedEnd = "Midnight";
    }
    
    return `${formattedStart} - ${formattedEnd}`;
  };
  
  const formatTime = (time: string) => {
    if (!time) return "";
    
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    
    if (hour === 0) return "12:00 AM (Midnight)";
    if (hour === 12) return "12:00 PM (Noon)";
    if (hour === 24) return "12:00 AM (Midnight)";
    
    return hour < 12 
      ? `${hour}:00 AM` 
      : `${hour - 12}:00 PM`;
  };
  
  const TimeSelectionModal = () => {
    const { selectedDay } = modalState;
    const existingTimeSlot = availability.find(a => a.day === selectedDay);
    
    const [localTimeSlot, setLocalTimeSlot] = useState({
      day: selectedDay,
      startTime: existingTimeSlot?.startTime || "",
      endTime: existingTimeSlot?.endTime || "",
      recurring: availabilityType === "Recurring"
    });
    
    const allTimeOptions = [
      ...Array.from({length: 24}).map((_, i) => `${i}:00`),
      "24:00"
    ];
    
    const endTimeOptions = localTimeSlot.startTime 
      ? allTimeOptions.filter(time => {
          const [startHours] = localTimeSlot.startTime.split(':');
          const [endHours] = time.split(':');
          
          if (endHours === "24") return true;
          
          return parseInt(endHours) > parseInt(startHours);
        })
      : allTimeOptions;
    
    const startTimeOptions = allTimeOptions.filter(time => time !== "24:00");
    
    useEffect(() => {
      if (localTimeSlot.startTime && localTimeSlot.endTime) {
        const [startHours] = localTimeSlot.startTime.split(':');
        const [endHours] = localTimeSlot.endTime.split(':');
        
        if (endHours !== "24" && parseInt(endHours) <= parseInt(startHours)) {
          setLocalTimeSlot(prev => ({...prev, endTime: ""}));
        }
      }
    }, [localTimeSlot.startTime, localTimeSlot.endTime]);
    
    const handleSave = () => {
      captureScrollPosition();
      
      const updatedAvailability = availability.filter(a => a.day !== selectedDay);
      if (localTimeSlot.startTime && localTimeSlot.endTime) {
        updatedAvailability.push(localTimeSlot);
      }
      
      onAvailabilityChange(updatedAvailability);
      setModalState(prev => ({...prev, showTimeModal: false}));
    };
    
    const canSave = (!localTimeSlot.startTime && !localTimeSlot.endTime) || 
                    (localTimeSlot.startTime && localTimeSlot.endTime);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-800">Set Hours for {selectedDay}</h3>
            <button
              onClick={() => setModalState(prev => ({...prev, showTimeModal: false}))}
              className="text-gray-400 hover:text-gray-600 text-2xl font-medium hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center"
            >
              ×
            </button>
          </div>
          
          {localTimeSlot.startTime && localTimeSlot.endTime && (
            <div className="mb-6 bg-slate-50 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-500 mb-1">Selected Schedule</div>
              <div className="text-lg font-semibold flex items-center justify-center space-x-3">
                <span className="bg-slate-800 text-white px-3 py-1 rounded">
                  {formatTime(localTimeSlot.startTime)}
                </span>
                <span className="text-gray-400">to</span>
                <span className="bg-slate-800 text-white px-3 py-1 rounded">
                  {formatTime(localTimeSlot.endTime)}
                </span>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <select
                    value={localTimeSlot.startTime}
                    onChange={(e) => {
                      setLocalTimeSlot(prev => ({...prev, startTime: e.target.value}));
                    }}
                    className="block w-full p-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500 appearance-none pr-8"
                  >
                    <option value="">Not Available</option>
                    {startTimeOptions.map(time => (
                      <option 
                        key={`start-${time}`} 
                        value={time}
                        className={localTimeSlot.startTime === time ? "font-bold bg-slate-100" : ""}
                      >
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <div className="relative">
                  <select
                    value={localTimeSlot.endTime}
                    onChange={(e) => {
                      setLocalTimeSlot(prev => ({...prev, endTime: e.target.value}));
                    }}
                    className={`
                      block w-full p-2.5 bg-white border border-gray-300 rounded-md shadow-sm 
                      focus:ring-slate-500 focus:border-slate-500 appearance-none pr-8
                      ${!localTimeSlot.startTime ? 'opacity-60 cursor-not-allowed' : ''}
                    `}
                    disabled={!localTimeSlot.startTime}
                  >
                    <option value="">Not Available</option>
                    {endTimeOptions.map(time => (
                      <option 
                        key={`end-${time}`} 
                        value={time}
                        className={localTimeSlot.endTime === time ? "font-bold bg-slate-100" : ""}
                      >
                        {formatTime(time)}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-3">
            <button
              onClick={() => setModalState(prev => ({...prev, showTimeModal: false}))}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`px-4 py-2 rounded-md text-white ${canSave ? 'bg-slate-800 hover:bg-slate-700' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Save
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
      
      <div className="mb-6">
        <h4 className="font-medium mb-3">Availability Type</h4>
        <div className="grid grid-cols-3 gap-2">
          {["Recurring", "One-time", "Long term"].map(type => (
            <motion.div
              key={type}
              onClick={() => {
                captureScrollPosition();
                onAvailabilityTypeChange(type);
              }}
              className={`
                flex items-center justify-center p-3 rounded-lg cursor-pointer
                transition-all duration-200 ease-in-out shadow-sm
                ${availabilityType === type 
                  ? 'bg-slate-800 text-white' 
                  : 'hover:bg-slate-50 border border-gray-200'}
              `}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {type}
            </motion.div>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="font-medium mb-3">Schedule</h4>
        <div className="rounded-lg overflow-hidden border border-gray-200 mb-4 shadow-sm">
          <div className="grid grid-cols-7 bg-slate-100">
            {days.map(day => (
              <div key={day} className="p-2 text-center font-medium border-b border-gray-200">
                {day.substring(0, 3)}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7">
            {days.map(day => {
              const timeSlot = availability.find(a => a.day === day);
              const isAvailable = timeSlot && timeSlot.startTime && timeSlot.endTime;
              
              return (
                <motion.div 
                  key={day} 
                  className={`
                    p-3 border-r border-b border-gray-200 last:border-r-0
                    ${isAvailable ? 'bg-slate-50' : ''}
                  `}
                  whileHover={{ backgroundColor: isAvailable ? "#f1f5f9" : "#f8fafc" }}
                >
                  {isAvailable ? (
                    <motion.button
                      onClick={() => {
                        captureScrollPosition();
                        setModalState(prev => ({...prev, showTimeModal: true, selectedDay: day}));
                      }}
                      className="w-full rounded-lg p-2 bg-slate-800 text-white hover:bg-slate-700 shadow-sm transition-all"
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="text-xs opacity-80">Available</div>
                      <div className="font-medium">
                        {formatTimeDisplay(timeSlot!.startTime, timeSlot!.endTime)}
                      </div>
                    </motion.button>
                  ) : (
                    <motion.button
                      onClick={() => {
                        captureScrollPosition();
                        setModalState(prev => ({...prev, showTimeModal: true, selectedDay: day}));
                      }}
                      className="w-full h-full min-h-[60px] rounded-lg border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all flex items-center justify-center"
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="text-sm">Set Hours</span>
                    </motion.button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div className="text-sm text-gray-500 italic mt-2 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Click on a day to set your available hours
        </div>
      </div>
      
      {modalState.showTimeModal && <TimeSelectionModal />}
    </div>
  );
}; 