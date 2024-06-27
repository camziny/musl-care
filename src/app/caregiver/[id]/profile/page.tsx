import {
  getCaregiverByClerkUserId,
  deleteCareGiver,
  updateCareGiver,
} from "@/server/db/queries";
import { SimpleUploadButton } from "@/app/_components/simpleUploadButton";
import { redirect } from "next/navigation";
import LanguageSelect from "@/app/_components/LanguageSelect";
import SectSelect from "@/app/_components/SectSelect";
import EthnicBackgroundSelect from "@/app/_components/EthnicBackgroundSelect";
import SelectAvailability from "@/app/_components/SelectAvailability";
import { Availability } from "@/utils/types";
import { auth } from "@clerk/nextjs/server";

export default async function CareGiverSettings(props: { id: string }) {
  const { userId: clerkUserId } = auth();
  if (!clerkUserId) {
    throw new Error("Unauthorized");
  }

  const careGiver = await getCaregiverByClerkUserId(clerkUserId);

  return (
    <div className="max-w-2xl mx-auto bg-rose-700 p-8 border border-gray-700 rounded-md shadow-lg my-5">
      <h1 className="text-2xl font-bold text-white mb-6">
        Update Caregiver Profile
      </h1>
      <form
        id="caregiver-update-form"
        className="space-y-6"
        action={async (formData) => {
          "use server";
          const name = formData.get("name");
          const description = formData.get("description");
          const phoneNumber = formData.get("phoneNumber");
          const address = formData.get("address");
          const city = formData.get("city");
          const state = formData.get("state");
          const postalCode = formData.get("postalCode");
          const country = formData.get("country");
          const languages = (formData.get("languages") as string).split(",");
          const sect = formData.get("sect");
          const ethnicBackground = (
            formData.get("ethnicBackground") as string
          ).split(",");
          const hourlyRate = formData.get("hourlyRate");
          const availability = JSON.parse(
            formData.get("availability") as string
          );
          const subscribed = formData.get("subscribed") === "on";
          const backgroundChecked = formData.get("backgroundChecked") === "on";
          const imageUrl = formData.get("imageUrl");

          if (
            typeof name !== "string" ||
            typeof description !== "string" ||
            typeof phoneNumber !== "string" ||
            typeof address !== "string" ||
            typeof city !== "string" ||
            typeof state !== "string" ||
            typeof postalCode !== "string" ||
            typeof country !== "string" ||
            typeof sect !== "string" ||
            typeof hourlyRate !== "string" ||
            typeof imageUrl !== "string"
          ) {
            throw new Error("Invalid form data");
          }

          await updateCareGiver(careGiver.id, {
            name,
            description,
            phoneNumber,
            address,
            city,
            state,
            postalCode,
            country,
            languages,
            sect,
            ethnicBackground,
            hourlyRate,
            availability,
            subscribed,
            backgroundChecked,
            image: {
              url: imageUrl,
              altText: "Profile picture",
            },
          });

          redirect("/caregivers");
        }}
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
            defaultValue={careGiver.name}
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
            defaultValue={careGiver.description}
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
            defaultValue={careGiver.phoneNumber}
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
            defaultValue={careGiver.address}
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
            defaultValue={careGiver.city}
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
            defaultValue={careGiver.state}
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
            defaultValue={careGiver.postalCode}
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
            defaultValue={careGiver.country}
            placeholder="Enter country"
            className="border border-gray-600 bg-stone-100 text-gray-800 p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="languages"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Languages
          </label>
          <div>
            <LanguageSelect
              inputId="languages"
              selectedLanguages={careGiver.languages}
            />
          </div>
          <input type="hidden" id="languages" name="languages" />
        </div>
        <div>
          <label
            htmlFor="sect"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Sect of Islam
          </label>
          <div>
            <SectSelect inputId="sect" selectedSect={careGiver.sect} />
          </div>
          <input type="hidden" id="sect" name="sect" />
        </div>
        <div>
          <label
            htmlFor="ethnicBackground"
            className="block text-sm font-medium text-gray-100 mb-1"
          >
            Ethnic Background
          </label>
          <div>
            <EthnicBackgroundSelect
              inputId="ethnicBackground"
              selectedEthnicBackground={careGiver.ethnicBackground}
            />
          </div>
          <input type="hidden" id="ethnicBackground" name="ethnicBackground" />
        </div>
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
            defaultValue={careGiver.hourlyRate}
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
          <SelectAvailability
            inputId="availability"
            selectedAvailability={careGiver.availability as Availability}
          />
          <input type="hidden" id="availability" name="availability" />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="backgroundChecked"
            name="backgroundChecked"
            defaultChecked={careGiver.backgroundChecked}
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
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Update Profile
        </button>
      </form>
      <div className="text-md space-y-2 mt-6">
        <div>
          <span className="block font-medium text-gray-100">Created on:</span>
          <span className="font-light text-gray-100">
            {new Date(careGiver.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      <div className="mt-6">
        <form
          action={async () => {
            "use server";
            await deleteCareGiver(careGiver.id);
            redirect("/caregivers");
          }}
        >
          <button
            type="submit"
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
          >
            Delete Profile
          </button>
        </form>
      </div>
    </div>
  );
}
