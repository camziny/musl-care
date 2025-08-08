import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Caregivers",
  description: "Placeholder description for caregivers page",
};
import React from "react";
import CareGiverList from "../_components/CareGiverList";

export default function CareGivers() {
  return <CareGiverList />;
}
