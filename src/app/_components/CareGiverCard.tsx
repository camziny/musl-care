"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface CareGiverCardProps {
  careGiver: any;
  index: number;
}

export function CareGiverCard({ careGiver, index }: CareGiverCardProps) {
  let imageUrl = "/default-profile.jpg";
  let altText = "Caregiver profile picture";

  try {
    const image = JSON.parse(careGiver.image);
    imageUrl = image.url || imageUrl;
    altText = image.altText || altText;
  } catch (error) {
    imageUrl = careGiver.image;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <Link href={`/caregivers/${careGiver.id}`} className="block">
        <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-t-2xl bg-gray-200">
          <Image
            src={imageUrl}
            alt={altText}
            layout="fill"
            objectFit="cover"
            className="transform group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {careGiver.name}
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-800">
              Verified
            </span>
          </div>
          
          <p className="text-gray-600 line-clamp-2 mb-4">
            {careGiver.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-700">
              <svg 
                className="w-4 h-4 mr-1" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" 
                  clipRule="evenodd" 
                />
              </svg>
              <span className="text-sm">
                {careGiver.city}, {careGiver.state}
              </span>
            </div>
            
            <span className="inline-flex items-center text-slate-800 font-medium group-hover:translate-x-1 transition-transform duration-200">
              View Profile
              <svg 
                className="w-4 h-4 ml-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
} 