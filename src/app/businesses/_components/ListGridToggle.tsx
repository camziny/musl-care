"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LayoutGrid, List } from "lucide-react";

export default function ListGridToggle() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const mode = (params?.get("view") as "grid" | "list") || "grid";

  function setMode(next: "grid" | "list") {
    const sp = new URLSearchParams(params?.toString());
    sp.set("view", next);
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Button variant={mode === "grid" ? "default" : "outline"} size="icon" onClick={() => setMode("grid")}> <LayoutGrid className="h-4 w-4" /> </Button>
      <Button variant={mode === "list" ? "default" : "outline"} size="icon" onClick={() => setMode("list")}> <List className="h-4 w-4" /> </Button>
    </div>
  );
}


