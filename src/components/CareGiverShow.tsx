import { getCaregiver } from "@/server/db/queries";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function FullPageCaregiverView(props: { id: number }) {
  let careGiver;
  
  try {
    careGiver = await getCaregiver(props.id);
    if (!careGiver) {
      notFound();
    }
  } catch (error) {
    console.error("Error fetching caregiver:", error);
    notFound();
  }

  let imageUrl = "/default-profile.jpg";
  let altText = `${careGiver.name}'s profile picture`;

  try {
    if (typeof careGiver.image === 'string') {
      if (careGiver.image.startsWith('{')) {
        const parsedImage = JSON.parse(careGiver.image);
        if (parsedImage.url && parsedImage.url.length > 0) {
          imageUrl = parsedImage.url;
        }
        if (parsedImage.altText) {
          altText = parsedImage.altText;
        }
      } else if (careGiver.image.startsWith('http') || careGiver.image.startsWith('/')) {
        imageUrl = careGiver.image;
      }
    }
  } catch (error) {
    console.error("Error parsing image data:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-slate-50">
              <div className="relative h-96 md:h-full w-full">
                <Image
                  src={imageUrl}
                  alt={altText}
                  layout="fill"
                  objectFit="cover"
                  objectPosition="center"
                  className="rounded-t-xl md:rounded-l-xl md:rounded-tr-none"
                  priority
                />
              </div>
            </div>

            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                  <h1 className="mt-2 text-3xl font-bold text-gray-900">{careGiver.name}</h1>
                </div>

                <div className="prose prose-slate max-w-none">
                  <p className="text-gray-600 text-lg">{careGiver.description}</p>
                </div>

                <div className="border-t border-b border-gray-200 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Location</h3>
                      <div className="mt-1 flex items-center text-gray-900">
                        <svg className="w-5 h-5 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {careGiver.city}, {careGiver.state}, {careGiver.country}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Experience</h3>
                      <p className="mt-1 text-gray-900">5+ years</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <button className="w-full bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium">
                  Contact {careGiver.name}
                </button>
                <button className="w-full bg-white text-slate-800 px-6 py-3 rounded-lg border-2 border-slate-800 hover:bg-slate-50 transition-colors font-medium">
                  Hire {careGiver.name}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Services</h3>
            <ul className="space-y-2">
              {["Child Care", "Meal Preparation", "Light Housekeeping"].map((service, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {service}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {["English", "Arabic", "Urdu"].map((language, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-slate-100 text-slate-800">
                  {language}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Availability</h3>
            <p className="text-gray-600">Available weekdays from 8am to 6pm</p>
            <div className="mt-4 grid grid-cols-7 gap-1">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <div key={index} className={`text-center py-1 rounded ${index > 0 && index < 6 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-400"}`}>
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
