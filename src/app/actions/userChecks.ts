"use server";

import { auth } from "@clerk/nextjs/server";
import { db, careSeekers } from "@/server/db/schema";

export async function checkCareSeeker() {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    return { 
      success: false, 
      error: "Not authenticated", 
      hasProfile: false 
    };
  }
  
  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!user) {
    return { 
      success: false, 
      error: "User not found in database", 
      hasProfile: false 
    };
  }
  
  const careSeeker = await db.query.careSeekers.findFirst({
    where: (model, { eq }) => eq(model.userId, user.id),
  });
  
  if (!careSeeker) {
    return { 
      success: true, 
      hasProfile: false 
    };
  }
  
  return { 
    success: true, 
    hasProfile: true, 
    careSeekerId: careSeeker.id 
  };
} 