import {
  getCaregiverByClerkUserId,
  deleteCareGiver,
  updateCareGiver,
} from "@/server/db/queries";
import { SimpleUploadButton } from "@/app/_components/simpleUploadButton";
import { redirect } from "next/navigation";
import LanguageSelect from "@/app/_components/LanguageSelect";
import SectSelect from "@/app/_components/SectSelect";
import EthnicBackgroundSelect from "@/app/_components/EthnicBackgroundSelect";
import { 
  AvailabilityTime, 
  CareType, 
  Religion, 
  MuslimSect, 
  CareCapacity, 
  CareTerm, 
  AvailabilityType,
  ImageData 
} from "@/utils/types";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

export default async function CareGiverSettings({
  params,
}: {
  params: { id: string };
}) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    redirect("/login");
  }
  const careGiver = await getCaregiverByClerkUserId(clerkUserId);
  
  if (!careGiver) {
    redirect("/");
  }
  
  const image = careGiver.image
    ? JSON.parse(careGiver.image)
    : { url: "", alt: "" };

  const formatTimeDisplay = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return "Not set";
    
    const formatHour = (hour: string) => {
      const hourNum = parseInt(hour);
      if (hourNum === 0 || hourNum === 24) return "12 AM";
      if (hourNum === 12) return "12 PM";
      return hourNum > 12 ? `${hourNum - 12} PM` : `${hourNum} AM`;
    };
    
    const formattedStart = formatHour(startTime.split(':')[0]);
    const formattedEnd = formatHour(endTime.split(':')[0]);
    
    return `${formattedStart} - ${formattedEnd}`;
  };

  const availability = (careGiver.availability as AvailabilityTime[] || []);

  return (
    <div className="flex justify-center pb-20">
      <div className="w-full max-w-5xl bg-white p-6 border border-gray-300 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-8 text-center">Edit Your Caregiver Profile</h1>
        
        <form
          action={async (formData) => {
            "use server";

            const name = formData.get("name") as string || careGiver.name;
            const description = formData.get("description") as string || careGiver.description;
            const phoneNumber = formData.get("phoneNumber") as string || careGiver.phoneNumber;
            const address = formData.get("address") as string || careGiver.address;
            const city = formData.get("city") as string || careGiver.city;
            const state = formData.get("state") as string || careGiver.state;
            const postalCode = formData.get("postalCode") as string || careGiver.postalCode;
            const country = formData.get("country") as string || careGiver.country;
            const languages = (formData.get("languages") as string)?.split(",") || careGiver.languages || [];
            const sect = formData.get("sect") as string || careGiver.sect;
            const ethnicBackground = (formData.get("ethnicBackground") as string)?.split(",") || careGiver.ethnicBackground || [];
            const availabilityStr = formData.get("availability") as string;
            
            const subscribed = formData.get("subscribed") === "on";
            const backgroundChecked = formData.get("backgroundChecked") === "on";
            
            const imageUrl = formData.get("imageUrl") as string || image.url;
            
            const careType = (formData.get("careType") as string || careGiver.careType) as CareType;
            const religion = (formData.get("religion") as string || careGiver.religion) as Religion;
            const muslimSect = (formData.get("muslimSect") as string || careGiver.muslimSect) as MuslimSect;
            const agesServed = (formData.get("agesServed") as string)?.split(",") || careGiver.agesServed || [];
            const careCapacity = (formData.get("careCapacity") as string || careGiver.careCapacity) as CareCapacity;
            const termOfCare = (formData.get("termOfCare") as string || careGiver.termOfCare) as CareTerm;
            
            const hourlyRateMinStr = formData.get("hourlyRateMin");
            const hourlyRateMin = hourlyRateMinStr ? 
              Number(hourlyRateMinStr.toString()) : 
              (typeof careGiver.hourlyRateMin === 'number' ? careGiver.hourlyRateMin : 0);
            
            const hourlyRateMaxStr = formData.get("hourlyRateMax");
            const hourlyRateMax = hourlyRateMaxStr ? 
              Number(hourlyRateMaxStr.toString()) : 
              (typeof careGiver.hourlyRateMax === 'number' ? careGiver.hourlyRateMax : 0);
            
            const yearsExperienceStr = formData.get("yearsExperience");
            const yearsExperience = yearsExperienceStr ? 
              Number(yearsExperienceStr.toString()) : 
              (typeof careGiver.yearsExperience === 'number' ? careGiver.yearsExperience : 0);
            
            const availabilityType = (formData.get("availabilityType") as string || careGiver.availabilityType) as AvailabilityType;
            const aboutMe = formData.get("aboutMe") as string || careGiver.aboutMe || "";
            
            const canCook = formData.get("canCook") === "on";
            const hasTransportation = formData.get("hasTransportation") === "on";
            const canShopErrands = formData.get("canShopErrands") === "on"; 
            const canHelpWithPets = formData.get("canHelpWithPets") === "on";
            const canClean = formData.get("canClean") === "on";
            const canOrganize = formData.get("canOrganize") === "on";
            const canTutor = formData.get("canTutor") === "on";
            const canPack = formData.get("canPack") === "on";
            const canMealPrep = formData.get("canMealPrep") === "on";
            
            const isVaccinated = formData.get("isVaccinated") === "on";
            const isSmoker = formData.get("isSmoker") === "on";
            const firstAidTraining = formData.get("firstAidTraining") === "on";
            const cprTraining = formData.get("cprTraining") === "on";
            const specialNeedsCare = formData.get("specialNeedsCare") === "on";

            let availabilityData: AvailabilityTime[] = availability;
            try {
              if (availabilityStr) {
                availabilityData = JSON.parse(availabilityStr) as AvailabilityTime[];
              }
            } catch (error) {
              console.error("Failed to parse availability:", error);
            }

            await updateCareGiver(careGiver.id, {
              name,
              description,
              phoneNumber,
              address,
              city,
              state,
              postalCode,
              country,
              languages,
              sect,
              ethnicBackground,
              availability: availabilityData,
              subscribed,
              backgroundChecked,
              image: {
                url: imageUrl,
                alt: "Profile picture",
              },
              careType,
              religion,
              muslimSect,
              agesServed,
              careCapacity,
              termOfCare,
              hourlyRateMin: hourlyRateMin as number,
              hourlyRateMax: hourlyRateMax as number,
              yearsExperience: yearsExperience as number,
              availabilityType,
              aboutMe,
              
              canCook,
              hasTransportation,
              canShopErrands,
              canHelpWithPets,
              canClean,
              canOrganize,
              canTutor,
              canPack,
              canMealPrep,
              
              isVaccinated,
              isSmoker,
              professionalSkills: {
                firstAidTraining,
                cprTraining,
                specialNeedsCare,
              },
            });

            redirect("/caregivers");
          }}
          className="space-y-6"
        >
          <input type="hidden" id="imageUrl" name="imageUrl" />
          
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex flex-col items-center">
                  {image.url ? (
                    <Image
                      src={image.url}
                      alt={image.alt || "Profile picture"}
                      width={200}
                      height={200}
                      className="object-cover h-48 w-48 rounded-full"
                    />
                  ) : (
                    <div className="h-48 w-48 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-gray-500">No Image</span>
                    </div>
                  )}
                  <div className="mt-6 w-full">
                    <label
                      htmlFor="imageUrl"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Update Profile Picture
                    </label>
                    <SimpleUploadButton inputId="imageUrl" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      defaultValue={careGiver.name}
                      className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      defaultValue={careGiver.phoneNumber}
                      className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    defaultValue={careGiver.description}
                    className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">About Me</h2>
                <textarea
                  id="aboutMe"
                  name="aboutMe"
                  defaultValue={careGiver.aboutMe || ""}
                  className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell clients about yourself, your background, and what makes you a great caregiver..."
                />
              </div>
            </div>
          </div>

          {/* Care Information Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Care Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Care Type
                </label>
                <select
                  id="careType"
                  name="careType"
                  defaultValue={careGiver.careType || ""}
                  className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select care type</option>
                  <option value="Child Care">Child Care</option>
                  <option value="Elderly Care">Elderly Care</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Care Capacity
                </label>
                <select
                  id="careCapacity"
                  name="careCapacity"
                  defaultValue={careGiver.careCapacity || ""}
                  className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select capacity</option>
                  <option value="Only one">Only one</option>
                  <option value="Multiple">Multiple</option>
                </select>
              </div>
                
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term of Care
                </label>
                <select
                  id="termOfCare"
                  name="termOfCare"
                  defaultValue={careGiver.termOfCare || ""}
                  className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select term</option>
                  <option value="Long term caregiver">Long term caregiver</option>
                  <option value="Short term caregiver">Short term caregiver</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ages Served
              </label>
              <select
                id="agesServed"
                name="agesServed"
                multiple
                defaultValue={careGiver.agesServed || []}
                className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Infant (0-1)">Infant (0-1)</option>
                <option value="Toddler (1-3)">Toddler (1-3)</option>
                <option value="Preschool (3-5)">Preschool (3-5)</option>
                <option value="School Age (5-12)">School Age (5-12)</option>
                <option value="Teenager (13-18)">Teenager (13-18)</option>
                <option value="Adult (18-65)">Adult (18-65)</option>
                <option value="Senior (65+)">Senior (65+)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
          </div>
          
          {/* Experience & Rates Section */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Experience & Rates</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years Experience
                </label>
                <input
                  type="number"
                  id="yearsExperience"
                  name="yearsExperience"
                  defaultValue={careGiver.yearsExperience || 0}
                  min="0"
                  className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (Min)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="hourlyRateMin"
                    name="hourlyRateMin"
                    defaultValue={careGiver.hourlyRateMin || 0}
                    min="0"
                    step="0.5"
                    className="pl-8 border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Rate (Max)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    id="hourlyRateMax"
                    name="hourlyRateMax"
                    defaultValue={careGiver.hourlyRateMax || 0}
                    min="0"
                    step="0.5"
                    className="pl-8 border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Background</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Religion
                </label>
                <select
                  id="religion"
                  name="religion"
                  defaultValue={careGiver.religion || ""}
                  className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select religion</option>
                  <option value="Muslim">Muslim</option>
                  <option value="Christian">Christian</option>
                  <option value="Jewish">Jewish</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddhist">Buddhist</option>
                  <option value="Sikh">Sikh</option>
                  <option value="Other">Other</option>
                  <option value="None">None</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sect of Islam
                </label>
                <SectSelect inputId="sect" selectedSect={careGiver.sect} />
                <input type="hidden" id="sect" name="sect" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ethnic Background
                </label>
                <EthnicBackgroundSelect
                  inputId="ethnicBackground"
                  selectedEthnicBackground={careGiver.ethnicBackground}
                />
                <input type="hidden" id="ethnicBackground" name="ethnicBackground" />
              </div>
            </div>
            
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages
              </label>
              <LanguageSelect
                inputId="languages"
                selectedLanguages={careGiver.languages}
              />
              <input type="hidden" id="languages" name="languages" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Availability</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability Type
              </label>
              <div className="flex flex-wrap gap-4">
                {["Recurring", "One-time", "Long term"].map(type => (
                  <label key={type} className="inline-flex items-center">
                    <input
                      type="radio"
                      name="availabilityType"
                      value={type}
                      defaultChecked={careGiver.availabilityType === type}
                      className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    />
                    <span className="ml-2">{type}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-medium text-gray-700 mb-3">Weekly Schedule</h3>
              
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
                const timeSlot = availability.find(a => a.day === day);
                const hasTimeSlot = timeSlot && timeSlot.startTime && timeSlot.endTime;
                
                return (
                  <div key={day} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{day}</h4>
                      {hasTimeSlot && (
                        <div className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          {formatTimeDisplay(timeSlot.startTime, timeSlot.endTime)}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Time
                        </label>
                        <select
                          name={`start-${day}`}
                          defaultValue={timeSlot?.startTime || ""}
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
                          name={`end-${day}`}
                          defaultValue={timeSlot?.endTime || ""}
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
            
            <script id="availability-script" dangerouslySetInnerHTML={{
              __html: `
                document.addEventListener('submit', function() {
                  const availabilityData = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => {
                    const startSelect = document.querySelector('[name="start-'+day+'"]');
                    const endSelect = document.querySelector('[name="end-'+day+'"]');
                    return {
                      day,
                      startTime: startSelect ? startSelect.value : "",
                      endTime: endSelect ? endSelect.value : "",
                      recurring: true
                    };
                  });
                  
                  const hiddenInput = document.createElement('input');
                  hiddenInput.type = 'hidden';
                  hiddenInput.name = 'availability';
                  hiddenInput.value = JSON.stringify(availabilityData);
                  document.querySelector('form').appendChild(hiddenInput);
                });
              `
            }} />
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Services Offered</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { key: "canCook", label: "Cooking", icon: "🍳" },
                { key: "hasTransportation", label: "Transportation", icon: "🚗" },
                { key: "canShopErrands", label: "Shopping/Errands", icon: "🛒" },
                { key: "canHelpWithPets", label: "Pet Care", icon: "🐾" },
                { key: "canClean", label: "Cleaning", icon: "🧹" },
                { key: "canOrganize", label: "Organizing", icon: "📦" },
                { key: "canTutor", label: "Tutoring", icon: "📚" },
                { key: "canPack", label: "Packing", icon: "📦" },
                { key: "canMealPrep", label: "Meal Prep", icon: "🥗" }
              ].map(service => {
                const isActive = Boolean(careGiver[service.key as keyof typeof careGiver]);
                
                return (
                  <label 
                    key={service.key} 
                    className={`
                      flex items-center p-3 rounded-lg cursor-pointer transition-all
                      border ${isActive 
                        ? 'bg-blue-500 text-white border-blue-500' 
                        : 'bg-white border-gray-200 hover:bg-gray-50'}
                    `}
                  >
                    <input
                      type="checkbox"
                      name={service.key}
                      defaultChecked={isActive}
                      className="sr-only"
                    />
                    <span className="mr-3 text-xl">{service.icon}</span>
                    <span>{service.label}</span>
                    {isActive && (
                      <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Health & Professional Skills</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Health Information</h3>
                <div className="space-y-3">
                  <label className={`
                    flex items-center p-3 rounded-lg cursor-pointer transition-all border
                    ${Boolean(careGiver.isVaccinated) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200 hover:bg-gray-50'}
                  `}>
                    <input
                      type="checkbox"
                      name="isVaccinated"
                      defaultChecked={Boolean(careGiver.isVaccinated)}
                      className="sr-only"
                    />
                    <span className="mr-3 text-xl">💉</span>
                    <span>Vaccinated</span>
                    {Boolean(careGiver.isVaccinated) && (
                      <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </label>
                  
                  <label className={`
                    flex items-center p-3 rounded-lg cursor-pointer transition-all border
                    ${Boolean(careGiver.isSmoker) ? 'bg-blue-500 text-white border-blue-500' : 'bg-white border-gray-200 hover:bg-gray-50'}
                  `}>
                    <input
                      type="checkbox"
                      name="isSmoker"
                      defaultChecked={Boolean(careGiver.isSmoker)}
                      className="sr-only"
                    />
                    <span className="mr-3 text-xl">🚬</span>
                    <span>Smoker</span>
                    {Boolean(careGiver.isSmoker) && (
                      <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Professional Skills</h3>
                <div className="space-y-3">
                  {[
                    { key: "firstAidTraining", label: "First Aid Training", icon: "🩹" },
                    { key: "cprTraining", label: "CPR Training", icon: "❤️" },
                    { key: "specialNeedsCare", label: "Special Needs Care", icon: "🧩" }
                  ].map(skill => {
                    const hasSkill = (careGiver as any).professionalSkills ? 
                      Boolean((careGiver as any).professionalSkills[skill.key]) : 
                      false;
                      
                    return (
                      <label 
                        key={skill.key} 
                        className={`
                          flex items-center p-3 rounded-lg cursor-pointer transition-all border
                          ${hasSkill 
                            ? 'bg-blue-500 text-white border-blue-500' 
                            : 'bg-white border-gray-200 hover:bg-gray-50'}
                        `}
                      >
                        <input
                          type="checkbox"
                          name={skill.key}
                          defaultChecked={hasSkill}
                          className="sr-only"
                        />
                        <span className="mr-3 text-xl">{skill.icon}</span>
                        <span>{skill.label}</span>
                        {hasSkill && (
                          <svg className="w-5 h-5 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Address Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  defaultValue={careGiver.address}
                  className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={careGiver.city}
                  className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  defaultValue={careGiver.state}
                  className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  defaultValue={careGiver.postalCode}
                  className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  defaultValue={careGiver.country}
                  className="border border-gray-300 bg-gray-50 text-black p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold mb-4">Verification & Preferences</h2>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="backgroundChecked"
                  defaultChecked={Boolean(careGiver.backgroundChecked)}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2">Background Checked</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="subscribed"
                  defaultChecked={Boolean(careGiver.subscribed)}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="ml-2">Subscribed to updates</span>
              </label>
            </div>
            
            <div className="text-sm text-gray-500 mt-4">
              <p>Account created: {new Date(careGiver.createdAt).toLocaleDateString()}</p>
              <p>Last updated: {new Date(careGiver.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="flex justify-between mt-8">
            <button
              type="submit"
              className="bg-blue-500 text-white py-3 px-8 rounded-lg hover:bg-blue-600 transition duration-200 font-medium"
            >
              Update Profile
            </button>
            
            <form
              action={async () => {
                "use server";
                await deleteCareGiver(careGiver.id);
                redirect("/caregivers");
              }}
              className="inline"
            >
              <button
                type="submit"
                className="bg-red-500 text-white py-3 px-8 rounded-lg hover:bg-red-600 transition duration-200 font-medium"
              >
                Delete Profile
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  );
}
