"use server";

import { deleteJobListing } from "@/server/db/queries";

export async function deleteJobAction(jobId: number) {
  try {
    await deleteJobListing(jobId);
  } catch (error) {
    console.error("Error deleting job:", error);
    throw new Error("Failed to delete job");
  }
}
