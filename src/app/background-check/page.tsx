import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Background Check',
  description: 'Placeholder description for background check page',
};
import React from 'react';
import { Button } from '@/components/ui/Button';
import Image from 'next/image';

export default function BackgroundCheckPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 bg-white border-b">
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
              <h1 className="text-2xl font-bold text-gray-900">Background Check</h1>
              <p className="text-sm text-gray-600">Complete your verification process</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg border p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Background Check Process</h2>
            <p className="text-gray-600">This process typically takes 3-5 business days</p>
          </div>

          <div className="space-y-6">
            <div className="border-b pb-6">
              <h3 className="font-medium text-gray-900 mb-2">What&apos;s included:</h3>
              <ul className="space-y-3">
                {[
                  'Criminal record check',
                  'Identity verification',
                  'Address history verification',
                  'Reference checks'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-600">
                    <span className="mr-2">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <Button className="w-full h-12">Start Background Check ($XX.XX)</Button>
              <p className="text-sm text-gray-500 text-center">
                By proceeding, you agree to our background check terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 