import { getCaregivers } from "@/server/db/queries";
import Image from "next/image";
import Link from "next/link";

export default async function CareGiverList() {
  const careGivers = await getCaregivers();

  return (
    <div className="z-10 w-full max-w-5xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">
        Meet Our Care Givers
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {careGivers.map((careGiver) => (
          <div
            key={careGiver.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <Link href={`/caregivers/${careGiver.id}`}>
              <Image
                src={careGiver.image}
                alt={careGiver.image}
                width={192}
                height={192}
                className="w-full h-48 object-cover"
                style={{ objectFit: "cover" }}
              />
            </Link>
            <div className="p-4">
              <h2 className="text-xl text-gray-700 font-semibold mb-2">
                {careGiver.name}
              </h2>
              <p className="text-gray-700">{careGiver.description}</p>
              <p className="text-gray-700 font-semibold py-4">
                {careGiver.city}, {careGiver.state}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
