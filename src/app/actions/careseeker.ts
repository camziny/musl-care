"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db, jobListings, careSeekers } from "@/server/db/schema";
import { SQL } from "drizzle-orm";

type CareRequestInput = {
  userType: string;
  guardianName: string;
  guardianImage: {
    url: string;
    alt: string;
  } | string;
  childrenImages?: string[];
  phoneNumber: string;
  email: string;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  isBackgroundChecked: boolean;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  careType: string;
  numberOfPeople: number;
  agesOfPeople: string[];
  availabilityType: string;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
    recurring: boolean;
  }[];
  serviceRequirements: {
    needsCooking: boolean;
    needsCare: boolean;
    needsFeedingChanging: boolean;
    needsShoppingErrands: boolean;
    needsPetCare: boolean;
    needsCleaning: boolean;
    needsOrganizing: boolean;
    needsTutoring: boolean;
    needsPacking: boolean;
    needsMealPrep: boolean;
  };
  petDetails?: {
    type: string;
    description: string;
  }[];
  requiredProfessionalSkills: {
    firstAidTraining: boolean;
    cprTraining: boolean;
    specialNeedsCare: boolean;
  };
  preferenceFilters?: {
    preferredEthnicity?: string[];
    preferredLanguages?: string[];
    preferredReligion?: string;
  };
};

export async function submitCareSeekingRequest(data: CareRequestInput) {
  'use server'; 
  
  
  try {
    const { userId: clerkUserId } = auth();
    
    if (!clerkUserId) {
      console.error("[SERVER] No authenticated user found");
      return { 
        success: false, 
        error: "Authentication required" 
      };
    }
    
    
    const user = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
    });

    if (!user) {
      console.error("[SERVER] User not found for clerkUserId:", clerkUserId);
      return { 
        success: false, 
        error: "User not found" 
      };
    }
    

    let careSeeker = await db.query.careSeekers.findFirst({
      where: (model, { eq }) => eq(model.userId, user.id),
    });

    if (!careSeeker) {
      try {
        await db.insert(careSeekers).values({
          userId: user.id,
        });
        
        careSeeker = await db.query.careSeekers.findFirst({
          where: (model, { eq }) => eq(model.userId, user.id),
        });
        
        if (!careSeeker) {
          console.error("[SERVER] Failed to create care seeker profile");
          return { 
            success: false, 
            error: "Failed to create care seeker profile" 
          };
        }
      } catch (error) {
        console.error("[SERVER] Error creating care seeker:", error);
        return { 
          success: false, 
          error: "Failed to create care seeker profile" 
        };
      }
    } 
    
    const jobTitle = `Looking for ${data.careType} - ${data.availabilityType}`;
    
    const services = Object.entries(data.serviceRequirements)
      .filter(([_, value]) => value)
      .map(([key]) => {
        const formattedKey = key.replace('needs', '');
        return formattedKey.charAt(0).toUpperCase() + formattedKey.slice(1);
      })
      .join(', ');
    
    const description = `
      Care Type: ${data.careType}
      Ages: ${data.agesOfPeople.join(', ')}
      Availability: ${data.availabilityType}
      ${services ? `Services needed: ${services}` : ''}
    `.trim();
    

    try {
      const metadataJson = JSON.stringify({
        legacy: true,
        version: "2.0"
      });
      
      try {
        const guardianImageValue = typeof data.guardianImage === 'string' 
          ? data.guardianImage 
          : data.guardianImage?.url || '';
          
        const jobData = {
          careSeekerId: careSeeker.id,
          title: jobTitle,
          description: description,
          creator: data.guardianName || "Anonymous",
          creatorUserId: clerkUserId,
          datePosted: new Date(),
          
          guardianName: data.guardianName,
          guardianImage: guardianImageValue,
          childrenImages: data.childrenImages || [],
          
          phoneNumber: data.phoneNumber,
          email: data.email,
          isPhoneVerified: data.isPhoneVerified,
          isEmailVerified: data.isEmailVerified,
          isBackgroundChecked: data.isBackgroundChecked,
          
          location: `${data.city}, ${data.state}`,
          address: data.address,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
          
          careType: data.careType,
          numberOfPeople: data.numberOfPeople,
          agesOfPeople: data.agesOfPeople,
          availabilityType: data.availabilityType,
          availability: data.availability,
          
          needsCooking: data.serviceRequirements.needsCooking,
          needsCare: data.serviceRequirements.needsCare,
          needsFeedingChanging: data.serviceRequirements.needsFeedingChanging,
          needsShoppingErrands: data.serviceRequirements.needsShoppingErrands,
          needsPetCare: data.serviceRequirements.needsPetCare,
          needsCleaning: data.serviceRequirements.needsCleaning,
          needsOrganizing: data.serviceRequirements.needsOrganizing,
          needsTutoring: data.serviceRequirements.needsTutoring,
          needsPacking: data.serviceRequirements.needsPacking,
          needsMealPrep: data.serviceRequirements.needsMealPrep,
          
          petDetails: data.petDetails || [],
          
          requiresFirstAidTraining: data.requiredProfessionalSkills.firstAidTraining,
          requiresCprTraining: data.requiredProfessionalSkills.cprTraining,
          requiresSpecialNeedsCare: data.requiredProfessionalSkills.specialNeedsCare,
          
          preferredEthnicity: data.preferenceFilters?.preferredEthnicity || [],
          preferredLanguages: data.preferenceFilters?.preferredLanguages || [],
          preferredReligion: data.preferenceFilters?.preferredReligion || null,
          
          metadata: metadataJson
        };
        
        await db.insert(jobListings).values(jobData as any);
        
        revalidatePath('/jobs');
        
        return { 
          success: true
        };
      } catch (dbError) {
        console.error("[SERVER] Database error creating job listing:", dbError);
        return { 
          success: false, 
          error: "Database error creating job listing" 
        };
      }
    } catch (error) {
      console.error("[SERVER] Error creating job listing:", error);
      if (error instanceof Error) {
        console.error("[SERVER] Error details:", error.message);
      } else {
        console.error("[SERVER] Unknown error type:", error);
      }
      return { 
        success: false, 
        error: "Failed to create job listing" 
      };
    }
  } catch (error) {
    console.error('[SERVER] Error in submitCareSeekingRequest:', error);
    if (error instanceof Error) {
      console.error('[SERVER] Error details:', error.message);
    }
    return { 
      success: false, 
      error: 'Failed to submit care seeking request. Please try again.' 
    };
  }
} 