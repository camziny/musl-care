import React from "react";
import FullPageCaregiverView from "@/components/CareGiverShow";

export default function CareGiverPage({
  params: { id: careGiverId },
}: {
  params: { id: string };
}) {
  const idAsNumber = Number(careGiverId);
  if (Number.isNaN(idAsNumber)) throw new Error("Invalid caregiver id");

  return <FullPageCaregiverView id={idAsNumber} />;
}
