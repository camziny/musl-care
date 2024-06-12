import "server-only";
import { db } from "./schema";
import { careGivers } from "./schema";
import { and, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

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
