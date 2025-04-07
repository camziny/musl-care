"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormProgress } from "@/components/ui/FormProgress";
import { ServiceRequirements, ProfessionalSkills, AvailabilityTime, CareType, Religion, RELIGIONS, ETHNICITIES, LANGUAGES, COUNTRIES, AGE_RANGES } from '@/types/common';
import { AvailabilitySelector } from '@/components/ui/AvailabilitySelector';
import { toast } from 'sonner';
import { useUploadThing } from "@/utils/uploadthing";
import Image from "next/image";

interface FormData {
  guardianImage: string;
  childrenImages: string[];
  phoneNumber: string;
  email: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isBackgroundChecked: boolean;
  careType: CareType | "";
  religion: Religion | "";
  ethnicities: string[];
  languages: string[];
  countries: string[];
  numberOfPeople: number;
  agesOfPeople: string[];
  availabilityType: "Recurring" | "One-time" | "Long term" | "";
  availability: AvailabilityTime[];
  serviceRequirements: ServiceRequirements;
  petDetails: { type: string; description: string; }[];
  requiredProfessionalSkills: ProfessionalSkills;
}

export default function LookingForCare() {
  const [formData, setFormData] = useState<FormData>({
    guardianImage: "",
    childrenImages: [],
    phoneNumber: "",
    email: "",
    isPhoneVerified: false,
    isEmailVerified: false,
    isBackgroundChecked: false,
    careType: "",
    religion: "",
    ethnicities: [],
    languages: [],
    countries: [],
    numberOfPeople: 0,
    agesOfPeople: [],
    availabilityType: "",
    availability: [],
    serviceRequirements: {
      needsCooking: false,
      needsCare: false,
      needsFeedingChanging: false,
      needsShoppingErrands: false,
      needsPetCare: false,
      needsCleaning: false,
      needsOrganizing: false,
      needsTutoring: false,
      needsPacking: false,
      needsMealPrep: false
    },
    petDetails: [],
    requiredProfessionalSkills: {
      firstAidTraining: false,
      cprTraining: false,
      specialNeedsCare: false
    }
  });
  
  const [uploadedGuardianImageUrl, setUploadedGuardianImageUrl] = useState<string>("");
  const [uploadedChildrenImages, setUploadedChildrenImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCareTypeSelect = (type: CareType) => {
    setFormData(prev => ({ ...prev, careType: type }));
  };

  const handleReligionSelect = (religion: Religion) => {
    setFormData(prev => ({ ...prev, religion }));
  };

  const handleMultiSelect = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? (prev[field] as string[]).includes(value)
          ? (prev[field] as string[]).filter(item => item !== value)
          : [...(prev[field] as string[]), value]
        : prev[field]
    }));
  };

  const handleNumberOfPeopleSelect = (num: number) => {
    setFormData(prev => ({ ...prev, numberOfPeople: num }));
  };

  const calculateCompletedSteps = () => {
    const steps = [
      formData.guardianImage !== "",
      formData.phoneNumber !== "" && formData.isPhoneVerified,
      formData.email !== "" && formData.isEmailVerified,
      formData.careType !== "",
      formData.religion !== "",
      formData.ethnicities.length > 0,
      formData.languages.length > 0,
      formData.countries.length > 0,
      formData.agesOfPeople.length > 0,
      formData.availabilityType !== "",
      formData.availability.length > 0,
      Object.values(formData.requiredProfessionalSkills).some(Boolean),
      Object.values(formData.serviceRequirements).some(Boolean)
    ];

    return steps.filter(Boolean).length;
  };

  const totalSteps = 13;
  const completedSteps = calculateCompletedSteps();

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
      ? (selected as string[])
      : selected ? [selected as string] : [];

    return (
      <div className={`rounded-lg border p-6 ${selectedItems.length > 0 ? 'bg-slate-50 border-slate-300' : 'bg-white'}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        
        {selectedItems.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedItems.map((item) => (
              <span
                key={item}
                className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-800 text-white text-sm group"
              >
                {item}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(item);
                  }}
                  className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${item}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="space-y-2.5 max-h-[260px] md:max-h-[320px] overflow-y-auto pr-1">
          {options.map((option) => {
            const isSelected = multiSelect 
              ? (selected as string[]).includes(option)
              : selected === option;
            
            return (
              <motion.button
                key={option}
                type="button"
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelect(option)}
                className={`flex items-center p-3.5 w-full text-left rounded-lg transition-all duration-200 ease-in-out 
                  ${isSelected ? 'bg-slate-800 text-white shadow-sm' : 'bg-white hover:bg-slate-50 border border-gray-200'}`}
              >
                <span className="flex-1">{option}</span>
                {isSelected && <span className="text-white ml-2">✓</span>}
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  };

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-semibold text-gray-800 mb-4">
      {children}
    </h2>
  );

  const Section = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <section className={`mb-12 ${className}`}>
      {children}
    </section>
  );

  const handleSubmit = async () => {
    if (!formData.guardianImage && !uploadedGuardianImageUrl) {
      toast.error('Please upload a guardian image');
      return;
    }

    if (!formData.careType) {
      toast.error('Please select a care type');
      return;
    }

    if (!formData.religion) {
      toast.error('Please select a religion preference');
      return;
    }

    if (formData.ethnicities.length === 0) {
      toast.error('Please select at least one ethnicity preference');
      return;
    }

    if (formData.languages.length === 0) {
      toast.error('Please select at least one language preference');
      return;
    }

    if (formData.agesOfPeople.length === 0) {
      toast.error('Please select at least one age range');
      return;
    }

    if (!formData.availabilityType) {
      toast.error('Please select an availability type');
      return;
    }

    if (formData.availability.length === 0) {
      toast.error('Please set your availability schedule');
      return;
    }

    if (!Object.values(formData.serviceRequirements).some(Boolean)) {
      toast.error('Please select at least one service requirement');
      return;
    }

    setIsSubmitting(true);
    const loadingId = toast.loading('Submitting your care request...');

    try {
      const { submitCareSeekingRequest } = await import('@/app/actions/careseeker');
      
      console.log('Form availability data:', formData.availability);
      
      const requestData = {
        userType: 'careseeker',
        guardianName: 'Care Seeker', 
        guardianImage: uploadedGuardianImageUrl || formData.guardianImage || '',
        childrenImages: uploadedChildrenImages.length > 0 
          ? uploadedChildrenImages
          : formData.childrenImages,
        phoneNumber: formData.phoneNumber || '555-555-5555',
        email: formData.email || 'care@example.com',
        isPhoneVerified: formData.isPhoneVerified,
        isEmailVerified: formData.isEmailVerified,
        isBackgroundChecked: formData.isBackgroundChecked,
        address: '',
        city: formData.countries.length > 0 ? formData.countries[0] : 'Unknown location',
        state: '',
        postalCode: '',
        country: formData.countries.length > 0 ? formData.countries[0] : '',
        careType: formData.careType,
        numberOfPeople: formData.numberOfPeople || 1,
        agesOfPeople: formData.agesOfPeople,
        availabilityType: formData.availabilityType,
        availability: formData.availability.map(slot => ({
          day: slot.day || '',
          startTime: slot.startTime || '',
          endTime: slot.endTime || '',
          recurring: Boolean(slot.recurring)
        })),
        serviceRequirements: formData.serviceRequirements,
        petDetails: formData.petDetails,
        requiredProfessionalSkills: formData.requiredProfessionalSkills,
        preferenceFilters: {
          preferredEthnicity: formData.ethnicities,
          preferredLanguages: formData.languages,
          preferredReligion: formData.religion
        }
      };
      
      try {
        const result = await submitCareSeekingRequest(requestData);
        console.log('Form submission result:', result);
        
        toast.dismiss(loadingId);
        setIsSubmitting(false);
        
        if (result.success) {
          toast.success('Care request submitted successfully!');
          window.location.href = '/jobs';
        } else {
          toast.error(`Error: ${result.error || 'Something went wrong'}`);
        }
      } catch (serverError) {
        console.error('Server error during form submission:', serverError);
        toast.dismiss(loadingId);
        setIsSubmitting(false);
        toast.error('Server error. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.dismiss(loadingId);
      setIsSubmitting(false);
      toast.error('Failed to submit form. Please try again.');
    }
  };

  const GuardianImageUpload = () => {
    const { startUpload, isUploading } = useUploadThing("imageUploader", {
      onClientUploadComplete: (result) => {
        console.log("Upload complete:", result);
        if (result && result.length > 0) {
          const uploadedUrl = result[0].url;
          setUploadedGuardianImageUrl(uploadedUrl);
          toast.success("Guardian image uploaded successfully");
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
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            guardianImage: reader.result as string
          }));
        };
        reader.readAsDataURL(file);
        
        await startUpload([file]);
      } catch (error) {
        console.error("Error during file upload:", error);
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Guardian Image (Required)
        </label>
        <div className="flex items-center space-x-4">
          {(uploadedGuardianImageUrl || formData.guardianImage) && (
            <div className="relative w-24 h-24">
              <img
                src={uploadedGuardianImageUrl || formData.guardianImage}
                alt="Guardian"
                className="w-24 h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, guardianImage: "" }));
                  setUploadedGuardianImageUrl("");
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                ×
              </button>
            </div>
          )}
          <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors border-2 border-dashed border-slate-300 rounded-lg p-4 text-center w-24 h-24 flex items-center justify-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-5 w-5 text-slate-700 mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs text-gray-600">Uploading</span>
              </div>
            ) : (
              <span className="text-sm text-gray-600">Upload</span>
            )}
          </label>
        </div>
      </div>
    );
  };

  const ChildrenImagesUpload = () => {
    const { startUpload, isUploading } = useUploadThing("imageUploader", {
      onClientUploadComplete: (result) => {
        console.log("Upload complete:", result);
        if (result && result.length > 0) {
          const uploadedUrl = result[0].url;
          setUploadedChildrenImages(prev => [...prev, uploadedUrl]);
          toast.success("Child image uploaded successfully");
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
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            childrenImages: [...prev.childrenImages, reader.result as string]
          }));
        };
        reader.readAsDataURL(file);
        
        await startUpload([file]);
      } catch (error) {
        console.error("Error during file upload:", error);
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Children Images (Optional)
        </label>
        <div className="flex items-center space-x-4 flex-wrap gap-y-4">
          {formData.childrenImages.map((image, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={uploadedChildrenImages[index] || image}
                alt={`Child ${index + 1}`}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  const newImages = [...formData.childrenImages];
                  newImages.splice(index, 1);
                  setFormData(prev => ({ ...prev, childrenImages: newImages }));
                  
                  const newUploadedImages = [...uploadedChildrenImages];
                  newUploadedImages.splice(index, 1);
                  setUploadedChildrenImages(newUploadedImages);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
              >
                ×
              </button>
            </div>
          ))}
          <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors border-2 border-dashed border-slate-300 rounded-lg p-4 text-center w-24 h-24 flex items-center justify-center">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading}
            />
            {isUploading ? (
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-5 w-5 text-slate-700 mb-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs text-gray-600">Uploading</span>
              </div>
            ) : (
              <span className="text-sm text-gray-600">Add Child</span>
            )}
          </label>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-2 sm:pt-0">
      <FormProgress totalSteps={totalSteps} completedSteps={completedSteps} />
      <div className="sticky top-0 z-30 bg-white border-b shadow-sm mt-2">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex items-center">
            <div className="w-full">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Find Your Care Match</h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1">Tell us your preferences to find the ideal caregiver</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-12 gap-6">
    
          <div className="md:col-span-4 order-1">
            <div className="sticky top-[88px] space-y-4">
              <div className="bg-white rounded-lg border p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">What We&apos;ll Need</h2>
                <ul className="space-y-2">
                  {[
                    'Type of care needed',
                    'Religious preferences',
                    'Cultural background',
                    'Language requirements',
                    'Care duration and schedule'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <span className="text-slate-800 mr-2">•</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-4 text-white">
                <h2 className="text-lg font-semibold mb-3">Why These Details Matter</h2>
                <p className="text-sm text-slate-200 mb-3">
                  We use your preferences to match you with caregivers who align with your values and requirements.
                </p>
                <div className="flex items-center text-xs text-slate-300 border-t border-slate-700 pt-3">
                  <span className="mr-2">ℹ️</span>
                  <span>All matches are verified and background-checked</span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 order-2">
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Images</h3>
                <div className="space-y-4">
                  <GuardianImageUpload />
                  <ChildrenImagesUpload />
                </div>
              </div>

              <div className="bg-gradient-to-r from-slate-100 to-white p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Verification</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="flex-1 p-2 border rounded-lg"
                        placeholder="Enter your phone number"
                      />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, isPhoneVerified: true }))}
                        className={`px-4 py-2 rounded-lg ${
                          formData.isPhoneVerified
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                        }`}
                        disabled={formData.isPhoneVerified}
                      >
                        {formData.isPhoneVerified ? '✓ Verified' : 'Verify'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="flex-1 p-2 border rounded-lg"
                        placeholder="Enter your email address"
                      />
                      <button
                        onClick={() => setFormData(prev => ({ ...prev, isEmailVerified: true }))}
                        className={`px-4 py-2 rounded-lg ${
                          formData.isEmailVerified
                            ? 'bg-green-500 text-white'
                            : 'bg-slate-800 text-white hover:bg-slate-700'
                        }`}
                        disabled={formData.isEmailVerified}
                      >
                        {formData.isEmailVerified ? '✓ Verified' : 'Verify'}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-2">
                    <div className={`p-2 rounded-lg ${formData.isBackgroundChecked ? 'bg-green-500' : 'bg-gray-200'}`}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-600">
                      {formData.isBackgroundChecked ? 'Background Check Verified' : 'Background Check Pending'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg mb-6">
                <SelectionList
                  title="What type of care are you looking for?"
                  options={["Child Care", "Elderly Care", "Both"]}
                  selected={formData.careType}
                  onSelect={(value) => handleCareTypeSelect(value as CareType)}
                />
              </div>

              <div className="bg-white p-4 rounded-lg mb-6">
                <SelectionList
                  title="Religious Preference"
                  options={RELIGIONS}
                  selected={formData.religion}
                  onSelect={(value) => handleReligionSelect(value as Religion)}
                />
              </div>

              <div className="bg-gradient-to-r from-slate-100 to-white p-4 rounded-lg mb-6">
                <SelectionList
                  title="Ethnicity Preferences"
                  options={ETHNICITIES}
                  selected={formData.ethnicities}
                  onSelect={(value) => handleMultiSelect('ethnicities', value)}
                  multiSelect
                />
              </div>

              <div className="bg-white p-4 rounded-lg mb-6">
                <SelectionList
                  title="Language Preferences"
                  options={LANGUAGES}
                  selected={formData.languages}
                  onSelect={(value) => handleMultiSelect('languages', value)}
                  multiSelect
                />
              </div>

              <div className="bg-gradient-to-r from-slate-100 to-white p-4 rounded-lg mb-6">
                <SelectionList
                  title="Country Preferences"
                  options={COUNTRIES}
                  selected={formData.countries}
                  onSelect={(value) => handleMultiSelect('countries', value)}
                  multiSelect
                />
              </div>

              <div className="bg-white p-4 rounded-lg mb-6">
                <SelectionList
                  title="Age Range of Care Needed"
                  options={AGE_RANGES}
                  selected={formData.agesOfPeople}
                  onSelect={(value) => handleMultiSelect('agesOfPeople', value)}
                  multiSelect
                />
              </div>

              <div className="bg-gradient-to-r from-slate-100 to-white p-4 rounded-lg mb-6">
                <SelectionList
                  title="Care Duration"
                  options={["Recurring", "One-time", "Long term"]}
                  selected={formData.availabilityType}
                  onSelect={(value) => setFormData(prev => ({ ...prev, availabilityType: value as "Recurring" | "One-time" | "Long term" }))}
                />
              </div>

              <div className={`${formData.availabilityType ? 'bg-gradient-to-r from-slate-100 to-white' : 'bg-white'} p-4 rounded-lg mb-6`}>
                <AvailabilitySelector 
                  availability={formData.availability}
                  availabilityType={formData.availabilityType}
                  onAvailabilityChange={(newAvailability) => setFormData(prev => ({
                    ...prev,
                    availability: newAvailability
                  }))}
                  onAvailabilityTypeChange={(newType) => {
                    const typedType = newType as "Recurring" | "One-time" | "Long term";
                    setFormData(prev => ({
                      ...prev,
                      availabilityType: typedType
                    }));
                  }}
                  scrollRestoreEnabled={false}
                />
              </div>

              <div className="bg-gradient-to-r from-slate-100 to-white p-4 rounded-lg mb-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Professional Skills</h3>
                  <div className="space-y-3">
                    {Object.entries({
                      firstAidTraining: "First Aid Training",
                      cprTraining: "CPR Training",
                      specialNeedsCare: "Special Needs Care"
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.requiredProfessionalSkills[key as keyof ProfessionalSkills]}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            requiredProfessionalSkills: {
                              ...prev.requiredProfessionalSkills,
                              [key]: e.target.checked
                            }
                          }))}
                          className="form-checkbox h-5 w-5 text-slate-800"
                        />
                        <span className="text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg mb-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Services Required</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries({
                      needsCooking: "Cooking",
                      needsCare: "Care",
                      needsFeedingChanging: "Feeding/Changing",
                      needsShoppingErrands: "Shopping/Errands",
                      needsPetCare: "Pet Care",
                      needsCleaning: "Cleaning",
                      needsOrganizing: "Organizing",
                      needsTutoring: "Tutoring",
                      needsPacking: "Packing",
                      needsMealPrep: "Meal Prep"
                    }).map(([key, label]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={formData.serviceRequirements[key as keyof ServiceRequirements]}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            serviceRequirements: {
                              ...prev.serviceRequirements,
                              [key]: e.target.checked
                            }
                          }))}
                          className="form-checkbox h-5 w-5 text-slate-800"
                        />
                        <span className="text-gray-700">{label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {formData.serviceRequirements.needsPetCare && (
                <div className="bg-gradient-to-r from-slate-100 to-white p-4 rounded-lg mb-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Pet Details</h3>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        petDetails: [...prev.petDetails, { type: "", description: "" }]
                      }))}
                      className="mb-4 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                    >
                      Add Pet
                    </button>
                    {formData.petDetails.map((pet, index) => (
                      <div key={index} className="mb-4 p-4 border rounded-lg">
                        <input
                          type="text"
                          placeholder="Pet Type"
                          value={pet.type}
                          onChange={(e) => {
                            const newPetDetails = [...formData.petDetails];
                            newPetDetails[index].type = e.target.value;
                            setFormData(prev => ({ ...prev, petDetails: newPetDetails }));
                          }}
                          className="mb-2 w-full p-2 border rounded"
                        />
                        <textarea
                          placeholder="Pet Description"
                          value={pet.description}
                          onChange={(e) => {
                            const newPetDetails = [...formData.petDetails];
                            newPetDetails[index].description = e.target.value;
                            setFormData(prev => ({ ...prev, petDetails: newPetDetails }));
                          }}
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="sticky bottom-0 bg-gray-50 pt-4 pb-6 z-10 shadow-lg border-t">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full px-8 py-4 ${isSubmitting ? 'bg-slate-500' : 'bg-slate-800 hover:bg-slate-700'} 
                    text-white rounded-lg transition-all duration-200 font-medium
                    focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2`}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Care Request'
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
