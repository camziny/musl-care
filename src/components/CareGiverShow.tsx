import { getCaregiver } from "@/server/db/queries";
import { clerkClient } from "@clerk/nextjs/server";

export default async function FullPageCaregiverView(props: { id: number }) {
  const careGiver = await getCaregiver(props.id);

  return (
    <div className="flex w-full h-full bg-stone-200 p-6">
      <div className="flex-shrink-0 flex justify-center items-center w-1/2 p-4">
        <img
          src={careGiver.image}
          className="object-contain max-h-full max-w-full rounded-md"
          alt={`${careGiver.name}'s profile picture`}
        />
      </div>
      <div className="flex-grow flex flex-col justify-center border-l border-gray-700 p-6 space-y-4">
        <h1 className="text-3xl font-bold">{careGiver.name}</h1>
        <p className="text-lg">{careGiver.description}</p>
        <p className="text-md font-semibold">
          {careGiver.city}, {careGiver.state}, {careGiver.country}
        </p>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
          <button className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-500 transition-all duration-300 w-full md:w-auto">
            Contact {careGiver.name}
          </button>
          <button className="bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-slate-500 transition-all duration-300 w-full md:w-auto">
            Hire {careGiver.name}
          </button>
        </div>
      </div>
    </div>
  );
}
