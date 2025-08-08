import { getJobListings } from "@/server/db/queries";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import DeleteJobButton from "../_components/DeleteJobButton";
import Image from "next/image";
import { format } from "date-fns";
import dynamic from "next/dynamic";
const SafeImage = dynamic(() => import('@/components/ui/SafeImage'), { ssr: false });

interface JobBasicInfo {
  id: number;
  title: string;
  description: string;
  creator: string;
  creatorUserId: string;
  careSeekerId: number;
  metadata?: string | Record<string, any>;
}

interface EnhancedJob extends JobBasicInfo {
  careType: string | null;
  availabilityType: string | null;
  location: string;
  datePosted: Date;
  metadata: Record<string, any>;
  guardianImage: string | null;
  childrenImages: string[];
}

const getCareTypeImage = (careType: string | null): string => {
  if (!careType) return "/default-care-icon.svg";
  
  const careTypeLower = careType.toLowerCase();
  if (careTypeLower.includes("child")) return "/child-care-icon.svg";
  if (careTypeLower.includes("elder") || careTypeLower.includes("senior")) return "/elderly-care-icon.svg";
  if (careTypeLower.includes("both")) return "/family-care-icon.svg";
  
  return "/default-care-icon.svg";
};

const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string' || url.trim() === '') return false;
  
  if (url.startsWith('data:image/')) return true;
  
  if (url.includes('utfs.io') || url.includes('uploadthing.com')) {
    return true;
  }
  
  const hasProtocol = url.startsWith('http://') || url.startsWith('https://');
  if (!hasProtocol) {
    url = `https:${url}`;
    if (!url.startsWith('https://')) {
      url = `https://${url}`;
    }
  }
  
  try {
    new URL(url);
  } catch {
    return false;
  }
  
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp', '.avif', '.bmp', '.ico'];
  const hasImageExtension = imageExtensions.some(ext => url.toLowerCase().endsWith(ext));
  
  if (hasImageExtension) return true;
  
  const commonImageHosts = [
    'utfs.io', 
    'uploadthing.com',
    'res.cloudinary.com', 
    'images.unsplash.com',
    'lh3.googleusercontent.com',
    'firebasestorage.googleapis.com',
    's3.amazonaws.com',
    'githubusercontent.com'
  ];
  
  return commonImageHosts.some(host => url.includes(host));
};

const hardcodedImages: Record<number, string> = {
  1: "https://utfs.io/f/abc123-example.jpg",
};

const getGuardianImage = (job: EnhancedJob): string => {
  try {
    const defaultImagePath = getCareTypeIcon(job.careType);
    
    if (job.guardianImage && typeof job.guardianImage === 'string') {
      const imageUrl = job.guardianImage.trim();
      
      if (isValidImageUrl(imageUrl)) {
        return imageUrl;
      }
    }
    
    if (job.metadata) {
      if (typeof job.metadata.guardianImage === 'string') {
        const imageUrl = job.metadata.guardianImage.trim();
        
        if (isValidImageUrl(imageUrl)) {
          return imageUrl;
        }
      } 
      
      else if (
        typeof job.metadata.guardianImage === 'object' && 
        job.metadata.guardianImage !== null
      ) {
        const possibleUrlProps = ['url', 'fileUrl', 'fileURL', 'href', 'src', 'path'];
        
        for (const prop of possibleUrlProps) {
          const url = job.metadata.guardianImage[prop];
          if (typeof url === 'string' && url.trim() !== '') {
            if (isValidImageUrl(url)) {
              return url;
            }
          }
        }
      }
      
      const imageUrlProps = [
        'guardianImageUrl', 
        'guardianImg', 
        'userImage', 
        'userImg', 
        'userAvatar',
        'image',
        'profileImage',
        'profilePicture'
      ];
      
      for (const prop of imageUrlProps) {
        if (typeof job.metadata[prop] === 'string') {
          const url = job.metadata[prop].trim();
          if (isValidImageUrl(url)) {
            return url;
          }
        } else if (
          typeof job.metadata[prop] === 'object' && 
          job.metadata[prop] !== null &&
          typeof job.metadata[prop].url === 'string'
        ) {
          const url = job.metadata[prop].url.trim();
          if (isValidImageUrl(url)) {
            return url;
          }
        }
      }
    }
    
    return defaultImagePath;
  } catch (error) {
    return getCareTypeIcon(job.careType);
  }
};

const getCareTypeIcon = (careType: string | null): string => {
  if (careType?.toLowerCase().includes('child')) {
    return "/child-care-icon.svg";
  } else if (careType?.toLowerCase().includes('elder') || careType?.toLowerCase().includes('senior')) {
    return "/elderly-care-icon.svg";
  } else {
    return "/default-care-icon.svg";
  }
};

export default async function JobList() {
  const user = await currentUser();
  const jobs = await getJobListings();

  const enhancedJobs = await Promise.all(jobs.map(async (job) => {
    try {
      let metadata: Record<string, any> = {};
      
      try {
        const typedJob = job as JobBasicInfo;
        if (typedJob.metadata && typeof typedJob.metadata === 'string' && typedJob.metadata.trim()) {
          metadata = JSON.parse(typedJob.metadata);
        } else if (typedJob.metadata && typeof typedJob.metadata === 'object') {
          metadata = typedJob.metadata as Record<string, any>;
        }
      } catch (e) {
      }
      
      const guardianImage = (job as any).guardianImage || null;
      const childrenImages = Array.isArray((job as any).childrenImages) ? (job as any).childrenImages : [];
      const careType = (job as any).careType || metadata?.careType || null;
      const availabilityType = (job as any).availabilityType || metadata?.availabilityType || null;
      const location = (job as any).location || metadata?.location || "Unknown location";
      
      const datePosted = (job as any).datePosted || new Date();
      
      let parsedGuardianImage = guardianImage;
      if (typeof guardianImage === 'string' && (guardianImage.startsWith('"') || guardianImage.startsWith('{'))) {
        try {
          const parsed = JSON.parse(guardianImage);
          if (typeof parsed === 'string') {
            parsedGuardianImage = parsed;
          } else if (typeof parsed === 'object' && parsed !== null && parsed.url) {
            parsedGuardianImage = parsed.url;
          }
        } catch (e) {
        }
      }
      
      const careTypeMatch = !careType ? job.description.match(/Care Type: ([^\\n]+)/) : null;
      const extractedCareType = careType || (careTypeMatch ? careTypeMatch[1].trim() : null);
      
      const availabilityMatch = !availabilityType ? job.description.match(/Availability: ([^\\n]+)/) : null;
      const extractedAvailability = availabilityType || (availabilityMatch ? availabilityMatch[1].trim() : null);
      
      const locationMatch = !location ? job.description.match(/Location: ([^\\n]+)/) : null;
      const extractedLocation = location || (locationMatch ? locationMatch[1].trim() : "Unknown location");
      
      return {
        ...job,
        careType: extractedCareType,
        availabilityType: extractedAvailability,
        location: extractedLocation,
        datePosted,
        guardianImage: parsedGuardianImage,
        childrenImages,
        metadata
      } as EnhancedJob;
    } catch (error) {
      console.error(`Error enhancing job ${job.id}:`, error);
      return {
        ...job,
        location: "Unknown location",
        datePosted: new Date(),
        metadata: {},
        careType: null,
        availabilityType: null,
        guardianImage: null,
        childrenImages: [],
      } as EnhancedJob;
    }
  }));

  const generatePageTitle = (job: EnhancedJob) => {
    if (job.title.includes("Untitled") || job.title.includes("Looking for")) {
      const careType = job.careType || "Care";
      const location = job.location?.split(",")?.[0] || "";
      return `${careType} Needed ${location ? `in ${location}` : ""}`.trim();
    }
    return job.title;
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="z-10 w-full max-w-5xl mx-auto pt-4 sm:pt-6 md:pt-8 pb-6 sm:pb-8 px-4 sm:px-6">
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 text-center mb-2 sm:mb-3">Care Requests</h1>
          <p className="text-slate-600 text-center mb-5 sm:mb-6 max-w-2xl text-sm sm:text-base px-2">
            Browse available care requests or post your own care needs to find the perfect caregiver match.
          </p>
        </div>
        
        {enhancedJobs.length > 0 ? (
          <div className="space-y-4">
            {enhancedJobs.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="block"
              >
                <div className="bg-white shadow rounded-xl overflow-hidden border border-slate-100 hover:shadow-md transition-all duration-200 hover:-translate-y-1 transform">
                  <div className="flex flex-row">
                    <div className="w-1/5 sm:w-1/6 bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center p-3 sm:p-4 self-stretch">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-indigo-100 shadow-md bg-white flex items-center justify-center relative hover:shadow-lg transition-all duration-200">
                        <SafeImage 
                          src={getGuardianImage(job)}
                          alt={job.careType || "Care"}
                          className="object-cover hover:scale-105 transition-transform duration-200"
                          fallbackSrc={getCareTypeIcon(job.careType)}
                          fill
                          sizes="(max-width: 640px) 80px, 96px"
                          quality={80}
                          unoptimized={true}
                          priority={job.id < 3}
                        />
                      </div>
                    </div>

                    <div className="flex-1 p-4 pl-3 sm:pl-4">
                      <div className="mb-2 text-lg font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {job.title}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-2">
                        {job.careType && (
                          <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {job.careType}
                          </span>
                        )}
                        {job.availabilityType && (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
                            {job.availabilityType}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center text-sm text-slate-500 mb-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {job.location}
                      </div>

                      <div className="flex items-center text-xs text-slate-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Posted {format(job.datePosted, "MMM d, yyyy")}
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center px-4 bg-slate-50 text-slate-400">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-6 w-6" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M9 5l7 7-7 7" 
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 sm:py-12 bg-white rounded-lg shadow-sm border border-slate-200 mx-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-10 sm:w-10 mx-auto text-slate-400 mb-2 sm:mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-base sm:text-lg font-medium text-slate-700 mb-1.5 sm:mb-2">No care requests yet</h3>
            <p className="text-slate-500 text-xs sm:text-sm mb-4 sm:mb-5">Be the first to post a care request</p>
            
            {user ? (
              <Link href="/looking-for-care">
                <button className="bg-slate-700 hover:bg-slate-800 text-white font-medium py-1.5 px-4 sm:py-2 sm:px-5 rounded-lg transition-colors shadow-sm text-xs sm:text-sm">
                  Post Your Care Request
                </button>
              </Link>
            ) : (
              <Link href="/sign-in">
                <button className="bg-slate-700 hover:bg-slate-800 text-white font-medium py-1.5 px-4 sm:py-2 sm:px-5 rounded-lg transition-colors shadow-sm text-xs sm:text-sm">
                  Sign In to Post Care Requests
                </button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
