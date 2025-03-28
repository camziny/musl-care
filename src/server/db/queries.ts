import "server-only";
import { db } from "./schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { careGivers, users, jobListings, careSeekers } from "./schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { CareGiver, ImageData } from "@/utils/types";

export async function getCaregivers() {
  const careGiversList = await db.query.careGivers.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
  return careGiversList;
}

export async function getCaregiver(id: number) {
  const careGiver = await db.query.careGivers.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });
  if (!careGiver) throw new Error("Caregiver not found");

  return careGiver;
}

export async function getCaregiverByClerkUserId(clerkUserId: string, throwOnNotFound = true) {
  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!user) {
    if (throwOnNotFound) throw new Error("User not found");
    return null;
  }

  const careGiver = await db.query.careGivers.findFirst({
    where: (model, { eq }) => eq(model.userId, user.id),
  });

  if (!careGiver) {
    if (throwOnNotFound) throw new Error("Caregiver not found");
    return null;
  }

  return careGiver;
}

export async function createCaregiver(data: CareGiver) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  // Try to find existing user
  let dbUser = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  // If user doesn't exist in our database, create them
  if (!dbUser) {
    console.log("User not found in database. Creating new user for:", clerkUserId);
    
    try {
      // Get user info from Clerk
      const clerkUser = await currentUser();
      if (!clerkUser) throw new Error("Could not fetch user data from Clerk");
      
      // Create new user in database
      const [newUser] = await db
        .insert(users)
        .values({
          clerkUserId: clerkUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      
      dbUser = newUser;
      console.log("Successfully created new user:", dbUser);
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user in database");
    }
  }

  const existingCareGiver = await db.query.careGivers.findFirst({
    where: (model, { eq }) => eq(model.userId, dbUser.id),
  });

  if (existingCareGiver) {
    throw new Error("Caregiver profile already exists for this user");
  }

  // Convert numeric values to strings for database
  const hourlyRateMin = data.hourlyRateMin !== undefined ? data.hourlyRateMin.toString() : "0";
  const hourlyRateMax = data.hourlyRateMax !== undefined ? data.hourlyRateMax.toString() : "0";

  await db.insert(careGivers).values({
    name: data.name,
    description: data.description,
    image: JSON.stringify(data.image),
    phoneNumber: data.phoneNumber,
    address: data.address,
    city: data.city,
    state: data.state,
    postalCode: data.postalCode,
    country: data.country,
    userType: data.userType,
    userId: dbUser.id,
    subscribed: data.subscribed,
    languages: data.languages,
    sect: data.sect,
    ethnicBackground: data.ethnicBackground,
    
    // New form fields
    careType: data.careType || null,
    religion: data.religion || null,
    muslimSect: data.muslimSect || null,
    agesServed: data.agesServed,
    careCapacity: data.careCapacity || null,
    termOfCare: data.termOfCare || null,
    
    // Professional info
    hourlyRateMin,
    hourlyRateMax,
    yearsExperience: data.yearsExperience,
    aboutMe: data.aboutMe,
    
    // Availability
    availability: JSON.stringify(data.availability),
    availabilityType: data.availabilityType || null,
    
    // Services
    canCook: data.canCook,
    hasTransportation: data.hasTransportation,
    canShopErrands: data.canShopErrands,
    canHelpWithPets: data.canHelpWithPets,
    canClean: data.canClean,
    canOrganize: data.canOrganize,
    canTutor: data.canTutor,
    canPack: data.canPack,
    canMealPrep: data.canMealPrep,
    
    // Health & Skills
    isVaccinated: data.isVaccinated,
    isSmoker: data.isSmoker,
    firstAidTraining: data.professionalSkills.firstAidTraining,
    cprTraining: data.professionalSkills.cprTraining,
    specialNeedsCare: data.professionalSkills.specialNeedsCare,
    
    backgroundChecked: data.backgroundChecked,
  });

  redirect("/");
}

export async function updateCareGiver(id: number, data: Partial<CareGiver>) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!user) throw new Error("User not found");

  // Create a clean object for the update operation
  const updatedData: Record<string, any> = {};
  
  // Copy primitive fields directly
  Object.keys(data).forEach(key => {
    if (key !== 'image' && key !== 'professionalSkills' && 
        key !== 'hourlyRateMin' && key !== 'hourlyRateMax' && 
        key !== 'availability') {
      updatedData[key] = data[key as keyof typeof data];
    }
  });
  
  // Handle image conversion
  if (data.image) {
    updatedData.image = JSON.stringify(data.image);
  }
  
  // Handle professional skills
  if (data.professionalSkills) {
    updatedData.firstAidTraining = data.professionalSkills.firstAidTraining;
    updatedData.cprTraining = data.professionalSkills.cprTraining;
    updatedData.specialNeedsCare = data.professionalSkills.specialNeedsCare;
  }
  
  // Handle hourly rate
  if (data.hourlyRateMin !== undefined) {
    updatedData.hourlyRateMin = data.hourlyRateMin.toString();
  }
  if (data.hourlyRateMax !== undefined) {
    updatedData.hourlyRateMax = data.hourlyRateMax.toString();
  }
  
  // Handle availability
  if (data.availability) {
    updatedData.availability = JSON.stringify(data.availability);
  }
  
  // Handle enum types
  if (data.careType) updatedData.careType = data.careType || null;
  if (data.religion) updatedData.religion = data.religion || null;
  if (data.muslimSect) updatedData.muslimSect = data.muslimSect || null;
  if (data.careCapacity) updatedData.careCapacity = data.careCapacity || null;
  if (data.termOfCare) updatedData.termOfCare = data.termOfCare || null;
  if (data.availabilityType) updatedData.availabilityType = data.availabilityType || null;

  await db
    .update(careGivers)
    .set(updatedData)
    .where(and(eq(careGivers.id, id), eq(careGivers.userId, user.id)));

  redirect("/");
}

export async function deleteCareGiver(id: number) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");

  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!user) throw new Error("User not found");

  await db
    .delete(careGivers)
    .where(and(eq(careGivers.id, id), eq(careGivers.userId, user.id)));

  redirect("/");
}

interface CareSeeker {
  id: number;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export async function getOrCreateCareSeekerByClerkUserId(
  clerkUserId: string
): Promise<CareSeeker> {
  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!user) {
    console.error("User not found for clerkUserId:", clerkUserId);
    throw new Error("User not found");
  }

  console.log("Database user found:", user);

  let careSeeker = await db.query.careSeekers.findFirst({
    where: (model, { eq }) => eq(model.userId, user.id),
  });

  if (!careSeeker) {
    console.log("Care Seeker not found, creating new one for userId:", user.id);
    try {
      await db.insert(careSeekers).values({
        userId: user.id,
      });

      careSeeker = await db.query.careSeekers.findFirst({
        where: (model, { eq }) => eq(model.userId, user.id),
      });

      if (!careSeeker) {
        console.error(
          "Failed to retrieve Care Seeker after insertion for userId:",
          user.id
        );
        throw new Error("Failed to create Care Seeker");
      }

      console.log("New Care Seeker created:", careSeeker);
    } catch (insertError) {
      console.error("Error inserting Care Seeker:", insertError);
      throw new Error("Error inserting Care Seeker");
    }
  } else {
    console.log("Care Seeker found:", careSeeker);
  }

  return careSeeker;
}

export interface JobFormData {
  title: string;
  description: string;
  creator: string;
  creatorUserId: string;
  datePosted: Date;
  location: string;
}

export async function createJobForm(data: JobFormData) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    console.error("Unauthorized: No user ID found.");
    throw new Error("Unauthorized");
  }

  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!user) {
    console.error("User not found for clerkUserId:", clerkUserId);
    throw new Error("User not found");
  }

  const careSeeker = await db.query.careSeekers.findFirst({
    where: (model, { eq }) => eq(model.userId, user.id),
  });

  if (!careSeeker) {
    console.error("Care Seeker not found for userId:", user.id);
    throw new Error("Care Seeker not found");
  }

  try {
    await db.insert(jobListings).values({
      careSeekerId: careSeeker.id,
      title: data.title,
      description: data.description,
      creator: data.creator,
      creatorUserId: clerkUserId,
      datePosted: data.datePosted,
      location: data.location,
    });
  } catch (error) {
    console.error("Error inserting job listing:", error);
    throw new Error("Failed to create job listing");
  }
}

export async function registerCareSeeker() {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  let careSeeker = await db.query.careSeekers.findFirst({
    where: (model, { eq }) => eq(model.userId, user.id),
  });

  if (!careSeeker) {
    await db.insert(careSeekers).values({
      userId: user.id,
    });

    careSeeker = await db.query.careSeekers.findFirst({
      where: (model, { eq }) => eq(model.userId, user.id),
    });

    if (!careSeeker) {
      throw new Error("Failed to create Care Seeker");
    }
  }

  return careSeeker;
}

export async function getJobListings() {
  const jobListingList = await db.query.jobListings.findMany({
    orderBy: (model, { desc }) => desc(model.id),
    columns: {
      id: true,
      title: true,
      description: true,
      creator: true,
      creatorUserId: true,
      careSeekerId: true,
    },
  });
  return jobListingList;
}

export async function getJobListing(id: number) {
  const jobListing = await db.query.jobListings.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });
  if (!jobListing) throw new Error("Job listing not found");

  return jobListing;
}

export async function updateJobListing(id: number, data: Partial<JobFormData>) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    throw new Error("Unauthorized: No user ID found.");
  }

  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  const jobListing = await db.query.jobListings.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });

  if (!jobListing || jobListing.careSeekerId !== user.id) {
    throw new Error("Unauthorized or job not found");
  }

  await db.update(jobListings).set(data).where(eq(jobListings.id, id));

  console.log("Job listing updated:", { id, ...data });
}

export async function deleteJobListing(jobId: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Unauthorized: No user logged in.");
  }

  const dbUser = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, user.id),
  });

  if (!dbUser) {
    throw new Error("User not found.");
  }

  const jobListing = await db.query.jobListings.findFirst({
    where: (model, { eq }) => eq(model.id, jobId),
  });

  if (!jobListing || jobListing.creatorUserId !== dbUser.clerkUserId) {
    throw new Error(
      "Forbidden: You do not have permission to delete this job."
    );
  }

  await db.delete(jobListings).where(eq(jobListings.id, jobId));

  console.log("Job listing deleted:", { jobId });
}
