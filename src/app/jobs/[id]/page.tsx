import React from "react";
import JobShowPage from "@/components/JobShow";

export default function JobListingPage({
  params: { id: jobListingId },
}: {
  params: { id: string };
}) {
  const idAsNumber = Number(jobListingId);
  if (Number.isNaN(idAsNumber)) throw new Error("Invalid job listing id");

  return <JobShowPage id={idAsNumber} />;
}
