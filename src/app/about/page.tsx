import React from "react";
import Image from "next/image";

export default function About() {
  const logoUrl =
    "https://utfs.io/f/90ba1135-a67e-4dd6-9615-71bb5634ec07-hzt98r.jpeg";
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 py-12 px-4 lg:py-24">
        <div className="max-w-3xl w-full bg-white p-8 shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
            About Us
          </h1>
          <p className="text-lg text-center text-gray-700 leading-relaxed">
            Welcome to [App Name], your trusted platform for connecting
            care-seekers with dedicated, background-checked Muslim caregivers.
            Our mission is to foster harmonious and safe homes by providing a
            reliable way for individuals and families within the Muslim
            community to find compassionate and trustworthy caregivers. We
            understand the importance of finding caregivers who not only possess
            the necessary skills and experience but also share and respect your
            cultural and religious values. Our caregivers undergo rigorous
            background checks to ensure they meet the highest standards of trust
            and reliability. Whether you are seeking care for children, the
            elderly, or loved ones with special needs, [App Name] is here to
            help you find the right match.
          </p>
        </div>
        <div className="relative w-full max-w-md py-8">
          <Image
            src={logoUrl}
            alt="Logo"
            layout="responsive"
            width={200}
            height={100}
            className="object-contain rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
