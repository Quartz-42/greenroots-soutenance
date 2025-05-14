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

// Définir l'interface pour les props
interface MobileFilterSheetProps {
  onCategoryChange?: (categoriesId: number[]) => void;
  onPriceChange?: (intervals: { min: number; max: number }[]) => void;
}

// Accepter la prop dans la fonction du composant
export default function MobileFilterSheet({
  onCategoryChange,
  onPriceChange,
}: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false);
  const [lastSelectedCategories, setLastSelectedCategories] = useState<
    number[]
  >([]);
  const [priceRanges, setPriceRanges] = useState<
    { min: number; max: number }[]
  >([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [products, setProducts] = useState<{ price: number }[]>([]);

  // Gestion du changement de range de prix
  const handlePriceChange = (range: { min: number; max: number }) => {
    const key = `${range.min}-${range.max}`;
    let updated: string[];
    if (selectedPriceRanges.includes(key)) {
      updated = selectedPriceRanges.filter((k) => k !== key);
    } else {
      updated = [...selectedPriceRanges, key];
    }
    setSelectedPriceRanges(updated);

    // On passe tous les intervalles sélectionnés au parent
    const intervals = updated.map((k) => {
      const [min, max] = k.split("-").map(Number);
      return { min, max };
    });
    onPriceChange?.(intervals);
  };

  // Tri des produits par price range
  function computePriceRanges(products: { price: number }[]) {
    const rangeMap = new Map<number, { min: number; max: number }>();
    for (const { price } of products) {
      const start = Math.floor(price / 5) * 5;
      if (!rangeMap.has(start)) {
        rangeMap.set(start, { min: start, max: start + 4.99 });
      }
    }
    return Array.from(rangeMap.values()).sort((a, b) => a.min - b.min);
  }

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
            onCategoryChange={onCategoryChange}
            onPriceChange={onPriceChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
