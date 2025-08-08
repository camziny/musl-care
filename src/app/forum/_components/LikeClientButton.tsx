"use client";
import { toast } from "sonner";

export function LikeClientButton() {
  return (
    <button
      className="text-xs text-slate-600 hover:text-slate-800"
      onClick={() => {
        toast.success("Liked");
      }}
    >
      Like
    </button>
  );
}

