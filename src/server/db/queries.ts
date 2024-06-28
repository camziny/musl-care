import "server-only";
import { db } from "./schema";
import { auth } from "@clerk/nextjs/server";
import { careGivers, users } from "./schema";
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
