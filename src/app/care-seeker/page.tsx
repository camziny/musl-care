import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Care Seeker",
  description: "Placeholder description for care seeker page",
};
import React from "react";
import LookingForCare from "@/components/LookingForCare";

export default function CareSeekerPage() {
  return <LookingForCare />;
}
