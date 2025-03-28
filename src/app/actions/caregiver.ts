'use server';

import { createCaregiver } from "@/server/db/queries";
import { CareGiver } from "@/utils/types";
import { createCareGiverFromForm } from "@/utils/typeUtils";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Create a more flexible type for form submission
type CaregiverFormSubmission = Record<string, any>;

export async function submitCaregiverForm(formData: CaregiverFormSubmission) {
  try {
    // Check authentication
    const { userId } = auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // Get the authenticated user
    const user = await currentUser();
    if (!user) {
      throw new Error('User not found');
    }

    // Convert form data to properly typed object
    const typedFormData = createCareGiverFromForm(formData);

    // Add user info from Clerk
    typedFormData.name = user.firstName && user.lastName 
      ? `${user.firstName} ${user.lastName}` 
      : user.username || 'Unknown';
    
    // Add phone number if available
    typedFormData.phoneNumber = user.phoneNumbers?.[0]?.phoneNumber || '';
    
    // Default address fields if not provided
    typedFormData.address = typedFormData.address || '';
    typedFormData.city = typedFormData.city || '';
    typedFormData.state = typedFormData.state || '';
    typedFormData.postalCode = typedFormData.postalCode || '';
    
    // Handle image/file
    if (!typedFormData.image || !typedFormData.image.url || typedFormData.image.url.startsWith('blob:')) {
      // If no image is provided or it's still a blob URL, use default profile image
      typedFormData.image = {
        url: 'https://utfs.io/f/90ba1135-a67e-4dd6-9615-71bb5634ec07-hzt98r.jpeg', // Use your logo as default
        alt: `${typedFormData.name}'s profile image`
      };
    } else if (typedFormData.image.url.startsWith('https://utfs.io/')) {
      // The image has already been uploaded to UploadThing, keep it as is
      console.log("Using UploadThing image URL:", typedFormData.image.url);
    }
    
    // Create caregiver profile in database with proper typing
    await createCaregiver(typedFormData as CareGiver);
    
    // Revalidate any paths that show caregiver data
    revalidatePath('/caregivers');
    revalidatePath('/profile');
    revalidatePath('/');
    
    // Redirect will be handled by the createCaregiver function
    return { success: true };
  } catch (error: any) {
    console.error('Error creating caregiver profile:', error);
    return { 
      success: false, 
      error: error.message || 'Failed to create caregiver profile' 
    };
  }
} 