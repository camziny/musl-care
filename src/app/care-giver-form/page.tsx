import CareGiverForm from '@/components/CareGiverForm'
import React from 'react'
import Image from 'next/image'

export default function CareGiverFormPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="w-full bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Image
              src="https://utfs.io/f/90ba1135-a67e-4dd6-9615-71bb5634ec07-hzt98r.jpeg"
              alt="AyaCare Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Become a Caregiver</h1>
              <p className="text-sm text-gray-600">Join our community of trusted caregivers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Info Panel */}
          <div className="md:col-span-4 space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Why Join AyaCare?</h2>
              <ul className="space-y-4">
                {[
                  'Connect with families who share your values',
                  'Flexible scheduling options',
                  'Competitive compensation',
                  'Supportive community',
                  'Professional development opportunities'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-slate-800 mr-2">•</span>
                    <span className="text-gray-600">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-4">Getting Started</h2>
              <p className="text-slate-200 mb-4">
                Complete your profile, pass our background check, and start connecting with families in need of care.
              </p>
              <div className="flex items-center text-sm text-slate-300 border-t border-slate-700 pt-4 mt-4">
                <span className="mr-2">ℹ️</span>
                <span>Background check required for all caregivers</span>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="md:col-span-8">
            <CareGiverForm />
          </div>
        </div>
      </div>
    </div>
  )
}
