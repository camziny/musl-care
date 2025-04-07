import React from "react";
import JobShowPage from "@/components/JobShow";

export default function JobDetails({ params }: { params: { id: string } }) {
  return <JobShowPage id={parseInt(params.id)} />;
}
