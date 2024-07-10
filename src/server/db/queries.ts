import "server-only";
import { db } from "./schema";
import { auth } from "@clerk/nextjs/server";
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

export async function getCaregiverByClerkUserId(clerkUserId: string) {
  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!user) throw new Error("User not found");

  const careGiver = await db.query.careGivers.findFirst({
    where: (model, { eq }) => eq(model.userId, user.id),
  });

  if (!careGiver) throw new Error("Caregiver not found");

  return careGiver;
}

export async function createCaregiver(data: CareGiver) {
  const user = auth();
  if (!user.userId) throw new Error("Unauthorized");

  const dbUser = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, user.userId),
  });

  if (!dbUser) throw new Error("User not found");

  const existingCareGiver = await db.query.careGivers.findFirst({
    where: (model, { eq }) => eq(model.userId, dbUser.id),
  });

  if (existingCareGiver) {
    throw new Error("Caregiver profile already exists for this user");
  }

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
    hourlyRate: data.hourlyRate,
    availability: data.availability,
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

  type UpdateData = Omit<Partial<CareGiver>, "image"> & { image?: string };

  const updatedData: UpdateData = { ...data } as UpdateData;
  if (data.image) {
    updatedData.image = JSON.stringify(data.image);
  }

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

interface JobFormData {
  title: string;
  description: string;
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

  console.log("Database user found:", user);

  const careSeeker = await db.query.careSeekers.findFirst({
    where: (model, { eq }) => eq(model.userId, user.id),
  });

  if (!careSeeker) {
    console.error("Care Seeker not found for userId:", user.id);
    throw new Error("Care Seeker not found");
  }

  console.log("Care Seeker found:", careSeeker);

  try {
    await db.insert(jobListings).values({
      careSeekerId: careSeeker.id,
      title: data.title,
      description: data.description,
    });

    console.log("Job listing created:", {
      careSeekerId: careSeeker.id,
      title: data.title,
      description: data.description,
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
