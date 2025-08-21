"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/Input";

export default function BusinessSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const q = e.target.value;
    const sp = new URLSearchParams(params?.toString());
    if (q) sp.set("q", q); else sp.delete("q");
    sp.set("page", "1");
    startTransition(() => router.push(`${pathname}?${sp.toString()}`));
  }

  return <Input type="search" placeholder="Search businesses" defaultValue={params?.get("q") ?? ""} onChange={onChange} aria-label="Search businesses" />;
}


