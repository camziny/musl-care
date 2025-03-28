"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FormProgress } from "@/components/ui/FormProgress";
import { 
  CareType, 
  Religion, 
  MuslimSect, 
  CareCapacity, 
  AvailabilityTime, 
  ProfessionalSkills, 
  AvailabilityType,
  CareTerm,
  RELIGIONS,
  MUSLIM_SECTS,
  ETHNICITIES,
  LANGUAGES,
  COUNTRIES,
  AGE_RANGES
} from "@/types/caregivers";
import Image from "next/image";

interface FormData {
  careType: CareType | "";
  religion: Religion | "";
  muslimSect: MuslimSect | "";
  ethnicity: string;
  languages: string[];
  country: string;
  agesServed: string[];
  careCapacity: CareCapacity | "";
  termOfCare: CareTerm | "";
  
  hourlyRate: { min: number; max: number } | null;
  yearsExperience: number | null;
  profilePicture: File | null;
  aboutMe: string;
  availability: AvailabilityTime[];
  availabilityType: AvailabilityType;
  
  canCook: boolean;
  hasTransportation: boolean;
  canShopErrands: boolean;
  canHelpWithPets: boolean;
  canClean: boolean;
  canOrganize: boolean;
  canTutor: boolean;
  canPack: boolean;
  canMealPrep: boolean;
  
  isVaccinated: boolean;
  isSmoker: boolean;
  professionalSkills: ProfessionalSkills;
}

declare global {
  interface Window {
    scrollTimer: ReturnType<typeof setTimeout>;
  }
}

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
    termOfCare: "",
    
    hourlyRate: null,
    yearsExperience: null,
    profilePicture: null,
    aboutMe: "",
    availability: [],
    availabilityType: "",
    
    canCook: false,
    hasTransportation: false,
    canShopErrands: false,
    canHelpWithPets: false,
    canClean: false,
    canOrganize: false,
    canTutor: false,
    canPack: false,
    canMealPrep: false,
    
    isVaccinated: false,
    isSmoker: false,
    professionalSkills: {
      firstAidTraining: false,
      cprTraining: false,
      specialNeedsCare: false,
    }
  });

  const [showBackgroundCheckModal, setShowBackgroundCheckModal] = useState(false);

  const scrollRef = useRef<number>(0);
  const isScrollingRef = useRef<boolean>(false);
  
  const captureScrollPosition = () => {
    if (!isScrollingRef.current) {
      scrollRef.current = window.scrollY;
    }
  };
  
  const restoreScrollPosition = () => {
    if (scrollRef.current > 0) {
      isScrollingRef.current = true;
      window.scrollTo(0, scrollRef.current);
      
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    }
  };
  
  const safeSetFormData = (updater: React.SetStateAction<FormData>) => {
    captureScrollPosition();
    setFormData(updater);
    setTimeout(restoreScrollPosition, 0);
  };
  
  useEffect(() => {
    const handleScroll = () => {
      isScrollingRef.current = true;
      clearTimeout(window.scrollTimer);
      window.scrollTimer = setTimeout(() => {
        isScrollingRef.current = false;
      }, 100);
    };
    
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', captureScrollPosition);
    
    return () => {
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', captureScrollPosition);
    };
  }, []);
  
  useEffect(() => {
    restoreScrollPosition();
  }, [formData]);

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

    const handleSelect = (value: string) => {
      captureScrollPosition();
      onSelect(value);
      setTimeout(restoreScrollPosition, 0);
    };

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
                    captureScrollPosition();
                    handleSelect(item);
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
                onClick={() => handleSelect(option)}
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
      formData.termOfCare &&
      formData.profilePicture &&
      formData.hourlyRate &&
      formData.yearsExperience &&
      formData.aboutMe.trim().length > 0 &&
      formData.availability.length > 0 &&
      formData.availabilityType
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
      formData.termOfCare !== "",
      formData.profilePicture !== null,
      formData.hourlyRate !== null,
      formData.yearsExperience !== null,
      formData.aboutMe.trim().length > 0,
      formData.availability.length > 0,
      formData.availabilityType !== ""
    ];

    return steps.filter(Boolean).length;
  };

  const totalSteps = formData.religion === "Muslim" ? 15 : 14;
  const completedSteps = calculateCompletedSteps();

  const ProfilePictureUpload = () => (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
      <div className="flex flex-col items-center">
        {formData.profilePicture ? (
          <div className="mb-4 relative">
            <Image 
              src={URL.createObjectURL(formData.profilePicture)} 
              alt="Profile preview" 
              width={128}
              height={128}
              className="rounded-full object-cover"
            />
            <button
              onClick={() => setFormData(prev => ({...prev, profilePicture: null}))}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        
        <label className="cursor-pointer bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFormData(prev => ({...prev, profilePicture: e.target.files![0]}));
              }
            }}
          />
        </label>
      </div>
    </div>
  );
  
  const ProfessionalInfo = () => {
    const [rateInput, setRateInput] = useState({
      min: formData.hourlyRate?.min?.toString() || '',
      max: formData.hourlyRate?.max?.toString() || ''
    });
    
    const handleRateBlur = () => {
      const min = rateInput.min ? parseInt(rateInput.min) : 0;
      const max = rateInput.max ? parseInt(rateInput.max) : 0;
      
      setFormData(prev => ({
        ...prev,
        hourlyRate: { min, max }
      }));
    };
    
    const [yearsExp, setYearsExp] = useState(formData.yearsExperience?.toString() || '');
    
    const handleYearsExpBlur = () => {
      const value = yearsExp ? parseInt(yearsExp) : null;
      safeSetFormData(prev => ({...prev, yearsExperience: value}));
    };
    
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">Professional Information</h3>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hourly Rate Range
          </label>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Min"
                value={rateInput.min}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setRateInput(prev => ({ ...prev, min: value }));
                }}
                onBlur={handleRateBlur}
                className="pl-8 w-24 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
            
            <span className="text-gray-500 font-medium">to</span>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Max"
                value={rateInput.max}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setRateInput(prev => ({ ...prev, max: value }));
                }}
                onBlur={handleRateBlur}
                className="pl-8 w-24 py-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500"
              />
            </div>
            
            <span className="text-gray-500">per hour</span>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          <div className="flex items-center">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={yearsExp}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                setYearsExp(value);
              }}
              onBlur={handleYearsExpBlur}
              className="w-24 py-2.5 px-3 text-center border border-gray-300 rounded-md shadow-sm focus:ring-slate-500 focus:border-slate-500"
            />
            <span className="text-gray-500 ml-3">years</span>
          </div>
        </div>
      </div>
    );
  };
  
  const AboutMe = () => {
    const [localAboutMe, setLocalAboutMe] = useState(formData.aboutMe);
    
    const handleBlur = () => {
      safeSetFormData(prev => ({...prev, aboutMe: localAboutMe}));
    };
    
    useEffect(() => {
      const timer = setTimeout(() => {
        safeSetFormData(prev => {
          if (prev.aboutMe !== localAboutMe) {
            return {...prev, aboutMe: localAboutMe};
          }
          return prev;
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }, [localAboutMe]);
    
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
        <textarea
          placeholder="Write a description about yourself and what makes you qualified..."
          value={localAboutMe}
          onChange={(e) => setLocalAboutMe(e.target.value)}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border rounded h-40 resize-none focus:ring-slate-500 focus:border-slate-500"
        />
        <div className="text-xs text-gray-500 mt-2 flex justify-end">
          {localAboutMe.length} characters
        </div>
      </div>
    );
  };
  
  const AvailabilitySection = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    const formatTimeDisplay = (startTime: string, endTime: string) => {
      const formattedStart = formatTime(startTime).replace(':00', '');
      let formattedEnd = formatTime(endTime).replace(':00', '');
      
      if (endTime === "24:00") {
        formattedEnd = "Midnight";
      }
      
      return `${formattedStart} - ${formattedEnd}`;
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
                  scrollRef.current = window.scrollY;
                  setFormData(prev => ({...prev, availabilityType: type as any}));
                }}
                className={`
                  flex items-center justify-center p-3 rounded-lg cursor-pointer
                  transition-all duration-200 ease-in-out shadow-sm
                  ${formData.availabilityType === type 
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
                const timeSlot = formData.availability.find(a => a.day === day);
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
                          scrollRef.current = window.scrollY;
                          const newModal = {...modalState, showTimeModal: true, selectedDay: day};
                          setModalState(newModal);
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
                          scrollRef.current = window.scrollY;
                          const newModal = {...modalState, showTimeModal: true, selectedDay: day};
                          setModalState(newModal);
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
      </div>
    );
  };
  
  const AdditionalServices = () => {
    const services = [
      { key: 'canCook', label: 'Cooking', icon: '🍳' },
      { key: 'hasTransportation', label: 'Reliable Transportation', icon: '🚗' },
      { key: 'canShopErrands', label: 'Grocery Shopping/Errands', icon: '🛒' },
      { key: 'canHelpWithPets', label: 'Help with Pets', icon: '🐾' },
      { key: 'canClean', label: 'Cleaning', icon: '🧹' },
      { key: 'canOrganize', label: 'Organizing', icon: '📦' },
      { key: 'canTutor', label: 'Tutoring', icon: '📚' },
      { key: 'canPack', label: 'Packing', icon: '📦' },
      { key: 'canMealPrep', label: 'Meal Prep', icon: '🥗' },
    ];
    
    const selectedCount = services.filter(service => 
      formData[service.key as keyof typeof formData]
    ).length;
    
    const handleServiceToggle = (key: string) => {
      captureScrollPosition();
      safeSetFormData(prev => ({...prev, [key]: !prev[key as keyof typeof prev]}));
    };
    
    return (
      <div className="bg-white rounded-lg border p-6">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-gray-900">Additional Services</h3>
          {selectedCount > 0 && (
            <span className="bg-slate-800 text-white text-sm px-3 py-1 rounded-full">
              {selectedCount} selected
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map(service => (
            <motion.div 
              key={service.key} 
              onClick={() => handleServiceToggle(service.key)}
              className={`
                flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                ${formData[service.key as keyof typeof formData] 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'border border-gray-200 hover:bg-slate-50'}
              `}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-3 text-xl">{service.icon}</span>
              <span className="flex-1">{service.label}</span>
              {formData[service.key as keyof typeof formData] && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
  const HealthAndSkills = () => {
    const healthOptions = [
      { key: 'isVaccinated', label: 'Vaccinated', icon: '💉' },
      { key: 'isSmoker', label: 'Smoker', icon: '🚬', reversed: true },
    ];
    
    const skillOptions = [
      { key: 'firstAidTraining', label: 'First Aid Training', icon: '🩹' },
      { key: 'cprTraining', label: 'CPR Training', icon: '❤️' },
      { key: 'specialNeedsCare', label: 'Special Needs Care', icon: '🧩' },
    ];
    
    const selectedSkillsCount = Object.values(formData.professionalSkills).filter(Boolean).length;
    
    const handleHealthOptionToggle = (key: string) => {
      captureScrollPosition();
      
      if (key === 'isSmoker') {
        safeSetFormData(prev => ({...prev, isSmoker: !prev.isSmoker}));
      } else if (key === 'isVaccinated') {
        safeSetFormData(prev => ({...prev, isVaccinated: !prev.isVaccinated}));
      }
    };
    
    const handleSkillToggle = (key: string) => {
      captureScrollPosition();
      
      safeSetFormData(prev => ({
        ...prev, 
        professionalSkills: {
          ...prev.professionalSkills,
          [key]: !prev.professionalSkills[key as keyof typeof prev.professionalSkills]
        }
      }));
    };
    
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-5">Health & Professional Skills</h3>
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Health Information</h4>
          </div>
          
          <div className="space-y-3">
            {healthOptions.map(option => {
              const isSelected = option.key === 'isSmoker' 
                ? formData.isSmoker 
                : option.key === 'isVaccinated' 
                  ? formData.isVaccinated 
                  : false;
              
              return (
                <motion.div
                  key={option.key}
                  onClick={() => handleHealthOptionToggle(option.key)}
                  className={`
                    flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                    ${isSelected
                      ? 'bg-slate-800 text-white shadow-md' 
                      : 'border border-gray-200 hover:bg-slate-50'}
                  `}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-3 text-xl">{option.icon}</span>
                  <span className="flex-1">{option.label}</span>
                  
                  {option.key === 'isSmoker' && (
                    <div className="text-sm rounded-full px-3 py-1 bg-opacity-80">
                      {isSelected ? 'Smoker' : 'Non-Smoker'}
                    </div>
                  )}
                  
                  {isSelected && option.key !== 'isSmoker' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Professional Skills</h4>
            {selectedSkillsCount > 0 && (
              <span className="bg-slate-800 text-white text-sm px-3 py-1 rounded-full">
                {selectedSkillsCount} selected
              </span>
            )}
          </div>
          
          <div className="space-y-3">
            {skillOptions.map(skill => (
              <motion.div 
                key={skill.key}
                onClick={() => handleSkillToggle(skill.key)}
                className={`
                  flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${formData.professionalSkills[skill.key as keyof typeof formData.professionalSkills]
                    ? 'bg-slate-800 text-white shadow-md' 
                    : 'border border-gray-200 hover:bg-slate-50'}
                `}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="mr-3 text-xl">{skill.icon}</span>
                <span className="flex-1">{skill.label}</span>
                {formData.professionalSkills[skill.key as keyof typeof formData.professionalSkills] && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-slate-800 shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const [modalState, setModalState] = useState({
    showTimeModal: false,
    selectedDay: '',
  });

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
    const existingTimeSlot = formData.availability.find(a => a.day === selectedDay);
    
    const [localTimeSlot, setLocalTimeSlot] = useState({
      day: selectedDay,
      startTime: existingTimeSlot?.startTime || "",
      endTime: existingTimeSlot?.endTime || "",
      recurring: formData.availabilityType === "Recurring"
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
      scrollRef.current = window.scrollY;
      
      const updatedAvailability = formData.availability.filter(a => a.day !== selectedDay);
      if (localTimeSlot.startTime && localTimeSlot.endTime) {
        updatedAvailability.push(localTimeSlot);
      }
      
      setFormData(prev => ({...prev, availability: updatedAvailability}));
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
                      <option key={`start-${time}`} value={time}>{formatTime(time)}</option>
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
                    <option value="">Select End Time</option>
                    {endTimeOptions.map(time => (
                      <option key={`end-${time}`} value={time}>{formatTime(time)}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                {!localTimeSlot.startTime && (
                  <p className="mt-1 text-xs text-gray-500">Select a start time first</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer" 
                 onClick={() => setLocalTimeSlot(prev => ({...prev, startTime: "", endTime: ""}))}>
              <input
                type="checkbox"
                id="not-available"
                checked={!localTimeSlot.startTime && !localTimeSlot.endTime}
                onChange={(e) => {
                  if (e.target.checked) {
                    setLocalTimeSlot(prev => ({...prev, startTime: "", endTime: ""}));
                  }
                }}
                className="h-4 w-4 text-slate-800 focus:ring-slate-500 border-gray-300 rounded"
              />
              <label htmlFor="not-available" className="ml-2 text-sm text-gray-600 cursor-pointer">
                Not available on this day
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => setModalState(prev => ({...prev, showTimeModal: false}))}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className={`
                px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500
                ${canSave 
                  ? 'bg-slate-800 hover:bg-slate-700' 
                  : 'bg-gray-300 cursor-not-allowed'}
              `}
            >
              Save
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <FormProgress totalSteps={totalSteps} completedSteps={completedSteps} />
      
      <div className="space-y-6">
        <ProfilePictureUpload />
        <ProfessionalInfo />
        <AboutMe />
        
        <SelectionList
          title="What type of care do you provide?"
          options={["Child Care", "Elderly Care", "Both"]}
          selected={formData.careType}
          onSelect={(value) => setFormData(prev => ({ ...prev, careType: value as CareType }))}
        />

        <AvailabilitySection />
        
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
        
        <AdditionalServices />
        <HealthAndSkills />

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
          title="How many individuals can you care for at once?"
          options={["Only one", "Multiple"]}
          selected={formData.careCapacity}
          onSelect={(value) => setFormData(prev => ({ ...prev, careCapacity: value as CareCapacity }))}
        />

        <SelectionList
          title="Type of Care Commitment"
          options={["Long term caregiver", "Short term caregiver"]}
          selected={formData.termOfCare}
          onSelect={(value) => setFormData(prev => ({ ...prev, termOfCare: value as CareTerm }))}
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
                onClick={() => {}}
                className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700"
              >
                Proceed to Background Check
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {modalState.showTimeModal && <TimeSelectionModal />}
    </div>
  );
}
