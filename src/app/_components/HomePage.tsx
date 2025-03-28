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
  let caregiverProfileUrl = "/care-giver-form";
  let hasProfile = false;

  if (clerkUserId) {
    try {
      const caregiver = await getCaregiverByClerkUserId(clerkUserId, false);
      if (caregiver) {
        caregiverProfileUrl = `/caregiver/${caregiver.id}/profile`;
        hasProfile = true;
      }
    } catch (error) {
      // User exists but doesn't have a caregiver profile yet - this is normal
      console.log("User doesn't have a caregiver profile yet");
    }
  }

  const logoUrl = "https://utfs.io/f/90ba1135-a67e-4dd6-9615-71bb5634ec07-hzt98r.jpeg";

  return (
    <div className="min-h-screen">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-8 md:py-16">
            <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-6 md:gap-12 items-center">
              <div className="space-y-6 text-center md:text-left">
                <div className="space-y-3">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                    Find Your Perfect Care Match
                  </h1>
                  <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto md:mx-0">
                    Connecting care-seekers with dedicated, background checked Muslim caregivers for a harmonious home.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <Link href="/care-seeker" className="w-full sm:w-auto">
                    <button className="w-full px-6 py-3 bg-slate-800 text-white rounded-lg 
                      hover:bg-slate-700 transition-all duration-200 font-medium
                      focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                      I&apos;m looking for care
                    </button>
                  </Link>
                  <Link href={caregiverProfileUrl} className="w-full sm:w-auto">
                    <button className="w-full px-6 py-3 bg-white text-slate-800 rounded-lg 
                      border-2 border-slate-800 hover:bg-slate-50 transition-all duration-200 
                      font-medium focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                      {hasProfile ? 'View my profile' : 'I\'m a care giver'}
                    </button>
                  </Link>
                </div>
              </div>

              <div className="relative w-full aspect-square max-w-sm md:max-w-none md:h-[450px] rounded-2xl overflow-hidden">
                <Image
                  src={logoUrl}
                  alt="AyaCare"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              title: "Verified Caregivers",
              description: "Every caregiver undergoes a thorough background check",
              icon: "🔒"
            },
            {
              title: "Cultural Alignment",
              description: "Find caregivers who share your values and traditions",
              icon: "🤝"
            },
            {
              title: "Easy Matching",
              description: "Our platform makes it simple to find the perfect match",
              icon: "✨"
            }
          ].map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border hover:border-slate-300 transition-colors">
              <div className="text-2xl sm:text-3xl mb-3">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <CareGiverList />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
