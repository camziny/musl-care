"use client";
import { toast } from "sonner";

export function LikeClientButton() {
  return (
    <button
      className="text-xs text-muted-foreground hover:text-foreground"
      onClick={() => {
        toast.success("Liked");
      }}
    >
      Like
    </button>
  );
}

