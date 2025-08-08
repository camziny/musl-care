import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Jobs",
  description: "Placeholder description for jobs page",
};
import React from "react";
import JobList from "../_components/JobList";

export default function JobListPage() {
  return (
    <div className="pt-6 sm:pt-8 md:pt-10">
      <JobList />
    </div>
  );
}
