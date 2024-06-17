import "server-only";
import { db } from "./schema";
import { careGivers } from "./schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { CareGiver } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";

export async function getCaregivers() {
  const careGivers = await db.query.careGivers.findMany({
    orderBy: (model, { desc }) => desc(model.id),
  });
  return careGivers;
}

export async function getCaregiver(id: number) {
  const careGiver = await db.query.careGivers.findFirst({
    where: (model, { eq }) => eq(model.id, id),
  });
  if (!careGiver) throw new Error("Image not found");

  return careGiver;
}

export async function createCaregiver(data: CareGiver) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("unauthorized");

  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!user) throw new Error("User not found");

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
    userId: user.id,
  });

  redirect("/");
}
