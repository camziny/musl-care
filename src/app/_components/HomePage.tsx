import Image from "next/image";
import React from "react";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const logoUrl =
    "https://utfs.io/f/90ba1135-a67e-4dd6-9615-71bb5634ec07-hzt98r.jpeg";

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white py-12 px-4">
        <h1 className="text-2xl font-bold p-4">Muslim Care</h1>
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
      </div>
    </div>
  );
}
