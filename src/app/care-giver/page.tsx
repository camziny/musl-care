import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Caregiver Form",
  description: "Placeholder description for caregiver form page",
};
import React from "react";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db/schema";
import { careGivers, userTypeEnum } from "@/server/db/schema";
import type { CareGiver } from "@/utils/types";
import LanguageSelect from "../_components/LanguageSelect";
import { SimpleUploadButton } from "@/components/ui/SimpleUploadButton";
import SectSelect from "../_components/SectSelect";
import EthnicBackgroundSelect from "../_components/EthnicBackgroundSelect";
import SelectAvailability from "../_components/SelectAvailability";
import RegisterButton from "../_components/RegisterButton";

export default function CareGiverForm() {
  const handleSubmit = async (formData: FormData) => {
    "use server";

    const data: Partial<CareGiver> = {
      id: 0,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      image: {
        url: formData.get("imageUrl") as string,
        alt: "Profile picture",
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
      hourlyRateMin: Number(formData.get("hourlyRateMin")) || 0,
      hourlyRateMax: Number(formData.get("hourlyRateMax")) || 0,
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

      const careGiverData = {
        name: data.name || "",
        description: data.description || "",
        image: JSON.stringify({
          url: data.image?.url || "",
          alt: "Profile picture"
        }),
        phoneNumber: data.phoneNumber || "",
        address: data.address || "",
        city: data.city || "",
        state: data.state || "",
        postalCode: data.postalCode || "",
        country: data.country || "",
        userType: userTypeEnum.enumValues[0],
        userId: user.id,
        subscribed: data.subscribed || false,
        languages: data.languages || [],
        sect: data.sect || "",
        ethnicBackground: data.ethnicBackground || [],
        
        careType: null,
        religion: null,
        muslimSect: null,
        agesServed: [],
        careCapacity: null,
        termOfCare: null,
        
        hourlyRateMin: String(data.hourlyRateMin || 0),
        hourlyRateMax: String(data.hourlyRateMax || 0),
        
        yearsExperience: null,
        aboutMe: null,
        availability: JSON.stringify(data.availability || []),
        availabilityType: null,
        
        canCook: false,
        hasTransportation: false,
        canShopErrands: false,
        canHelpWithPets: false,
        canClean: false,
        canOrganize: false,
        canTutor: false,
        canPack: false,
        canMealPrep: false,
        
        isVaccinated: false,
        isSmoker: false,
        firstAidTraining: false,
        cprTraining: false,
        specialNeedsCare: false,
        
        backgroundChecked: data.backgroundChecked || false
      };
      
      await db.insert(careGivers).values(careGiverData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-rose-700 p-8 border border-gray-700 rounded-md shadow-lg my-5">
      <h1 className="text-2xl font-bold text-white mb-6">
        Caregiver Registration Form
      </h1>
      <form
        id="caregiver-form"
        action="/care-giver"
        method="post"
        className="space-y-6"
      >
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
            <p className="text-gray-100 text-center text-sm">
              Click to upload an image
            </p>
            <SimpleUploadButton inputId="imageUrl" />
          </div>
          <input type="hidden" id="imageUrl" name="imageUrl" />
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
            htmlFor="sect"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Sect of Islam
          </label>
          <div>
            <SectSelect inputId="sect" />
          </div>
        </div>
        <input type="hidden" id="sect" name="sect" />
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
            htmlFor="hourlyRateMin"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Hourly Rate Min
          </label>
          <input
            type="number"
            id="hourlyRateMin"
            name="hourlyRateMin"
            placeholder="Enter hourly rate min"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="hourlyRateMax"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Hourly Rate Max
          </label>
          <input
            type="number"
            id="hourlyRateMax"
            name="hourlyRateMax"
            placeholder="Enter hourly rate max"
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
        <RegisterButton formId="caregiver-form" />
      </form>
    </div>
  );
}
