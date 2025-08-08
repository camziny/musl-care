// src/app/HomePage.tsx

import Image from "next/image";
import React from "react";
import Link from "next/link";
import CareGiverList from "./CareGiverList";
import { FeatureTiles } from "./FeatureTiles";
import { auth } from "@clerk/nextjs/server";
import { getCaregiverByClerkUserId } from "@/server/db/queries";

export const dynamic = "force-dynamic";

const HomePage = async () => {
  const { userId: clerkUserId } = auth();
  let caregiverProfileUrl = "/caregivers/register";
  let hasProfile = false;

  if (clerkUserId) {
    try {
      const caregiver = await getCaregiverByClerkUserId(clerkUserId, false);
      if (caregiver) {
        caregiverProfileUrl = `/caregiver/${caregiver.id}/profile`;
        hasProfile = true;
      }
    } catch (error) {
      console.log("User doesn't have a caregiver profile yet");
    }
  }

  const logoUrl = "https://utfs.io/f/90ba1135-a67e-4dd6-9615-71bb5634ec07-hzt98r.jpeg";

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900">
                Find trusted Muslim caregivers
              </h1>
              <p className="mt-4 text-lg text-slate-600 max-w-xl">
                Matching families with vetted caregivers who understand your values, culture, and needs.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link href="/care-seeker" className="w-full sm:w-auto">
                  <button className="w-full px-6 py-3 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800">
                    I&apos;m looking for care
                  </button>
                </Link>
                <Link href={caregiverProfileUrl} className="w-full sm:w-auto">
                  <button className="w-full px-6 py-3 rounded-full border border-slate-900 text-slate-900 text-sm font-medium hover:bg-slate-50">
                    {hasProfile ? 'View my profile' : 'I\'m a care giver'}
                  </button>
                </Link>
              </div>
              <div className="mt-6 flex items-center gap-6 text-sm text-slate-600">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" /> Verified caregivers</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" /> Cultural alignment</div>
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-purple-500" /> Easy matching</div>
              </div>
            </div>
            <div className="relative w-full h-[420px] sm:h-[520px]">
              <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-slate-100 to-slate-200 blur-2xl" />
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-slate-200 bg-white">
                <Image src={logoUrl} alt="AyaCare" fill className="object-cover" priority />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FeatureTiles />
        </div>
      </section>

      <section className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Featured caregivers</h2>
            <Link href="/caregivers" className="text-sm text-slate-700 underline">View all</Link>
          </div>
          <CareGiverList />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
