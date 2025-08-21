"use client";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

export default function ClientSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <div className="mt-8">
      <button
        type="submit"
        className="inline-flex items-center justify-center bg-slate-900 text-white py-3 px-6 rounded-md hover:bg-slate-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={pending}
        onClick={() => {
          setTimeout(() => toast.success("Profile updated"), 0);
        }}
      >
        {pending && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
        )}
        {pending ? "Saving..." : "Update Profile"}
      </button>
    </div>
  );
}


