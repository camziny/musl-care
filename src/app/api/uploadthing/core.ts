import { auth, clerkClient } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { db, careGivers, users } from "../../../server/db/schema";
import { eq } from "drizzle-orm";

const f = createUploadthing();

async function updateUserUploadPermission(userId: string) {
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        "can-upload": true,
      },
    });
    console.log(`Updated upload permissions for user ID: ${userId}`);
  } catch (error: any) {
    console.error(`Error updating user permissions: ${error.message}`);
  }
}

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      const user = auth();
      if (!user.userId) throw new UploadThingError("Unauthorized");
      await updateUserUploadPermission(user.userId);
      const fullUserData = await clerkClient.users.getUser(user.userId);

      if (fullUserData?.privateMetadata?.["can-upload"] !== true)
        throw new UploadThingError("User Does Not Have Upload Permissions");

      return { userId: user.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { userId: clerkUserId } = metadata;
      const imageUrl = file.url;

      console.log(`Image URL: ${imageUrl}, User ID: ${clerkUserId}`);

      return { uploadedBy: clerkUserId, imageUrl };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
