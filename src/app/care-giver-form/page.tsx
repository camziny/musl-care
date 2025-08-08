import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Become a Caregiver',
  description: 'Placeholder description for become a caregiver page',
};
import React from 'react';
import CareGiverForm from '@/components/CareGiverForm';

export default function CareGiverFormPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Become a Caregiver</h1>
          <p className="mt-2 text-lg text-gray-600">
            Fill out the form below to create your caregiver profile
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="w-full max-w-3xl bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">
                Let families know about your services and availability
              </p>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                Step 1 of 2
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          <div className="md:col-span-4">
            <div className="sticky top-[180px] space-y-6">
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">What We&apos;ll Need</h2>
                <ul className="space-y-4">
                  {[
                    'Type of care you provide',
                    'Religious background',
                    'Cultural background',
                    'Languages spoken',
                    'Age groups you can serve',
                    'Care capacity and schedule'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-slate-800 mr-2">•</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-slate-800 rounded-lg p-6 text-white">
                <h2 className="text-lg font-semibold mb-4">Background Check Required</h2>
                <p className="text-slate-200 mb-4">
                  All caregivers must pass a background check before being matched with families.
                </p>
                <div className="flex items-center text-sm text-slate-300 border-t border-slate-700 pt-4 mt-4">
                  <span className="mr-2">ℹ️</span>
                  <span>This helps ensure safety and trust</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-8">
            <CareGiverForm />
          </div>
        </div>
      </div>
    </div>
  );
}
