import { getCaregivers } from "@/server/db/queries";
import Image from "next/image";
import Link from "next/link";

export default async function CareGiverList() {
  const careGivers = await getCaregivers();

  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Meet Our Caregivers
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with experienced, background-checked caregivers who understand your values and needs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {careGivers.map((careGiver) => {
          let imageUrl = "/default-profile.jpg";
          let altText = "Caregiver profile picture";

          try {
            const image = JSON.parse(careGiver.image);
            imageUrl = image.url || imageUrl;
            altText = image.altText || altText;
          } catch (error) {
            imageUrl = careGiver.image;
          }

          return (
            <div
              key={careGiver.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <Link href={`/caregivers/${careGiver.id}`} className="block">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={altText}
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                    quality={75}
                    className="hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {careGiver.name}
                    </h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  </div>

                  <p className="text-gray-600 line-clamp-2 mb-4">
                    {careGiver.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-700">
                      <svg 
                        className="w-4 h-4 mr-2" 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path 
                          fillRule="evenodd" 
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
                          clipRule="evenodd" 
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        {careGiver.city}, {careGiver.state}
                      </span>
                    </div>

                    <span className="text-sm font-medium text-slate-700 hover:text-slate-900">
                      View Profile →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
