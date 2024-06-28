// src/app/HomePage.tsx

import Image from "next/image";
import React from "react";
import Link from "next/link";
import CareGiverList from "./CareGiverList";
import { auth } from "@clerk/nextjs/server";
import { getCaregiverByClerkUserId } from "@/server/db/queries";

export const dynamic = "force-dynamic";

const HomePage = async () => {
  const { userId: clerkUserId } = auth();
  let caregiverProfileUrl = "/care-giver";

  if (clerkUserId) {
    try {
      const caregiver = await getCaregiverByClerkUserId(clerkUserId);
      if (caregiver) {
        caregiverProfileUrl = `/caregiver/${caregiver.id}/profile`;
      }
    } catch (error) {
      console.error("Error fetching caregiver profile:", error);
    }
  }

  const logoUrl =
    "https://utfs.io/f/90ba1135-a67e-4dd6-9615-71bb5634ec07-hzt98r.jpeg";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-2 md:py-4 md:px-6">
        <h1 className="text-2xl font-bold p-2 md:p-4 text-center">AyaCare</h1>
        <div className="relative w-full max-w-md mb-4 md:mb-8">
          <Image
            src={logoUrl}
            alt="Logo"
            layout="responsive"
            width={400}
            height={200}
            className="object-contain rounded-lg"
          />
        </div>
        <h3 className="text-lg font-semibold p-2 md:p-4 text-center w-full max-w-screen-sm">
          Connecting care-seekers with dedicated, background checked Muslim
          caregivers for a harmonious home.
        </h3>
        <div className="flex flex-col md:flex-row justify-center p-2 md:p-4 space-y-2 md:space-y-0 md:space-x-4 w-full">
          <div className="w-full md:w-auto">
            <Link href="/care-seeker">
              <button className="w-full md:w-64 bg-slate-800 text-white rounded-full px-6 py-3 shadow-lg hover:bg-slate-500 hover:shadow-xl transition-all duration-300 ease-in-out text-center">
                I&apos;m looking for care
              </button>
            </Link>
          </div>
          <div className="w-full md:w-auto">
            <Link href={caregiverProfileUrl}>
              <button className="w-full md:w-64 bg-slate-800 text-white rounded-full px-6 py-3 shadow-lg hover:bg-slate-500 hover:shadow-xl transition-all duration-300 ease-in-out text-center">
                I&apos;m a care giver
              </button>
            </Link>
          </div>
        </div>
      </div>
      <CareGiverList />
    </div>
  );
};

export default HomePage;
