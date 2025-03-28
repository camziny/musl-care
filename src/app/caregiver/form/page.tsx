import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import CareGiverForm from '@/components/CareGiverForm';

export default function CareGiverFormPage() {
  const { userId } = auth();
  
  // If not authenticated, redirect to sign-in
  if (!userId) {
    redirect('/sign-in');
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Your Caregiver Profile</h1>
      <CareGiverForm />
    </div>
  );
} 