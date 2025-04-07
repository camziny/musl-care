"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { checkCareSeeker } from "../actions/userChecks";
import { createCareSeeker } from "../actions/createCareSeeker";

export default function JobPostingCheck() {
  const [isChecking, setIsChecking] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function checkUserProfile() {
      try {
        const result = await checkCareSeeker();
        
        setHasProfile(result.hasProfile);
        
        if (!result.success) {
          toast.error(`Error: ${result.error}`);
          if (result.error === "Not authenticated") {
            router.push("/sign-in");
          }
        }
      } catch (error) {
        console.error("[JobPostingCheck] Error checking profile:", error);
        toast.error("Could not verify your profile status");
      } finally {
        setIsChecking(false);
      }
    }
    
    checkUserProfile();
  }, [router]);

  const handleCreateProfile = async () => {
    setIsCreating(true);
    try {
      const result = await createCareSeeker();
      
      if (result.success) {
        toast.success("Care seeker profile created!");
        setHasProfile(true);
      } else {
        toast.error(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error("[JobPostingCheck] Error creating profile:", error);
      toast.error("Could not create care seeker profile");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="my-4 p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold">Profile Check</h2>
      
      {isChecking ? (
        <p className="text-gray-600">Checking your profile status...</p>
      ) : hasProfile ? (
        <div className="text-green-600">
          <p>✅ Your care seeker profile is set up</p>
          <p className="text-sm text-gray-600 mt-2">You can proceed with posting a job.</p>
        </div>
      ) : (
        <div className="text-amber-600">
          <p>⚠️ Care seeker profile not found</p>
          <p className="text-sm text-gray-600 mt-2">
            To post a job, you need a care seeker profile. We can quickly set one up for you.
          </p>
          <button
            onClick={handleCreateProfile}
            className="mt-3 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={isCreating}
          >
            {isCreating ? "Creating Profile..." : "Create Profile Now"}
          </button>
          <p className="text-xs text-gray-500 mt-2">
            For a more detailed profile, you can use the &quot;Looking for Care&quot; form.
          </p>
        </div>
      )}
    </div>
  );
} 