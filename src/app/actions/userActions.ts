'use server';

import { createUserFromClerk } from '@/server/db/userQueries';
import { revalidatePath } from 'next/cache';

type UserData = {
  clerkUserId: string;
  email: string;
  name: string | null;
};

export async function ensureUserExists(userData: UserData) {
  try {
    console.log('Ensuring user exists in database:', userData.clerkUserId);
    const user = await createUserFromClerk(userData);
    revalidatePath('/');
    return { success: true, user };
  } catch (error) {
    console.error('Error ensuring user exists:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
} 