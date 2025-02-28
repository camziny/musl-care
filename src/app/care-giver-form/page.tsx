import CareGiverForm from '@/components/CareGiverForm'
import React from 'react'
import Image from 'next/image'

export default function CareGiverFormPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-4 sm:pt-2">
      <div className="relative bg-white border-b shadow-sm mb-4">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 mt-10">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Image
              src="https://utfs.io/f/90ba1135-a67e-4dd6-9615-71bb5634ec07-hzt98r.jpeg"
              alt="AyaCare Logo"
              width={36}
              height={36}
              className="rounded-full w-9 h-9 sm:w-12 sm:h-12"
            />
            <div>
              <h1 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900 leading-tight">Become a Caregiver</h1>
              <p className="text-xs sm:text-sm text-gray-600">Join our community of trusted caregivers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
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
  )
}
