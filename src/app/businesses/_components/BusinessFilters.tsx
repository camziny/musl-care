"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/Checkbox";

const categories = [
  "all",
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

export default function BusinessFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function setParam(key: string, value?: string) {
    const sp = new URLSearchParams(params?.toString());
    if (value && value.length > 0) sp.set(key, value); else sp.delete(key);
    sp.set("page", "1");
    startTransition(() => router.push(`${pathname}?${sp.toString()}`));
  }

  return (
    <div className="grid gap-3 md:grid-cols-4">
      <Input placeholder="City" defaultValue={params?.get("city") ?? ""} onChange={(e) => setParam("city", e.target.value)} />
      <Input placeholder="State" defaultValue={params?.get("state") ?? ""} onChange={(e) => setParam("state", e.target.value)} />
      <Select defaultValue={params?.get("category") ?? "all"} onValueChange={(v) => setParam("category", v)}>
        <SelectTrigger>
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((c) => (
            <SelectItem key={c} value={c}>{c === "all" ? "All" : c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select defaultValue={params?.get("sort") ?? "most_recent"} onValueChange={(v) => setParam("sort", v)}>
        <SelectTrigger>
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="most_recent">Most recent</SelectItem>
          <SelectItem value="most_viewed">Most viewed</SelectItem>
          <SelectItem value="alphabetical">Alphabetical</SelectItem>
        </SelectContent>
      </Select>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox defaultChecked={params?.get("isMuslimOwned") === "true"} onCheckedChange={(v) => setParam("isMuslimOwned", v ? "true" : undefined)} />
        Muslim-owned
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox defaultChecked={params?.get("isArabOwned") === "true"} onCheckedChange={(v) => setParam("isArabOwned", v ? "true" : undefined)} />
        Arab-owned
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox defaultChecked={params?.get("isSouthAsianOwned") === "true"} onCheckedChange={(v) => setParam("isSouthAsianOwned", v ? "true" : undefined)} />
        South Asian-owned
      </label>
    </div>
  );
}


