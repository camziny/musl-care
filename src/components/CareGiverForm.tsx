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
import { useUploadThing } from "@/utils/uploadthing";
import { toast } from "sonner";

interface FormData {
  name: string;
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
    name: "",
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

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

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
      formData.name.trim().length > 0 &&
      formData.careType &&
      formData.religion &&
      (formData.religion !== "Muslim" || formData.muslimSect) &&
      formData.ethnicity &&
      formData.languages.length > 0 &&
      formData.agesServed.length > 0 &&
      formData.careCapacity &&
      formData.termOfCare &&
      (formData.profilePicture || uploadedImageUrl) &&
      formData.hourlyRate &&
      formData.yearsExperience &&
      formData.aboutMe.trim().length > 0 &&
      formData.availability.length > 0 &&
      formData.availabilityType
    );
  };

  const handleSubmit = async () => {
    if (isFormComplete()) {
      try {
        const { submitCaregiverForm } = await import('@/app/actions/caregiver');
        
        const result = await submitCaregiverForm({
          userType: 'caregiver',
          name: formData.name, 
          description: formData.aboutMe,
          image: {
            url: uploadedImageUrl || (formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : ''),
            alt: 'Profile picture'
          },
          phoneNumber: '', 
          address: '',
          city: '',
          state: '',
          postalCode: '',
          country: '',
          subscribed: false,
          
          languages: formData.languages,
          sect: '',
          ethnicBackground: [formData.ethnicity],
          
          careType: formData.careType,
          religion: formData.religion,
          muslimSect: formData.religion === 'Muslim' ? formData.muslimSect : undefined,
          agesServed: formData.agesServed,
          careCapacity: formData.careCapacity,
          termOfCare: formData.termOfCare,
          
          hourlyRateMin: formData.hourlyRate?.min || 0,
          hourlyRateMax: formData.hourlyRate?.max || 0,
          yearsExperience: formData.yearsExperience,
          aboutMe: formData.aboutMe,
          
          availability: formData.availability,
          availabilityType: formData.availabilityType,
          
          canCook: formData.canCook,
          hasTransportation: formData.hasTransportation,
          canShopErrands: formData.canShopErrands,
          canHelpWithPets: formData.canHelpWithPets,
          canClean: formData.canClean,
          canOrganize: formData.canOrganize,
          canTutor: formData.canTutor,
          canPack: formData.canPack,
          canMealPrep: formData.canMealPrep,
          
          isVaccinated: formData.isVaccinated,
          isSmoker: formData.isSmoker,
          professionalSkills: formData.professionalSkills,
          
          backgroundChecked: false,
        });
        
        if (result.success) {
          window.location.href = '/background-check';
        } else {
          alert(`Error: ${result.error || 'Something went wrong'}`);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('Failed to submit form. Please try again.');
      }
    }
  };

  const calculateCompletedSteps = () => {
    const steps = [
      formData.name.trim().length > 0,
      formData.careType !== "",
      formData.religion !== "",
      formData.religion === "Muslim" ? formData.muslimSect !== "" : true,
      formData.ethnicity !== "",
      formData.languages.length > 0,
      formData.agesServed.length > 0,
      formData.careCapacity !== "",
      formData.termOfCare !== "",
      formData.profilePicture !== null || uploadedImageUrl !== "",
      formData.hourlyRate !== null,
      formData.yearsExperience !== null,
      formData.aboutMe.trim().length > 0,
      formData.availability.length > 0,
      formData.availabilityType !== ""
    ];

    return steps.filter(Boolean).length;
  };

  const totalSteps = formData.religion === "Muslim" ? 16 : 15;
  const completedSteps = calculateCompletedSteps();

  const ProfilePictureUpload = () => {
    const { startUpload, isUploading } = useUploadThing("imageUploader", {
      onClientUploadComplete: (result) => {
        console.log("Upload complete:", result);
        if (result && result.length > 0) {
          const uploadedUrl = result[0].url;
          setUploadedImageUrl(uploadedUrl);
          toast.success("Profile picture uploaded successfully");
        }
      },
      onUploadError: (error) => {
        console.error("Upload error:", error);
        toast.error("Upload failed. Please try again.");
      },
    });

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files || e.target.files.length === 0) return;
      
      try {
        const file = e.target.files[0];
        setFormData(prev => ({...prev, profilePicture: file}));
        await startUpload([file]);
      } catch (error) {
        console.error("Error during file upload:", error);
      }
    };

    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
        <div className="flex flex-col items-center">
          {(uploadedImageUrl || formData.profilePicture) ? (
            <div className="mb-4 relative">
              <Image 
                src={uploadedImageUrl || (formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : '')} 
                alt="Profile preview" 
                width={128}
                height={128}
                className="rounded-full object-cover"
              />
              <button
                onClick={() => {
                  setFormData(prev => ({...prev, profilePicture: null}));
                  setUploadedImageUrl("");
                }}
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
          
          <label className="cursor-pointer bg-slate-800 text-white px-4 py-2 rounded hover:bg-slate-700 flex items-center">
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </>
            ) : (
              'Upload Photo'
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>
    );
  };
  
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
                          scrollRef.current = window.scrollY;
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

  const NameField = () => {
    return (
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Name</h3>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => safeSetFormData(prev => ({...prev, name: e.target.value}))}
          placeholder="Enter your full name"
          className="w-full px-3 py-2 border rounded focus:ring-slate-500 focus:border-slate-500"
        />
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm py-8">
      <div className="sticky top-0 z-10 py-4 px-6 bg-white border-b mb-6">
        <FormProgress
          totalSteps={totalSteps}
          completedSteps={completedSteps}
        />
      </div>
      
      <div className="px-6 space-y-6">
        <NameField />
        <ProfilePictureUpload />
        
        <SelectionList
          title="Type of Care"
          options={['Child Care', 'Elderly Care', 'Both'].sort()}
          selected={formData.careType}
          onSelect={(value) => safeSetFormData(prev => ({...prev, careType: value as CareType}))}
        />
        
        <SelectionList
          title="Religious Background"
          options={RELIGIONS.sort()}
          selected={formData.religion}
          onSelect={(value) => safeSetFormData(prev => ({
            ...prev, 
            religion: value as Religion,
            muslimSect: value === 'Muslim' ? prev.muslimSect : ''
          }))}
        />
        
        {formData.religion === 'Muslim' && (
          <SelectionList
            title="Muslim Sect"
            options={MUSLIM_SECTS.sort()}
            selected={formData.muslimSect}
            onSelect={(value) => safeSetFormData(prev => ({...prev, muslimSect: value as MuslimSect}))}
          />
        )}
        
        <SelectionList
          title="Ethnic Background"
          options={ETHNICITIES.sort()}
          selected={formData.ethnicity}
          onSelect={(value) => safeSetFormData(prev => ({...prev, ethnicity: value}))}
        />
        
        <SelectionList
          title="Languages Spoken"
          options={LANGUAGES.sort()}
          selected={formData.languages}
          onSelect={(value) => {
            safeSetFormData(prev => {
              const newLanguages = prev.languages.includes(value)
                ? prev.languages.filter(lang => lang !== value)
                : [...prev.languages, value];
              return {...prev, languages: newLanguages};
            });
          }}
          multiSelect={true}
        />
        
        <SelectionList
          title="Ages You Can Serve"
          options={AGE_RANGES}
          selected={formData.agesServed}
          onSelect={(value) => {
            safeSetFormData(prev => {
              const newAges = prev.agesServed.includes(value)
                ? prev.agesServed.filter(age => age !== value)
                : [...prev.agesServed, value];
              return {...prev, agesServed: newAges};
            });
          }}
          multiSelect={true}
        />
        
        <SelectionList
          title="Care Capacity"
          options={['Only one', 'Multiple'].sort()}
          selected={formData.careCapacity}
          onSelect={(value) => safeSetFormData(prev => ({...prev, careCapacity: value as CareCapacity}))}
        />
        
        <SelectionList
          title="Term of Care"
          options={['Long term caregiver', 'Short term caregiver'].sort()}
          selected={formData.termOfCare}
          onSelect={(value) => safeSetFormData(prev => ({...prev, termOfCare: value as CareTerm}))}
        />
        
        <ProfessionalInfo />
        <AboutMe />
        <AvailabilitySection />
        <AdditionalServices />
        <HealthAndSkills />
        
        <div className="pt-4 pb-8">
          <button
            onClick={handleSubmit}
            disabled={!isFormComplete()}
            className={`
              w-full py-3 px-6 rounded-lg text-white font-medium
              ${isFormComplete() 
                ? 'bg-slate-800 hover:bg-slate-900' 
                : 'bg-slate-400 cursor-not-allowed'}
            `}
          >
            {isFormComplete() ? 'Complete Profile' : 'Please fill all required fields'}
          </button>
          
          {!isFormComplete() && (
            <p className="text-sm text-center mt-2 text-red-500">
              {`${completedSteps} of ${totalSteps} sections completed`}
            </p>
          )}
        </div>
      </div>

      {modalState.showTimeModal && <TimeSelectionModal />}
    </div>
  );
}