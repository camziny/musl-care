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
  if (careGiver.professionalSkills) {
    let skills: ProfessionalSkills;
    try {
      skills = typeof careGiver.professionalSkills === 'string' 
        ? JSON.parse(careGiver.professionalSkills) as ProfessionalSkills
        : careGiver.professionalSkills as ProfessionalSkills;
        
      if (skills.firstAidTraining) professionalSkills.push('First Aid Training');
      if (skills.cprTraining) professionalSkills.push('CPR Certified');
      if (skills.specialNeedsCare) professionalSkills.push('Special Needs Care');
    } catch (e) {
      console.error("Error parsing professional skills:", e);
    }
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
    
  const hourlyRate = careGiver.hourlyRate 
    ? (typeof careGiver.hourlyRate === 'string'
        ? JSON.parse(careGiver.hourlyRate)
        : careGiver.hourlyRate)
    : null;
    
  const rateDisplay = hourlyRate 
    ? `$${hourlyRate.min}-$${hourlyRate.max}/hr` 
    : 'Rate not specified';

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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-slate-50">
              <div className="relative h-96 md:h-full w-full">
                <Image
                  src={imageUrl}
                  alt={altText}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  className="rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                  priority
                />
              </div>
            </div>

            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Background Check Verified
                    </span>
                    
                    {careGiver.isVaccinated && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Vaccinated
                      </span>
                    )}
                    
                    {professionalSkills.length > 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        Certified
                      </span>
                    )}
                  </div>
                  
                  <h1 className="mt-2 text-3xl font-bold text-gray-900">{careGiver.name}</h1>
                  
                  <div className="mt-2 flex items-center text-gray-600">
                    <span className="font-medium text-slate-800">{careTypeDisplay}</span>
                    <span className="mx-2">•</span>
                    <span>{rateDisplay}</span>
                    <span className="mx-2">•</span>
                    <span>{careGiver.yearsExperience || 0} years experience</span>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-gray-600 text-lg">{careGiver.aboutMe || careGiver.description}</p>
                </div>

                <div className="border-t border-b border-gray-200 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <div className="mt-1 flex items-center text-gray-900">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {careGiver.country || "Location not specified"}
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
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                        {skill}
                      </span>
                    ))}
                    {professionalSkills.length === 0 && (
                      <span className="text-gray-500 text-sm">No professional certifications listed</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button className="w-full bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium">
                  Contact {careGiver.name}
                </button>
                <button className="w-full bg-white text-slate-800 px-6 py-3 rounded-lg border-2 border-slate-800 hover:bg-slate-50 transition-colors font-medium">
                  Hire {careGiver.name}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Services</h3>
            <ul className="space-y-3">
              {activeServices.map((service, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <span className="mr-2 text-xl">{service.icon}</span>
                  <span>{service.name}</span>
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
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((language: string, index: number) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-800">
                  {language}
                </span>
              ))}
              {languages.length === 0 && (
                <span className="text-gray-500">No languages specified</span>
              )}
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Religious Background</h4>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-800">
                  {careGiver.religion || "Not specified"}
                </span>
                {careGiver.muslimSect && careGiver.religion === "Muslim" && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-800">
                    {careGiver.muslimSect}
                  </span>
                )}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Ethnicity</h4>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-800">
                {careGiver.ethnicity || "Not specified"}
              </span>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Availability</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-100 text-slate-800">
                {careGiver.availabilityType || "Flexible"}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              {availability.map((slot: AvailabilityTime, index: number) => {
                if (!slot.startTime || !slot.endTime) return null;
                return (
                  <div key={index} className="flex justify-between text-gray-600 border-b border-gray-100 pb-2">
                    <span className="font-medium">{slot.day}</span>
                    <span>{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</span>
                  </div>
                );
              })}
              {availability.length === 0 && (
                <p className="text-gray-500">Availability not specified</p>
              )}
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Weekly Overview</h4>
              <div className="grid grid-cols-7 gap-1">
                {Object.entries(dayMap).map(([day, abbr], index) => (
                  <div 
                    key={index} 
                    className={`text-center py-1 rounded ${
                      availableDays[day] 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {abbr}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Ages Served</h4>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(careGiver.agesServed) ? careGiver.agesServed : []).map((age: string, index: number) => (
                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
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
