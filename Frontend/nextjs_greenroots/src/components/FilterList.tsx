"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import {
  fetchCategories,
  fetchAllProducts,
} from "@/utils/functions/filter.function";

interface Category {
  name: string;
  id: number;
  checked: boolean;
}

interface FilterListProps {
  onCategoryChange?: (categoriesId: number[]) => boolean;
  onPriceChange?: (min: number, max: number) => void;
}

export default function FilterList({
  onCategoryChange,
  onPriceChange,
}: FilterListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesSelected, setCategoriesSelected] = useState<number[]>([]);
  const [products, setProducts] = useState<{ price: number }[]>([]);
  const [priceRanges, setPriceRanges] = useState<
    { min: number; max: number }[]
  >([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(
    null
  );

  // Fetch des categories pour leurs noms au montage du composant
  const fetchCategoriesName = async () => {
    const data = await fetchCategories();
    setCategories(data);
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

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategoriesName();
    }
  }, []);

  useEffect(() => {
    const fetchAndCompute = async () => {
      const result = await fetchAllProducts();
      const productsData = result.data;
      setProducts(productsData);
      const ranges = computePriceRanges(productsData);
      setPriceRanges(ranges);
    };
    fetchAndCompute();
  }, []);

  // Appel de la fonction onCategoryChange pour notifier le parent des catégories sélectionnées
  const handleCategoryChange = (categoryId: number, isChecked: boolean) => {
    const updated = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, checked: isChecked } : cat
    );
    setCategories(updated);
    const selectedIds = updated.filter((c) => c.checked).map((c) => c.id);
    setCategoriesSelected(selectedIds);
    onCategoryChange?.(selectedIds);
  };

  // Gestion du changement de range de prix (un seul à la fois)
  const handlePriceRangeChange = (range: { min: number; max: number }) => {
    const key = `${range.min}-${range.max}`;
    if (selectedPriceRange === key) {
      setSelectedPriceRange(null);
      onPriceChange?.(0, Number.MAX_SAFE_INTEGER); // Réinitialise le filtre prix
    } else {
      setSelectedPriceRange(key);
      onPriceChange?.(range.min, range.max);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-8 p-4 rounded-xs border border-gray-200 shadow-xs overflow-hidden">
      {/* Catégories */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center justify-between">
          Catégories
        </h3>
        <div>
          {categories.map((category) => {
            const inputId = `category-${category.id}`;
            return (
              <div
                key={category.id}
                className="flex items-center space-x-2 space-y-2"
              >
                <Checkbox
                  id={inputId}
                  checked={category.checked}
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category.id, !!checked)
                  }
                />
                <label
                  htmlFor={inputId}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prix */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center justify-between">
          Prix
        </h3>
        <div className="space-y-2">
          {priceRanges.map((range) => {
            const label = `${range.min}€ - ${range.max.toFixed(2)}€`;
            const id = `price-${range.min}-${range.max}`;
            const key = `${range.min}-${range.max}`;
            return (
              <div key={id} className="flex items-center space-x-2">
                <Checkbox
                  id={id}
                  checked={selectedPriceRange === key}
                  onCheckedChange={() => handlePriceRangeChange(range)}
                />
                <label
                  htmlFor={id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {label}
                </label>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
