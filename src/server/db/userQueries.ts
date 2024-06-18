import { db } from "./schema";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import * as yup from "yup";

const userSchema = yup.object().shape({
  email: yup.string().email().required(),
  name: yup.string().nullable(),
  clerkUserId: yup.string().required(),
});

export const createUserFromClerk = async (data: any) => {
  try {
    await userSchema.validate(data);

    const existingUser = await db.query.users.findFirst({
      where: (model, { eq }) => eq(model.clerkUserId, data.clerkUserId),
    });

    if (existingUser) {
      return existingUser;
    }

    const [createdUser] = await db
      .insert(users)
      .values({
        clerkUserId: data.clerkUserId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return createdUser;
  } catch (error: any) {
    console.error(
      "Error in createUserFromClerk:",
      JSON.stringify({
        errorMessage: error.message,
        errorStack: error.stack,
        errorDetails: error,
      })
    );

    if (error instanceof yup.ValidationError) {
      console.error("Validation error:", error);
    }
    throw error;
  }
};

export const deleteUserFromClerk = async (clerkUserId: string) => {
  try {
    await db.delete(users).where(eq(users.clerkUserId, clerkUserId));
  } catch (error: any) {
    console.error(`Error in deleting user: ${error.message}`);
    throw error;
  }
};
