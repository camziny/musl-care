"use client";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/Sheet";
import { Button } from "@/components/ui/Button";
import BusinessFilters from "./BusinessFilters";
import { SlidersHorizontal } from "lucide-react";

export default function MobileFiltersDrawer() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="rounded-full"><SlidersHorizontal className="mr-2 h-4 w-4" /> Filters</Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <div className="mx-auto max-w-6xl py-4 space-y-4">
            <div className="text-sm font-medium">Refine results</div>
            <BusinessFilters />
            <SheetClose asChild>
              <Button className="w-full">Apply</Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}


