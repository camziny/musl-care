import Image from "next/image";
import React from "react";
import Link from "next/link";
import CareGiverList from "./CareGiverList";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const logoUrl =
    "https://utfs.io/f/90ba1135-a67e-4dd6-9615-71bb5634ec07-hzt98r.jpeg";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-12 px-4">
        <h1 className="text-2xl font-bold p-4">(Name of App)</h1>
        <h3 className="text-lg font-semibold p-4">
          Connecting care-seekers with dedicated, background checked Muslim
          caregivers for a harmonious home.
        </h3>
        <div className="relative w-full max-w-md mb-8">
          <Image
            src={logoUrl}
            alt="Logo"
            layout="responsive"
            width={400}
            height={200}
            className="object-contain rounded-lg"
          />
        </div>
        <div className="flex justify-center p-4 space-x-4">
          <div className="p-2">
            <Link href="/care-seeker">
              <button className="w-64 bg-stone-500 text-white rounded-lg px-6 py-3 shadow-md hover:bg-stone-400 transition-all duration-300 text-center">
                I&apos;m looking for care
              </button>
            </Link>
          </div>
          <div className="p-2">
            <Link href="/care-giver">
              <button className="w-64 bg-stone-500 text-white rounded-lg px-6 py-3 shadow-md hover:bg-stone-400 transition-all duration-300 text-center">
                I&apos;m a care giver
              </button>
            </Link>
          </div>
        </div>
      </div>
      <CareGiverList />
    </div>
  );
}
