import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "About",
  description: "Placeholder description for about page",
};
import React from "react";
import Image from "next/image";

export default function About() {
  const features = [
    {
      title: "Cultural Alignment",
      description: "Connect with caregivers who understand and respect your values",
      icon: "🤝"
    },
    {
      title: "Verified Professionals",
      description: "Every caregiver undergoes thorough background checks",
      icon: "✓"
    },
    {
      title: "Specialized Care",
      description: "From childcare to elderly care, find the right support",
      icon: "💝"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-card/70 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <Image
              src="https://utfs.io/f/90ba1135-a67e-4dd6-9615-71bb5634ec07-hzt98r.jpeg"
              alt="AyaCare Logo"
              width={100}
              height={100}
              className="mx-auto rounded-full shadow-lg mb-8"
            />
            <h1 className="text-4xl font-bold text-foreground sm:text-5xl md:text-6xl">
              About AyaCare
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Connecting Muslim families with trusted caregivers who share their values
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-6 bg-gradient-to-b from-transparent to-muted"></div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {features.map((feature, index) => (
              <div key={index} className="mt-10 lg:mt-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-b from-primary/10 to-primary/20 text-primary mx-auto">
                  <span className="text-xl">{feature.icon}</span>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-foreground text-center">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-muted-foreground text-center">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 pb-16 sm:px-6 lg:px-8">
        <div className="bg-card/70 backdrop-blur-sm border border-border/50 rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 py-12 max-w-prose mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-8">Our Mission</h2>
            <div>
              <p className="text-muted-foreground leading-relaxed">
                Welcome to AyaCare, your trusted platform for connecting care-seekers 
                with dedicated, background-checked Muslim caregivers. Our mission is to 
                foster harmonious and safe homes by providing a reliable way for 
                individuals and families within the Muslim community to find 
                compassionate and trustworthy caregivers.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-6">
                We understand the importance of finding caregivers who not only possess 
                the necessary skills and experience but also share and respect your 
                cultural and religious values. Our caregivers undergo rigorous background 
                checks to ensure they meet the highest standards of trust and reliability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
