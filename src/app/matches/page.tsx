import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Matches',
  description: 'Placeholder description for matches page',
};
import React from 'react';
import Image from 'next/image';

const MOCK_MATCHES = [
  {
    id: 1,
    name: "Sarah A.",
    experience: "5 years",
    languages: ["Arabic", "English"],
    availability: "Full-time",
    backgroundCheck: "Verified",
    rating: 4.8,
    matchScore: 95,
    specialties: ["Infant Care", "Special Needs"]
  },
];

export default function MatchesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Image
                src="https://utfs.io/f/90ba1135-a67e-4dd6-9615-71bb5634ec07-hzt98r.jpeg"
                alt="AyaCare Logo"
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Matches</h1>
                <p className="text-sm text-gray-600">Found {MOCK_MATCHES.length} potential caregivers</p>
              </div>
            </div>
            <button className="text-sm text-slate-600 hover:text-slate-800">
              Refine Preferences
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid gap-6">
          {MOCK_MATCHES.map((match) => (
            <div key={match.id} className="bg-white rounded-lg border p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{match.name}</h3>
                    <p className="text-sm text-gray-600">{match.experience} experience</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-slate-800">{match.matchScore}% Match</div>
                  <div className="text-sm text-gray-500">★ {match.rating}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Languages</h4>
                  <p className="text-gray-900">{match.languages.join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Availability</h4>
                  <p className="text-gray-900">{match.availability}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Specialties</h4>
                  <p className="text-gray-900">{match.specialties.join(", ")}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Background Check</h4>
                  <p className="text-green-600">{match.backgroundCheck}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-700 transition-colors">
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 