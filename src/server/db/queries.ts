import "server-only";
import { db } from "./schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { careGivers, users, jobListings, careSeekers, forumCategories, forumPosts, forumComments, commentLikes, contentReports, notifications, directMessages } from "./schema";
import { and, eq, or, ilike, sql, inArray } from "drizzle-orm";
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

  let dbUser = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!dbUser) {
    
    try {
      const clerkUser = await currentUser();
      if (!clerkUser) throw new Error("Could not fetch user data from Clerk");
      
      const [newUser] = await db
        .insert(users)
        .values({
          clerkUserId: clerkUserId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
      
      dbUser = newUser;
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
    
    careType: data.careType || null,
    religion: data.religion || null,
    muslimSect: data.muslimSect || null,
    agesServed: data.agesServed,
    careCapacity: data.careCapacity || null,
    termOfCare: data.termOfCare || null,
    
    hourlyRateMin,
    hourlyRateMax,
    yearsExperience: data.yearsExperience,
    aboutMe: data.aboutMe,
    
    availability: JSON.stringify(data.availability),
    availabilityType: data.availabilityType || null,
    
    canCook: data.canCook,
    hasTransportation: data.hasTransportation,
    canShopErrands: data.canShopErrands,
    canHelpWithPets: data.canHelpWithPets,
    canClean: data.canClean,
    canOrganize: data.canOrganize,
    canTutor: data.canTutor,
    canPack: data.canPack,
    canMealPrep: data.canMealPrep,
    
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

  const updatedData: Record<string, any> = {};
  
  Object.keys(data).forEach(key => {
    if (key !== 'image' && key !== 'professionalSkills' && 
        key !== 'hourlyRateMin' && key !== 'hourlyRateMax' && 
        key !== 'availability') {
      updatedData[key] = data[key as keyof typeof data];
    }
  });
  
  if (data.image) {
    updatedData.image = JSON.stringify(data.image);
  }
  
  if (data.professionalSkills) {
    updatedData.firstAidTraining = data.professionalSkills.firstAidTraining;
    updatedData.cprTraining = data.professionalSkills.cprTraining;
    updatedData.specialNeedsCare = data.professionalSkills.specialNeedsCare;
  }
  
  if (data.hourlyRateMin !== undefined) {
    updatedData.hourlyRateMin = data.hourlyRateMin.toString();
  }
  if (data.hourlyRateMax !== undefined) {
    updatedData.hourlyRateMax = data.hourlyRateMax.toString();
  }
  
  if (data.availability) {
    updatedData.availability = JSON.stringify(data.availability);
  }
  
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
        console.error(
          "Failed to retrieve Care Seeker after insertion for userId:",
          user.id
        );
        throw new Error("Failed to create Care Seeker");
      }

    } catch (insertError) {
      console.error("Error inserting Care Seeker:", insertError);
      throw new Error("Error inserting Care Seeker");
    }
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
    console.error("[createJobForm] Unauthorized: No user ID found.");
    throw new Error("Unauthorized");
  }

  const user = await db.query.users.findFirst({
    where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  });

  if (!user) {
    console.error("[createJobForm] User not found for clerkUserId:", clerkUserId);
    throw new Error("User not found");
  }

  const careSeeker = await db.query.careSeekers.findFirst({
    where: (model, { eq }) => eq(model.userId, user.id),
  });

  if (!careSeeker) {
    console.error("[createJobForm] Care Seeker not found for userId:", user.id);
    throw new Error("Care Seeker not found");
  }

  try {
    const firstInsertData = {
      creator_user_id: clerkUserId,
      date_posted: new Date(),
      location: data.location,
    };
    
    await db.insert(jobListings).values(firstInsertData as any);
    
    const secondInsertData = {
      careSeeker_id: careSeeker.id,
      title: data.title,
      description: data.description,
      creator: data.creator,
      creator_user_id: clerkUserId,
      date_posted: data.datePosted,
      location: data.location,
    };
    
    await db.insert(jobListings).values(secondInsertData as any);
    
  } catch (error) {
    console.error("[createJobForm] Error inserting job listing:", error);
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
      guardianImage: true,
      childrenImages: true,
      careType: true,
      availabilityType: true,
      location: true,
      datePosted: true,
      metadata: true,
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

}

export async function listForumCategories() {
  const rows = await db.query.forumCategories.findMany({ orderBy: (m, { asc }) => asc(m.name) });
  return rows;
}

export async function ensureDefaultForumCategories() {
  const defaults = [
    { slug: "parenting", name: "Parenting" },
    { slug: "elder-care", name: "Elder care" },
    { slug: "special-needs", name: "Special needs" },
    { slug: "pregnancy-postpartum", name: "Pregnancy/Postpartum" },
    { slug: "first-time-caregivers", name: "First-time caregivers" },
    { slug: "culture-specific", name: "Culture-specific" },
    { slug: "general", name: "General advice" },
    { slug: "off-topic", name: "Off-topic" },
  ];
  const existing = await db.query.forumCategories.findMany();
  if (existing.length === 0) {
    await db.insert(forumCategories).values(defaults.map(d => ({ slug: d.slug, name: d.name })));
  }
}

export async function createForumPost(input: { categoryId: number; title: string; content: string; tags?: string[]; attachments?: any[]; }) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");
  const dbUser = await db.query.users.findFirst({ where: (m, { eq }) => eq(m.clerkUserId, clerkUserId) });
  if (!dbUser) throw new Error("User not found");
  const [row] = await db.insert(forumPosts).values({
    categoryId: input.categoryId,
    authorUserId: dbUser.id,
    title: input.title,
    content: input.content,
    tags: input.tags ?? [],
    attachments: JSON.stringify(input.attachments ?? []),
  }).returning();
  return row;
}

export async function listForumPosts(params: { categoryId?: number; search?: string; sort?: "recent" | "trending"; tag?: string; }) {
  const rows = await db.query.forumPosts.findMany({
    where: (m, { and, eq, ilike, sql }) => {
      const clauses: any[] = [];
      if (params.categoryId) clauses.push(eq(m.categoryId, params.categoryId));
      if (params.search) clauses.push(ilike(m.title, `%${params.search}%`));
      if (params.tag) clauses.push(sql`${m.tags} @> ARRAY[${params.tag}]::text[]`);
      return clauses.length ? and(...clauses) : undefined as any;
    },
    orderBy: (m, o) => params.sort === "trending" ? o.desc(m.commentCount) : o.desc(m.createdAt),
  });
  return rows;
}

export async function getForumPost(postId: number) {
  const post = await db.query.forumPosts.findFirst({ where: (m, { eq }) => eq(m.id, postId) });
  if (!post) throw new Error("Not found");
  return post;
}

export async function listForumComments(postId: number) {
  const comments = await db.query.forumComments.findMany({
    where: (m, { eq }) => eq(m.postId, postId),
    orderBy: (m, { asc }) => asc(m.createdAt),
  });
  return comments;
}

export async function addForumComment(input: { postId: number; parentCommentId?: number | null; content: string; }) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");
  const dbUser = await db.query.users.findFirst({ where: (m, { eq }) => eq(m.clerkUserId, clerkUserId) });
  if (!dbUser) throw new Error("User not found");
  const [row] = await db.insert(forumComments).values({
    postId: input.postId,
    authorUserId: dbUser.id,
    parentCommentId: (input.parentCommentId ?? null) as any,
    content: input.content,
  }).returning();
  const post = await db.query.forumPosts.findFirst({ where: (m, { eq }) => eq(m.id, input.postId) });
  if (post) {
    await db.update(forumPosts).set({ commentCount: (post.commentCount ?? 0) + 1 }).where(eq(forumPosts.id, input.postId));
  }
  return row;
}

export async function toggleLikeComment(commentId: number) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");
  const dbUser = await db.query.users.findFirst({ where: (m, { eq }) => eq(m.clerkUserId, clerkUserId) });
  if (!dbUser) throw new Error("User not found");
  const existing = await db.query.commentLikes.findFirst({ where: (m, { and, eq }) => and(eq(m.commentId, commentId), eq(m.userId, dbUser.id)) });
  if (existing) {
    await db.delete(commentLikes).where(and(eq(commentLikes.commentId, commentId), eq(commentLikes.userId, dbUser.id)));
  } else {
    await db.insert(commentLikes).values({ commentId, userId: dbUser.id });
  }
  const likes = await db.query.commentLikes.findMany({ where: (m, { eq }) => eq(m.commentId, commentId) });
  await db.update(forumComments).set({ likeCount: likes.length }).where(eq(forumComments.id, commentId));
}

export async function reportContent(input: { targetType: "post" | "comment"; postId?: number; commentId?: number; reason: string; }) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");
  const dbUser = await db.query.users.findFirst({ where: (m, { eq }) => eq(m.clerkUserId, clerkUserId) });
  if (!dbUser) throw new Error("User not found");
  await db.insert(contentReports).values({
    targetType: input.targetType as any,
    postId: input.postId ?? null as any,
    commentId: input.commentId ?? null as any,
    reporterUserId: dbUser.id,
    reason: input.reason,
  });
}

export async function adminListReports() {
  const rows = await db.query.contentReports.findMany({ orderBy: (m, { desc }) => desc(m.createdAt) });
  return rows;
}

export async function adminSetReportStatus(reportId: number, status: "open" | "reviewed" | "dismissed") {
  await db.update(contentReports).set({ status: status as any }).where(eq(contentReports.id, reportId));
}

export async function sendDirectMessage(recipientUserId: number, content: string) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");
  const dbUser = await db.query.users.findFirst({ where: (m, { eq }) => eq(m.clerkUserId, clerkUserId) });
  if (!dbUser) throw new Error("User not found");
  await db.insert(directMessages).values({ senderUserId: dbUser.id, recipientUserId, content });
}

export async function listConversations() {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");
  const dbUser = await db.query.users.findFirst({ where: (m, { eq }) => eq(m.clerkUserId, clerkUserId) });
  if (!dbUser) throw new Error("User not found");
  const messages = await db.query.directMessages.findMany({
    where: (m, { or, eq }) => or(eq(m.senderUserId, dbUser.id), eq(m.recipientUserId, dbUser.id)),
    orderBy: (m, { desc }) => desc(m.createdAt),
  });
  return messages;
}

export async function listMessagesWith(userId: number) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) throw new Error("Unauthorized");
  const dbUser = await db.query.users.findFirst({ where: (m, { eq }) => eq(m.clerkUserId, clerkUserId) });
  if (!dbUser) throw new Error("User not found");
  const messages = await db.query.directMessages.findMany({
    where: (m, { or, and, eq }) => or(and(eq(m.senderUserId, dbUser.id), eq(m.recipientUserId, userId)), and(eq(m.senderUserId, userId), eq(m.recipientUserId, dbUser.id))),
    orderBy: (m, { asc }) => asc(m.createdAt),
  });
  return messages;
}

export async function getUsersPublic(userIds: number[]) {
  if (userIds.length === 0) return [] as Array<{ id: number; publicName: string | null; locationCity: string | null; locationState: string | null }>;
  const rows = await db.query.users.findMany({
    where: (m, { inArray }) => inArray(m.id, userIds),
    columns: {
      id: true,
      publicName: true,
      locationCity: true,
      locationState: true,
    },
  });
  return rows;
}
