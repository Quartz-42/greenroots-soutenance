"use client";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";

interface Category {
  name: string;
  id: number;
  checked: boolean;
}

interface FilterListProps {
  onCategoryChange?: (category: number) => void;
  onPriceChange?: (min: number, max: number) => void;
}

export default function FilterList({
  onCategoryChange,
  onPriceChange,
}: FilterListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesSelected, setCategoriesSelected] = useState<Category[]>([]);
  const { data, loading, error } = useFetch<Category[]>(`categories`);

  useEffect(() => {
    if (data) {
      setCategories(data);
      console.log("data: ", data);
    } else {
      console.log("pas de data");
    }
  }, []);

  const priceRanges = [
    "Moins de 30€",
    "30€ à 100€",
    "100€ à 150€",
    "150€ à 500€",
    "500€ à 10000€",
  ];

  const handleCategoryChange = (categoryId: number) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, checked: !cat.checked } : cat
      )
    );
    onCategoryChange?.(categoryId);
  };

  console.log("catégories fetch", categories);

  return (
    <>
      {console.log("Les categories", categories)}
      <div className="w-full max-w-sm space-y-8 p-4 rounded-xs border border-gray-200 shadow-xs overflow-hidden">
        {/* Catégories */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center justify-between">
            Catégories
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 9l-7 7-7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h3>
          <svg
            className="w-4 h-4 absolute left-2.5 top-3 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.name} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  name={category.name}
                  checked={category.checked}
                  onCheckedChange={() => handleCategoryChange(category.id)}
                />
                <label
                  htmlFor={category.name}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Prix */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center justify-between">
            Prix
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 9l-7 7-7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range} className="flex items-center space-x-2">
                <Checkbox id={range} />
                <label
                  htmlFor={range}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {range}
                </label>
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input type="number" placeholder="300" className="w-24" />
            <span className="text-gray-500">à</span>
            <Input type="number" placeholder="3500" className="w-24" />
          </div>
        </div>

        {/* Taille */}
        <div>
          <h3 className="font-semibold text-lg flex items-center justify-between">
            Taille
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 9l-7 7-7-7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </h3>
        </div>
      </div>
    </>
  );
}
