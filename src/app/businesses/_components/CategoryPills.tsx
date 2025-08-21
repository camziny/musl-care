"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";

const categories = [
  "All",
  "Daycare",
  "Tutoring",
  "Senior recreation",
  "Products",
  "Clothing & Accessories",
  "Catering",
  "Food/restaurant",
  "Umrah/Hajj booking",
  "Legal services",
  "Therapists",
] as const;

export default function CategoryPills() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params?.get("category") || "All";

  function setCategory(value: string) {
    const sp = new URLSearchParams(params?.toString());
    if (value === "All") sp.delete("category"); else sp.set("category", value);
    sp.set("page", "1");
    router.push(`${pathname}?${sp.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <button key={c} onClick={() => setCategory(c)}>
          <Badge className={`${active === c ? "bg-primary text-white" : "bg-accent/30 text-foreground"}`}>{c}</Badge>
        </button>
      ))}
    </div>
  );
}


