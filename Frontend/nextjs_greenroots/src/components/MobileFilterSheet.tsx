"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import FilterList from "@/components/FilterList";

interface MobileFilterSheetProps {
  onCategoryChange?: (categoriesId: number[]) => void;
  onPriceChange?: (intervals: { min: number; max: number }[]) => void;
}

export default function MobileFilterSheet({
  onCategoryChange,
  onPriceChange,
}: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<{ min: number; max: number }[]>([]);

  const handleCategoryChange = (categoriesId: number[]) => {
    setSelectedCategories(categoriesId);
    onCategoryChange?.(categoriesId);
  };

  const handlePriceChange = (intervals: { min: number; max: number }[]) => {
    setSelectedPriceRanges(intervals);
    onPriceChange?.(intervals);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full border-gray-200 w-10 h-10 flex items-center justify-center"
        >
          <SlidersHorizontal className="h-5 w-5 text-green-700" />
          <span className="sr-only">Filtres</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-[300px] sm:w-[350px] overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle>Filtres</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <FilterList
            onCategoryChange={handleCategoryChange}
            onPriceChange={handlePriceChange}
            initialSelectedCategories={selectedCategories}
            initialSelectedPriceRanges={selectedPriceRanges}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
