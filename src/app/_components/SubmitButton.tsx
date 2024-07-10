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

    const form = document.getElementById(formId) as HTMLFormElement;
    if (!form) {
      console.error(`Form with id ${formId} not found.`);
      toast.error("Failed to find the form. Please try again.");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
      });

      if (response.ok) {
        toast.success("Job listing submitted successfully!");
        router.push("/");
      } else {
        toast.error("Failed to submit job. Please try again.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
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
