import { getJobListing } from "@/server/db/queries";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";

type Service = {
  name: string;
  included: boolean;
};

interface JobListing {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  careSeekerId: number;
  title: string;
  creator: string;
  creatorUserId: string;
  datePosted: Date;
  location: string;
  
  guardianName?: string;
  guardianImage?: string;
  childrenImages?: string[];
  
  phoneNumber?: string;
  email?: string;
  isPhoneVerified?: boolean;
  isEmailVerified?: boolean;
  isBackgroundChecked?: boolean;
  
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  
  careType?: string;
  numberOfPeople?: number;
  agesOfPeople?: string[];
  availabilityType?: string;
  availability?: any;
  
  needsCooking?: boolean;
  needsCare?: boolean;
  needsFeedingChanging?: boolean;
  needsShoppingErrands?: boolean;
  needsPetCare?: boolean;
  needsCleaning?: boolean;
  needsOrganizing?: boolean;
  needsTutoring?: boolean;
  needsPacking?: boolean;
  needsMealPrep?: boolean;
  
  petDetails?: any[];
  
  requiresFirstAidTraining?: boolean;
  requiresCprTraining?: boolean;
  requiresSpecialNeedsCare?: boolean;
  
  preferredEthnicity?: string[];
  preferredLanguages?: string[];
  preferredReligion?: string;
  preferredMuslimSect?: string;
  
  metadata?: string | any;
}

export default async function JobShowPage(props: { id: number }) {
  const job = await getJobListing(props.id) as JobListing;
  
  let metadata: any = {};
  try {
    if (job.metadata) {
      if (typeof job.metadata === 'string') {
        metadata = JSON.parse(job.metadata);
      } else if (typeof job.metadata === 'object') {
        metadata = job.metadata;
      }
    }
  } catch (error) {
    console.error("Error parsing job metadata:", error);
  }

  let pageTitle = job.title;
  if (pageTitle.includes("Untitled") || pageTitle.includes("Looking for")) {
    const careType = job.careType || metadata.careType;
    const location = job.city ? `in ${job.city}` : "";
    if (careType) {
      pageTitle = `${careType} Needed ${location}`.trim();
    }
  }

  const services: Service[] = [];
  
  if (job.needsCooking) services.push({ name: 'Cooking', included: true });
  if (job.needsCare) services.push({ name: 'Care', included: true });
  if (job.needsFeedingChanging) services.push({ name: 'Feeding/Changing', included: true });
  if (job.needsShoppingErrands) services.push({ name: 'Shopping/Errands', included: true });
  if (job.needsPetCare) services.push({ name: 'Pet Care', included: true });
  if (job.needsCleaning) services.push({ name: 'Cleaning', included: true });
  if (job.needsOrganizing) services.push({ name: 'Organizing', included: true });
  if (job.needsTutoring) services.push({ name: 'Tutoring', included: true });
  if (job.needsPacking) services.push({ name: 'Packing', included: true });
  if (job.needsMealPrep) services.push({ name: 'Meal Prep', included: true });
  
  if (services.length === 0) {
    if (metadata.services && Array.isArray(metadata.services)) {
      metadata.services.forEach((name: string) => {
        let displayName = name;
        if (name.startsWith('needs')) {
          displayName = name.replace('needs', '');
        }
        services.push({
          name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
          included: true
        });
      });
    }
    
    if (metadata.serviceRequirements) {
      Object.entries(metadata.serviceRequirements).forEach(([key, value]: [string, any]) => {
        if (value === true) {
          const name = key.replace('needs', '');
          services.push({
            name: name.charAt(0).toUpperCase() + name.slice(1),
            included: true
          });
        }
      });
    }
  }

  const professionalSkills: Service[] = [];
  
  if (job.requiresFirstAidTraining) professionalSkills.push({ name: 'First Aid Training', included: true });
  if (job.requiresCprTraining) professionalSkills.push({ name: 'CPR Training', included: true });
  if (job.requiresSpecialNeedsCare) professionalSkills.push({ name: 'Special Needs Care', included: true });
  
  if (professionalSkills.length === 0) {
    if (metadata.skills && Array.isArray(metadata.skills)) {
      metadata.skills.forEach((skill: string) => {
        let displayName = skill;
        if (skill === 'cprTraining' || skill === 'CPR Training') {
          displayName = 'CPR Training';
        } else if (skill === 'firstAidTraining' || skill === 'First Aid Training') {
          displayName = 'First Aid Training';
        } else if (skill === 'specialNeedsCare' || skill === 'Special Needs Care') {
          displayName = 'Special Needs Care';
        }
        
        professionalSkills.push({
          name: displayName,
          included: true
        });
      });
    }

    if (metadata.requiredProfessionalSkills) {
      Object.entries(metadata.requiredProfessionalSkills).forEach(([key, value]: [string, any]) => {
        if (value === true) {
          professionalSkills.push({
            name: key === 'cprTraining' ? 'CPR Training' : 
                  key === 'firstAidTraining' ? 'First Aid Training' : 
                  'Special Needs Care',
            included: true
          });
        }
      });
    }
  }

  let guardianImage = '';
  let childrenImages: string[] = [];
  
  if (job.guardianImage) {
    guardianImage = job.guardianImage;
  } else if (metadata.guardianImage) {
    try {
      if (typeof metadata.guardianImage === 'string') {
        guardianImage = metadata.guardianImage;
      } else if (typeof metadata.guardianImage === 'object') {
        if (metadata.guardianImage.url) {
          guardianImage = metadata.guardianImage.url;
        }
      }
    } catch (error) {
      console.error("Error extracting guardian image from metadata:", error);
    }
  }

  if (job.childrenImages && Array.isArray(job.childrenImages)) {
    childrenImages = job.childrenImages.filter(img => img);
  } else if (metadata.childrenImages) {
    try {
      if (Array.isArray(metadata.childrenImages)) {
        childrenImages = metadata.childrenImages
          .filter((img: any) => img) 
          .map((img: any) => {
            if (typeof img === 'object' && img && img.url) {
              return img.url;
            }
            if (typeof img === 'string') {
              return img;
            }
            return null;
          })
          .filter(Boolean) as string[];   
      }
    } catch (error) {
      console.error("Error extracting children images from metadata:", error);
    }
  }

  if (!guardianImage) {
    guardianImage = "/default-profile.jpg";
  }

  const availabilitySchedule: any[] = [];
  try {
    if (job.availability) {
      if (Array.isArray(job.availability)) {
        availabilitySchedule.push(...job.availability);
      } else if (typeof job.availability === 'object') {
        Object.entries(job.availability).forEach(([day, times]: [string, any]) => {
          if (times && typeof times === 'object') {
            availabilitySchedule.push({
              day,
              startTime: times.startTime || '',
              endTime: times.endTime || '',
              recurring: times.recurring || false
            });
          }
        });
      }
    } 
    else if (metadata.availability) {
      if (Array.isArray(metadata.availability)) {
        availabilitySchedule.push(...metadata.availability);
      } else if (typeof metadata.availability === 'object') {
        Object.entries(metadata.availability).forEach(([day, times]: [string, any]) => {
          if (times && typeof times === 'object') {
            availabilitySchedule.push({
              day,
              startTime: times.startTime || '',
              endTime: times.endTime || '',
              recurring: times.recurring || false
            });
          }
        });
      }
    }
  } catch (error) {
    console.error("Error processing availability:", error);
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link 
            href="/jobs" 
            className="text-slate-600 hover:text-slate-800 flex items-center gap-1 text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to All Listings
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-6 py-8">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
              <div className="shrink-0">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white">
                  {guardianImage.startsWith('data:') ? (
                    <img
                      src={guardianImage}
                      alt="Guardian"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Image
                      src={guardianImage}
                      alt="Guardian"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      unoptimized
                    />
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{pageTitle}</h1>
                <div className="flex items-center text-slate-200 text-sm">
                  <span className="mr-3">Posted: {format(new Date(job.datePosted), 'MMMM d, yyyy')}</span>
                  <span className="mr-3">•</span>
                  <span>{job.location}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 p-6">
            <div className="md:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Care Request Overview</h2>
                <div className="space-y-4">
                  <div className="prose max-w-none text-slate-700">
                    {job.description.split('\n').map((paragraph, idx) => (
                      paragraph.trim() ? (
                        <p key={idx} className="mb-2">{paragraph.trim()}</p>
                      ) : null
                    ))}
                  </div>
                  
                  {job.guardianName && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm text-slate-600 mb-1">
                        <span className="font-medium text-slate-700">Posted by:</span> {job.guardianName}
                      </p>
                      <p className="text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Posted on:</span> {format(new Date(job.datePosted), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}

                  {!job.guardianName && (
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium text-slate-700">Posted on:</span> {format(new Date(job.datePosted), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Children</h2>
                <div className="flex flex-wrap gap-4">
                  {childrenImages.length > 0 ? (
                    childrenImages.map((image: string, index: number) => (
                      <div key={index} className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200">
                        {image.startsWith('data:') ? (
                          <img
                            src={image}
                            alt={`Child ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={image}
                            alt={`Child ${index + 1}`}
                            width={160}
                            height={160}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                            unoptimized
                          />
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No children images provided</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Care Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Care Type</h3>
                      <p className="text-sm text-slate-600">{job.careType || metadata.careType || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Age Groups</h3>
                      <p className="text-sm text-slate-600">
                        {job.agesOfPeople?.length 
                          ? job.agesOfPeople.join(', ') 
                          : (metadata.agesOfPeople?.length 
                              ? metadata.agesOfPeople.join(', ') 
                              : "Not specified")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Availability Type</h3>
                      <p className="text-sm text-slate-600">{job.availabilityType || metadata.availabilityType || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Location</h3>
                      <p className="text-sm text-slate-600">
                        {job.address 
                          ? `${job.address}, ${job.city || ''}, ${job.state || ''} ${job.postalCode || ''}`
                          : job.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Religious Preference</h3>
                      <p className="text-sm text-slate-600">
                        {job.preferredReligion || 
                         metadata.preferences?.religion || 
                         metadata.preferenceFilters?.preferredReligion || 
                         "No specific preference"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-600 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-slate-900">Number of People</h3>
                      <p className="text-sm text-slate-600">{job.numberOfPeople || metadata.numberOfPeople || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Availability Schedule</h2>
                <div className="space-y-3">
                  {availabilitySchedule.length > 0 ? (
                    availabilitySchedule.map((slot: any, idx: number) => (
                      <div key={idx} className="flex items-center py-2 border-b border-slate-100 last:border-0">
                        <div className="w-24 font-medium text-slate-700">{slot.day}</div>
                        <div className="text-slate-600">{slot.startTime} - {slot.endTime}</div>
                        {slot.recurring && (
                          <span className="ml-auto bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded">
                            Recurring
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500 italic">No specific availability schedule provided</p>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <h2 className="font-semibold text-slate-800">Services Required</h2>
                </div>
                <div className="p-4">
                  <ul className="divide-y divide-slate-200">
                    {services.map((service, idx) => (
                      <li key={idx} className="py-2 flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700">{service.name}</span>
                      </li>
                    ))}
                    {services.length === 0 && (
                      <li className="py-2 text-sm text-slate-500 italic">No specific services required</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <h2 className="font-semibold text-slate-800">Professional Skills</h2>
                </div>
                <div className="p-4">
                  <ul className="divide-y divide-slate-200">
                    {professionalSkills.map((skill, idx) => (
                      <li key={idx} className="py-2 flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-slate-700">{skill.name}</span>
                      </li>
                    ))}
                    {professionalSkills.length === 0 && (
                      <li className="py-2 text-sm text-slate-500 italic">No specific professional skills required</li>
                    )}
                  </ul>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <h2 className="font-semibold text-slate-800">Contact & Verification</h2>
                </div>
                <div className="p-4 space-y-3">
                  <div className="text-sm text-slate-700">
                    <span className="font-medium text-slate-800">Phone:</span> {job.phoneNumber || (metadata.phoneNumber as any) || "Not provided"}
                  </div>
                  <div className="text-sm text-slate-700">
                    <span className="font-medium text-slate-800">Email:</span> {job.email || (metadata.email as any) || "Not provided"}
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs border ${job.isPhoneVerified ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      {job.isPhoneVerified ? "Phone Verified" : "Phone Unverified"}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs border ${job.isEmailVerified ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      {job.isEmailVerified ? "Email Verified" : "Email Unverified"}
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs border ${job.isBackgroundChecked ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
                      {job.isBackgroundChecked ? "Background Checked" : "No Background Check"}
                    </span>
                  </div>
                </div>
              </div>

              {((Array.isArray(job.petDetails) && job.petDetails.length > 0) || (Array.isArray(metadata.petDetails) && metadata.petDetails.length > 0)) && (
                <div className="bg-white rounded-lg shadow-sm border border-slate-200">
                  <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-semibold text-slate-800">Pet Details</h2>
                  </div>
                  <div className="p-4 space-y-2">
                    {((job.petDetails as any[]) || (metadata.petDetails as any[]) || []).map((pd: any, idx: number) => (
                      <div key={idx} className="text-sm text-slate-700 border-b last:border-0 border-slate-100 pb-2">
                        {typeof pd === "string" ? pd : JSON.stringify(pd)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 mb-6">
                <h3 className="font-semibold text-slate-800 mb-3">Preferences</h3>
                <div className="space-y-4">
                  {(job.preferredReligion || metadata.preferences?.religion || metadata.preferenceFilters?.preferredReligion) && (
                    <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200">
                      <span className="font-medium text-slate-700 block mb-1">Religion</span>
                      <span className="text-slate-600">
                        {job.preferredReligion || metadata.preferences?.religion || metadata.preferenceFilters?.preferredReligion}
                      </span>
                    </div>
                  )}
                  
                  {(job.preferredMuslimSect) && (
                    <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200">
                      <span className="font-medium text-slate-700 block mb-1">Muslim Sect</span>
                      <span className="text-slate-600">{job.preferredMuslimSect}</span>
                    </div>
                  )}
                  
                  {((job.preferredLanguages && job.preferredLanguages.length > 0) || 
                    metadata.preferences?.languages?.length > 0 || 
                    metadata.preferenceFilters?.preferredLanguages?.length > 0) && (
                    <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200">
                      <span className="font-medium text-slate-700 block mb-1">Languages</span>
                      <span className="text-slate-600">
                        {(job.preferredLanguages && job.preferredLanguages.length > 0) 
                          ? job.preferredLanguages.join(', ') 
                          : (metadata.preferences?.languages?.length > 0
                            ? metadata.preferences.languages.join(', ')
                            : metadata.preferenceFilters?.preferredLanguages?.join(', '))}
                      </span>
                    </div>
                  )}
                  
                  {((job.preferredEthnicity && job.preferredEthnicity.length > 0) || 
                    metadata.preferences?.ethnicity?.length > 0 || 
                    metadata.preferenceFilters?.preferredEthnicity?.length > 0) && (
                    <div className="px-3 py-2 bg-slate-50 rounded border border-slate-200">
                      <span className="font-medium text-slate-700 block mb-1">Ethnicity</span>
                      <span className="text-slate-600">
                        {(job.preferredEthnicity && job.preferredEthnicity.length > 0)
                          ? job.preferredEthnicity.join(', ')
                          : (metadata.preferences?.ethnicity?.length > 0
                            ? metadata.preferences.ethnicity.join(', ')
                            : metadata.preferenceFilters?.preferredEthnicity?.join(', '))}
                      </span>
                    </div>
                  )}
                  
                  {!job.preferredReligion && 
                   !(job.preferredLanguages && job.preferredLanguages.length > 0) && 
                   !(job.preferredEthnicity && job.preferredEthnicity.length > 0) &&
                   !metadata.preferences?.religion && 
                   !metadata.preferences?.languages?.length && 
                   !metadata.preferences?.ethnicity?.length &&
                   !metadata.preferenceFilters?.preferredReligion && 
                   !metadata.preferenceFilters?.preferredLanguages?.length && 
                   !metadata.preferenceFilters?.preferredEthnicity?.length && (
                    <div className="text-slate-500 italic">No specific preferences provided</div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg shadow-sm border border-slate-200 p-4">
                <h3 className="font-semibold text-slate-800 mb-3">Contact Options</h3>
                <div className="space-y-3">
                  <Link href="/my-profile" 
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-800 hover:bg-slate-700">
                    View Your Profile
                  </Link>
                  <button
                    className="w-full flex items-center justify-center px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50"
                  >
                    Message Care Seeker
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
