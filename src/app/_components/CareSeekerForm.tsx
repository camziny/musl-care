import React from "react";
import { createJobForm, JobFormData } from "@/server/db/queries";
import SubmitButton from "../_components/SubmitButton";
import dynamic from "next/dynamic";

const DatePicker = dynamic(() => import("./DatePicker"), {
  ssr: false,
});

export default function CareSeekerForm() {
  const handleSubmit = async (formData: FormData) => {
    "use server";

    const startDateString = formData.get("datePosted") as string;

    const data: JobFormData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      creator: formData.get("creator") as string,
      datePosted: startDateString ? new Date(startDateString) : new Date(),
      location: formData.get("location") as string,
    };

    try {
      await createJobForm(data);
      console.log("Job listing created successfully");
    } catch (error) {
      console.error("Error creating job listing:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-rose-700 p-8 border border-gray-700 rounded-md shadow-lg my-5">
      <h1 className="text-2xl font-bold text-white mb-6">Post a Job</h1>
      <form
        id="job-posting-form"
        action={handleSubmit}
        method="post"
        className="space-y-6"
      >
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Job Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter job title"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Job Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter job description"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="creator"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Your Name
          </label>
          <input
            type="text"
            id="creator"
            name="creator"
            placeholder="Enter your name"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="datePosted"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Date
          </label>
          <DatePicker startDateInputId="datePosted" />
          <input type="hidden" id="datePosted" name="datePosted" />
        </div>
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            placeholder="Enter location"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <SubmitButton formId="job-posting-form" />
      </form>
    </div>
  );
}
