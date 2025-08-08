import React from "react";
import { createJobForm, JobFormData } from "@/server/db/queries";
import dynamic from "next/dynamic";
import { currentUser } from "@clerk/nextjs/server";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";

const DatePicker = dynamic(() => import("@/components/ui/DatePicker"), { ssr: false });

type FormState = { ok: boolean; message?: string };

async function submitAction(prev: FormState, formData: FormData): Promise<FormState> {
  "use server";
  const user = await currentUser();
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const creator = (formData.get("creator") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  if (!title || !description || !creator || !location) return { ok: false, message: "Please fill out all fields" };
  const startDateString = (formData.get("datePosted") as string) || "";
  const data: JobFormData = {
    title,
    description,
    creator,
    creatorUserId: user?.id || "",
    datePosted: startDateString ? new Date(startDateString) : new Date(),
    location,
  };
  await createJobForm(data);
  return { ok: true };
}

export default function CareSeekerForm() {
  const initial = { ok: false } as FormState;
  const [state, formAction] = useFormState(submitAction, initial);
  const { pending } = useFormStatus();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Post a Job</h1>
        <p className="text-slate-600 mt-1">Describe your care needs to reach the right caregivers</p>
      </div>
      <form id="job-posting-form" action={formAction} method="post" className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 space-y-6">
        {state?.message && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{state.message}</div>
        )}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter job title"
            autoComplete="off"
            className="border border-slate-300 bg-white text-slate-900 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter job description"
            className="border border-slate-300 bg-white text-slate-900 p-3 rounded w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="creator" className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
          <input
            type="text"
            id="creator"
            name="creator"
            placeholder="Enter your name"
            autoComplete="name"
            className="border border-slate-300 bg-white text-slate-900 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="datePosted" className="block text-sm font-medium text-slate-700 mb-1">Date</label>
          <DatePicker startDateInputId="datePosted" />
          <input type="hidden" id="datePosted" name="datePosted" />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-slate-700 mb-1">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Enter location"
            autoComplete="address-level2"
            className="border border-slate-300 bg-white text-slate-900 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <SubmitClient pending={pending} />
      </form>
    </div>
  );
}

function SubmitClient({ pending }: { pending: boolean }) {
  "use client";
  return (
    <button type="submit" disabled={pending} className="w-full mt-2 px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed">
      {pending ? "Posting..." : "Post Job"}
    </button>
  );
}
