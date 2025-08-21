"use server";

import { auth } from "@clerk/nextjs/server";
import { db, careSeekers } from "@/server/db/schema";

export type Role = "free" | "premium" | "lux" | "admin";

export async function requireRole(allowed: Role[]) {
  const { userId, sessionClaims } = auth();
  if (!userId) {
    return { ok: false, reason: "unauthenticated" as const };
  }
  const rolesClaim = (sessionClaims as any)?.roles as string[] | undefined;
  const userRoles: Role[] = Array.isArray(rolesClaim) && rolesClaim.length > 0 ? (rolesClaim as Role[]) : ["free"];
  const isAllowed = userRoles.some((r) => allowed.includes(r));
  if (!isAllowed) {
    return { ok: false, reason: "forbidden" as const };
  }
  return { ok: true as const };
}

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