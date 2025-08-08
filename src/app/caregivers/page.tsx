import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Caregivers",
  description: "Placeholder description for caregivers page",
};
import React from "react";
import CareGiverList from "../_components/CareGiverList";

export default function CareGivers() {
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-muted to-background" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Caregivers</h1>
          <p className="mt-2 text-muted-foreground">Browse trusted, verified caregivers near you.</p>
        </div>
        <CareGiverList />
      </div>
    </section>
  );
}
