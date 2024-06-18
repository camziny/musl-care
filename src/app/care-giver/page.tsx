import { auth } from "@clerk/nextjs/server";
import { db } from "@/server/db/schema";
import type { CareGiver } from "@/utils/types";
// import { useRouter } from "next/navigation";

export default function CareGiver() {
  // const router = useRouter();

  // const handleSubmit = async (formData: FormData) => {
  //   "use server";

  //   const data = {
  //     name: formData.get("name"),
  //     description: formData.get("description"),
  //     imageUrl: formData.get("imageUrl"),
  //     altText: formData.get("altText"),
  //     phoneNumber: formData.get("phoneNumber"),
  //     address: formData.get("address"),
  //     city: formData.get("city"),
  //     state: formData.get("state"),
  //     postalCode: formData.get("postalCode"),
  //     country: formData.get("country"),
  //     userType: "caregiver",
  //   };

  //   const { userId: clerkUserId } = auth();
  //   if (!clerkUserId) throw new Error("Unauthorized");

  //   try {
  //     const user = await db.query.users.findFirst({
  //       where: (model, { eq }) => eq(model.clerkUserId, clerkUserId),
  //     });

  //     if (!user) throw new Error("User not found");

  //     await db.insert(careGivers).values({
  //       name: data.name,
  //       description: data.description,
  //       image: data.imageUrl,
  //       phoneNumber: data.phoneNumber,
  //       address: data.address,
  //       city: data.city,
  //       state: data.state,
  //       postalCode: data.postalCode,
  //       country: data.country,
  //       userType: data.userType,
  //       userId: user.id,
  //     });

  //     router.push("/");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to register caregiver. Please try again.");
  //   }
  // };

  return (
    <div>
      <h1>Caregiver Registration Form</h1>
      <form className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter name"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter description"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="imageUrl"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            placeholder="Enter image URL"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="altText"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Alt Text
          </label>
          <input
            type="text"
            id="altText"
            name="altText"
            placeholder="Enter alt text"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Enter phone number"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter address"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="city"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            City
          </label>
          <input
            type="text"
            id="city"
            name="city"
            placeholder="Enter city"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="state"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            placeholder="Enter state"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="postalCode"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            placeholder="Enter postal code"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label
            htmlFor="country"
            className="block text-sm font-medium text-gray-400 mb-1"
          >
            Country
          </label>
          <input
            type="text"
            id="country"
            name="country"
            placeholder="Enter country"
            className="border border-gray-600 bg-gray-800 text-white p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Register Caregiver
        </button>
      </form>
    </div>
  );
}
