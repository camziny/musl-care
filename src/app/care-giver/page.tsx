import React from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db/schema";
import { careGivers } from "@/server/db/schema";
import type { CareGiver } from "@/utils/types";
import LanguageSelect from "../_components/LanguageSelect";
import { SimpleUploadButton } from "../_components/simpleUploadButton";
import SectSelect from "../_components/SectSelect";
import EthnicBackgroundSelect from "../_components/EthnicBackgroundSelect";
import SelectAvailability from "../_components/SelectAvailability";
import { Availability, DayAvailability } from "@/utils/types";

export default function CareGiverForm() {
  const handleSubmit = async (formData: FormData) => {
    "use server";

    const data: CareGiver = {
      id: 0,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      image: {
        url: formData.get("imageUrl") as string,
        altText: "Profile picture",
      },
      phoneNumber: formData.get("phoneNumber") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      postalCode: formData.get("postalCode") as string,
      country: formData.get("country") as string,
      userType: "caregiver",
      userId: 0,
      subscribed: formData.get("subscribed") === "true",
      languages: (formData.get("languages") as string).split(","),
      sect: formData.get("sect") as string,
      ethnicBackground: (formData.get("ethnicBackground") as string).split(","),
      hourlyRate: formData.get("hourlyRate") as string,
      availability: JSON.parse(formData.get("availability") as string),
      backgroundChecked: formData.get("backgroundChecked") === "true",
    };

    const { userId: clerkUserId } = auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    try {
      const user = await db.query.users.findFirst({
        where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
      });

      if (!user) throw new Error("User not found");

      await db.insert(careGivers).values({
        name: data.name,
        description: data.description,
        image: data.image.url,
        phoneNumber: data.phoneNumber,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        userType: data.userType,
        userId: user.id,
        subscribed: data.subscribed,
        languages: data.languages,
        sect: data.sect,
        ethnicBackground: data.ethnicBackground,
        hourlyRate: data.hourlyRate,
        availability: data.availability,
        backgroundChecked: data.backgroundChecked,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to register caregiver. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-rose-700 p-8 border border-gray-700 rounded-md shadow-lg my-5">
      <h1 className="text-2xl font-bold text-white mb-6">
        Caregiver Registration Form
      </h1>
      <form action={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter name"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Tell us about yourself. Feel free to include experience and certifications."
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Profile Picture
          </label>
          <div className="flex flex-col items-center space-y-4">
            <p className="text-gray-100 tex-center text-sm">
              Click to upload an image
            </p>
            <SimpleUploadButton inputId="imageUrl" />
          </div>
        </div>
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Enter phone number"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter address"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter city"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            placeholder="Enter state"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            placeholder="Enter postal code"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            placeholder="Enter country"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="subscribed"
            name="subscribed"
            className="border border-gray-600 bg-stone-100 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="subscribed"
            className="ml-2 text-sm font-medium text-gray-100"
          >
            Subscribed
          </label>
        </div>
        <div>
          <label
            htmlFor="languages"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Languages
          </label>
          <div>
            <LanguageSelect inputId="languages" />
          </div>
        </div>
        <input type="hidden" id="languages" name="languages" />
        <div>
          <label
            htmlFor="sects"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Sect of Islam
          </label>
          <div>
            <SectSelect inputId="sects" />
          </div>
        </div>
        <input type="hidden" id="sects" name="sects" />
        <div>
          <label
            htmlFor="ethnicBackground"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Ethnic Background
          </label>
          <div>
            <EthnicBackgroundSelect inputId="ethnicBackground" />
          </div>
        </div>
        <input type="hidden" id="ethnicBackground" name="ethnicBackground" />
        <div>
          <label
            htmlFor="hourlyRate"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Hourly Rate
          </label>
          <input
            type="number"
            id="hourlyRate"
            name="hourlyRate"
            placeholder="Enter hourly rate"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="availability"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Availability
          </label>
          <SelectAvailability inputId="availability" />
          <input type="hidden" id="availability" name="availability" />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="backgroundChecked"
            name="backgroundChecked"
            className="border border-gray-600 bg-stone-100 text-gray-800 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <label
            htmlFor="backgroundChecked"
            className="ml-2 text-sm font-medium text-gray-100"
          >
            Background Checked
          </label>
        </div>
        <button
          type="submit"
          className="bg-violet-300 text-gray-800 py-3 px-6 rounded hover:bg-violet-400 transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
}
