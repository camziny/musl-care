"use server";

import { auth } from "@clerk/nextjs/server";
import { db, users, careSeekers } from "@/server/db/schema";

export async function createCareSeeker() {

  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    console.error("[createCareSeeker] No authenticated user found");
    return { 
      success: false, 
      error: "Not authenticated" 
    };
  }
  
  try {
    let user = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
    });

    if (!user) {
      const [newUser] = await db.insert(users).values({
        clerkUserId,
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      user = newUser;
    }
    
    const existingProfile = await db.query.careSeekers.findFirst({
      where: (model, { eq }) => eq(model.userId, user.id),
    });
    
    if (existingProfile) {
      return { 
        success: true, 
        message: "Profile already exists",
        careSeekerId: existingProfile.id 
      };
    }
    
    const [careSeeker] = await db.insert(careSeekers).values({
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    
    return { 
      success: true, 
      careSeekerId: careSeeker.id 
    };
  } catch (error) {
    console.error("[createCareSeeker] Error creating care seeker profile:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    };
  }
} 