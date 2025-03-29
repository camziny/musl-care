import { getCaregiver } from "@/server/db/queries";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Caregiver, AvailabilityTime, ProfessionalSkills, ServiceItem, DayMapping } from "@/types/caregivers";

export default async function FullPageCaregiverView(props: { id: number }) {
  let careGiver: Caregiver;
  
  try {
    const careGiverData = await getCaregiver(props.id);
    if (!careGiverData) {
      notFound();
    }
    careGiver = careGiverData as unknown as Caregiver;
  } catch (error) {
    console.error("Error fetching caregiver:", error);
    notFound();
  }

  let imageUrl = "/default-profile.jpg";
  let altText = `${careGiver.name}'s profile picture`;

  try {
    if (typeof careGiver.image === 'string') {
      if (careGiver.image.startsWith('{')) {
        const parsedImage = JSON.parse(careGiver.image);
        if (parsedImage.url && parsedImage.url.length > 0) {
          imageUrl = parsedImage.url;
        }
        if (parsedImage.altText) {
          altText = parsedImage.altText;
        }
      } else if (careGiver.image.startsWith('http') || careGiver.image.startsWith('/')) {
        imageUrl = careGiver.image;
      }
    }
  } catch (error) {
    console.error("Error parsing image data:", error);
  }

  const formatTime = (time: string): string => {
    if (!time) return "";
    
    const [hours] = time.split(':');
    const hour = parseInt(hours);
    
    if (hour === 0 || hour === 24) return "12 AM";
    if (hour === 12) return "12 PM";
    
    return hour < 12 
      ? `${hour} AM` 
      : `${hour - 12} PM`;
  };

  const services: ServiceItem[] = [
    { id: 'canCook', name: 'Cooking', icon: '🍳' },
    { id: 'hasTransportation', name: 'Transportation', icon: '🚗' },
    { id: 'canShopErrands', name: 'Grocery & Errands', icon: '🛒' },
    { id: 'canHelpWithPets', name: 'Pet Care', icon: '🐾' },
    { id: 'canClean', name: 'Cleaning', icon: '🧹' },
    { id: 'canOrganize', name: 'Organizing', icon: '📦' },
    { id: 'canTutor', name: 'Tutoring', icon: '📚' },
    { id: 'canPack', name: 'Packing', icon: '📦' },
    { id: 'canMealPrep', name: 'Meal Prep', icon: '🥗' },
  ];

  const activeServices = services.filter(service => 
    careGiver[service.id] === true
  );

  const professionalSkills: string[] = [];
  
  try {
    if (careGiver.professionalSkills) {
      const skills = typeof careGiver.professionalSkills === 'string' 
        ? JSON.parse(careGiver.professionalSkills) as ProfessionalSkills
        : careGiver.professionalSkills as ProfessionalSkills;
      
      if (skills.firstAidTraining) professionalSkills.push('First Aid Training');
      if (skills.cprTraining) professionalSkills.push('CPR Certified');
      if (skills.specialNeedsCare) professionalSkills.push('Special Needs Care');
    }
    
    const cg = careGiver as any; // Use type assertion to access possible properties
    if (professionalSkills.length === 0) {
      if (cg.firstAidTraining) professionalSkills.push('First Aid Training');
      if (cg.cprTraining) professionalSkills.push('CPR Certified');
      if (cg.specialNeedsCare) professionalSkills.push('Special Needs Care');
    }
  } catch (e) {
    console.error("Error parsing professional skills:", e);
  }

  const languages: string[] = Array.isArray(careGiver.languages) 
    ? careGiver.languages 
    : typeof careGiver.languages === 'string'
      ? JSON.parse(careGiver.languages)
      : [];

  const availability: AvailabilityTime[] = Array.isArray(careGiver.availability) 
    ? careGiver.availability 
    : typeof careGiver.availability === 'string'
      ? JSON.parse(careGiver.availability)
      : [];

  const careTypeDisplay = careGiver.careType === 'Both' 
    ? 'Child & Elderly Care' 
    : careGiver.careType || '';
    
  let rateDisplay = 'Rate not specified';
  
  try {
    const cg = careGiver as any; 

    if (cg.hourlyRateMin !== undefined && cg.hourlyRateMax !== undefined) {
      const min = Number(cg.hourlyRateMin);
      const max = Number(cg.hourlyRateMax);
      if (min <= max) {
        rateDisplay = `$${min}-$${max}/hr`;
      } else {
        rateDisplay = `$${max}-$${min}/hr`;
      }
    } 
    else if (cg.hourlyRate) {
      const hourlyRate = typeof cg.hourlyRate === 'string'
        ? JSON.parse(cg.hourlyRate)
        : cg.hourlyRate;
        
      if (hourlyRate.min !== undefined && hourlyRate.max !== undefined) {
        const min = Number(hourlyRate.min);
        const max = Number(hourlyRate.max);
        if (min <= max) {
          rateDisplay = `$${min}-$${max}/hr`;
        } else {
          rateDisplay = `$${max}-$${min}/hr`;
        }
      }
    }
  } catch (e) {
    console.error("Error parsing hourly rate:", e);
  }

  const dayMap: DayMapping = {
    'Monday': 'M',
    'Tuesday': 'T',
    'Wednesday': 'W',
    'Thursday': 'T',
    'Friday': 'F',
    'Saturday': 'S',
    'Sunday': 'S'
  };
  
  const availableDays: Record<string, boolean> = availability.reduce((acc: Record<string, boolean>, slot: AvailabilityTime) => {
    if (slot.startTime && slot.endTime) {
      acc[slot.day] = true;
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
          <div className="md:flex">
            <div className="md:w-2/5">
              <div className="relative h-44 md:h-full w-full bg-slate-100">
                <Image
                  src={imageUrl}
                  alt={altText}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  className="rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
                  priority
                />
              </div>
            </div>

            <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                      <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                    
                    {careGiver.isVaccinated && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.5 2a3.5 3.5 0 11.59 6.95A13.46 13.46 0 016 9.05l7.5 7.5c.896.896 2.342.896 3.238 0 .896-.896.896-2.342 0-3.238L9.05 5.5l.19-.086A3.5 3.5 0 115.5 2zM11 5a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
                        </svg>
                        Vaccinated
                      </span>
                    )}
                    
                    {professionalSkills.length > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                        </svg>
                        Certified
                      </span>
                    )}
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{careGiver.name}</h1>
                  
                  <div className="mt-2 flex flex-wrap items-center text-gray-700 gap-y-1">
                    <span className="font-medium text-slate-800">{careTypeDisplay}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="font-medium text-emerald-600">{rateDisplay}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span>{careGiver.yearsExperience || 0} years experience</span>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-gray-600">{careGiver.aboutMe || careGiver.description}</p>
                </div>

                <div className="border-t border-gray-200 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <div className="mt-1 flex items-center text-gray-900">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {[
                          careGiver.city, 
                          careGiver.state, 
                          careGiver.country
                        ].filter(Boolean).join(', ') || "Location not specified"}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Care Capacity</h3>
                      <p className="mt-1 text-gray-900">
                        {careGiver.careCapacity === "Multiple" ? "Multiple individuals" : "One individual"}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Professional Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {professionalSkills.map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700 border border-purple-200">
                        {skill}
                      </span>
                    ))}
                    {professionalSkills.length === 0 && (
                      <span className="text-gray-500 text-sm">No professional certifications listed</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <button className="flex-1 bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-900 transition-colors font-medium shadow-sm">
                  Contact {careGiver.name.split(' ')[0]}
                </button>
                <button className="flex-1 bg-white text-slate-800 px-6 py-3 rounded-lg border-2 border-slate-400 hover:bg-slate-50 transition-colors font-medium shadow-sm">
                  Request Booking
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Services
            </h3>
            <ul className="space-y-3">
              {activeServices.map((service, index) => (
                <li key={index} className="flex items-center text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                  <span className="mr-2 text-xl">{service.icon}</span>
                  <span className="font-medium">{service.name}</span>
                </li>
              ))}
              {activeServices.length === 0 && (
                <li className="text-gray-500">No additional services listed</li>
              )}
            </ul>
            
            {typeof careGiver.isSmoker !== 'undefined' && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${careGiver.isSmoker ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'}`}>
                  {careGiver.isSmoker ? 'Smoker' : 'Non-Smoker'}
                </span>
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Languages & Background
            </h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((language: string, index: number) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                  {language}
                </span>
              ))}
              {languages.length === 0 && (
                <span className="text-gray-500">No languages specified</span>
              )}
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Religious Background
              </h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-50 text-slate-700 border border-slate-200">
                  {careGiver.religion || "Not specified"}
                </span>
                {careGiver.muslimSect && careGiver.religion === "Muslim" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-50 text-slate-700 border border-slate-200">
                    {careGiver.muslimSect}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Ethnicity
              </h4>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-50 text-slate-700 border border-slate-200">
                {careGiver.ethnicity || "Not specified"}
              </span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <svg className="w-5 h-5 mr-2 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                Availability
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-amber-50 text-amber-700 border border-amber-200">
                {careGiver.availabilityType || "Flexible"}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              {availability.map((slot: AvailabilityTime, index: number) => {
                if (!slot.startTime || !slot.endTime) return null;
                return (
                  <div key={index} className="flex justify-between text-gray-700 bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="font-medium">{slot.day}</span>
                    <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                  </div>
                );
              })}
              {availability.length === 0 && (
                <p className="text-gray-500">Availability not specified</p>
              )}
            </div>
            
            <div className="mt-4 bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Weekly Overview</h4>
              <div className="grid grid-cols-7 gap-1">
                {Object.entries(dayMap).map(([day, abbr], index) => (
                  <div 
                    key={index} 
                    className={`text-center py-1 rounded-md font-medium ${
                      availableDays[day] 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {abbr}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Ages Served
              </h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(careGiver.agesServed) ? careGiver.agesServed : []).map((age: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-amber-50 text-amber-700 border border-amber-200">
                    {age}
                  </span>
                ))}
                {(!careGiver.agesServed || !Array.isArray(careGiver.agesServed) || careGiver.agesServed.length === 0) && (
                  <span className="text-gray-500">No age preferences specified</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
