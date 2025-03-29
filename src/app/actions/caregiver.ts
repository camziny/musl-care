'use server';

import { createCaregiver } from "@/server/db/queries";
import { CareGiver } from "@/utils/types";
import { createCareGiverFromForm } from "@/utils/typeUtils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type CaregiverFormSubmission = Record<string, any>;

export async function submitCaregiverForm(formData: CaregiverFormSubmission) {
  try {
    const { userId } = auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }

    const user = await currentUser();
    if (!user) {
      throw new Error('User not found');
    }

    const typedFormData = createCareGiverFromForm(formData);

    typedFormData.name = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.username || 'Unknown';
    
    typedFormData.phoneNumber = user.phoneNumbers?.[0]?.phoneNumber || '';
    
    typedFormData.address = typedFormData.address || '';
    typedFormData.city = typedFormData.city || '';
    typedFormData.state = typedFormData.state || '';
    typedFormData.postalCode = typedFormData.postalCode || '';
    
    if (!typedFormData.image || !typedFormData.image.url || typedFormData.image.url.startsWith('blob:')) {
      typedFormData.image = {
        url: 'https://utfs.io/f/90ba1135-a67e-4dd6-9615-71bb5634ec07-hzt98r.jpeg',
        alt: `${typedFormData.name}'s profile image`
      };
    } else if (typedFormData.image.url.startsWith('https://utfs.io/')) {
      console.log("Using UploadThing image URL:", typedFormData.image.url);
    }
    
    await createCaregiver(typedFormData as CareGiver);
    
    revalidatePath('/caregivers');
    revalidatePath('/profile');
    revalidatePath('/');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error creating caregiver profile:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create caregiver profile' 
    };
  }
} 