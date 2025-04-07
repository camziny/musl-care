"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type RegisterButtonProps = {
  formId: string;
};

export default function SubmitButton({ formId }: RegisterButtonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    console.log(`[SubmitButton] Starting submission for form: ${formId}`);

    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) {
      console.error(`Form with id ${formId} not found.`);
      toast.error("Failed to find the form. Please try again.");
      setIsSubmitting(false);
      return;
    }

    console.log(`[SubmitButton] Form found, action: ${form.action}, method: ${form.method}`);
    const formData = new FormData(form);
    
    // Log form data keys and values using Array.from
    console.log("[SubmitButton] Form data contents:");
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`- ${key}: ${value}`);
    });

    try {
      console.log(`[SubmitButton] Sending fetch request to ${form.action}`);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
      });

      console.log(`[SubmitButton] Response status: ${response.status}, ok: ${response.ok}`);
      
      // Try to parse the response as JSON regardless of status
      let responseData;
      try {
        responseData = await response.json();
        console.log("[SubmitButton] Response data:", responseData);
      } catch (e) {
        console.warn("[SubmitButton] Could not parse response as JSON:", e);
      }
      
      if (response.ok && responseData?.success) {
        toast.success("Job listing submitted successfully!");
        console.log("[SubmitButton] Success, redirecting to /jobs");
        router.push("/jobs");
      } else {
        // Handle error from response data or fallback to generic message
        const errorMsg = responseData?.error || "Failed to submit job. Please try again.";
        console.error("[SubmitButton] Error submitting form:", errorMsg);
        toast.error(errorMsg);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("[SubmitButton] Error during form submission:", error);
      toast.error("Failed to submit job listing. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <button
      type="button"
      className="bg-violet-300 text-gray-800 py-3 px-6 rounded hover:bg-violet-400 transition duration-200"
      onClick={handleSubmit}
      disabled={isSubmitting}
    >
      {isSubmitting ? "Submitting..." : "Submit"}
    </button>
  );
}
