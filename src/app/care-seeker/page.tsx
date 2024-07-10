// /pages/care-seeker.tsx
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db/schema";
import { careSeekers } from "@/server/db/schema";
import RegisterCareSeeker from "../_components/RegisterCareSeeker";
import CareSeekerForm from "../_components/CareSeekerForm";

export default async function CareSeekerPage() {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    return <p>Unauthorized</p>;
  }

  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!user) {
    return <p>User not found</p>;
  }

  const careSeeker = await db.query.careSeekers.findFirst({
    where: (model, { eq }) => eq(model.userId, user.id),
  });

  if (!careSeeker) {
    return <RegisterCareSeeker />;
  }

  return <CareSeekerForm />;
}
