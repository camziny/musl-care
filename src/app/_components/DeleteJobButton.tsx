"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { deleteJobAction } from "../actions/jobActions";

type DeleteJobButtonProps = {
  jobId: number;
};

export default function DeleteJobButton({ jobId }: DeleteJobButtonProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await deleteJobAction(jobId);
        toast.success("Job deleted successfully!");
        router.refresh();
      } catch (error) {
        console.error("Error deleting job:", error);
        toast.error("Failed to delete job. Please try again.");
      }
    });
  };

  return (
    <button
      type="button"
      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition duration-200"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "Deleting..." : "Delete Job"}
    </button>
  );
}
