'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { ensureUserExists } from '@/app/actions/userActions';

export default function EnsureUserExists() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    async function createUserIfNeeded() {
      if (user) {
        try {
          await ensureUserExists({
            clerkUserId: user.id,
            email: user.primaryEmailAddress?.emailAddress || '',
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || null,
          });
        } catch (error) {
          console.error('Error ensuring user exists:', error);
        }
      }
    }

    if (isLoaded && user) {
      createUserIfNeeded();
    }
  }, [isLoaded, user]);

  return null; // This component doesn't render anything
} 