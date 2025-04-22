'use client'

import { useState } from 'react'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal } from "lucide-react"
import FilterList from "@/components/FilterList"

// Définir l'interface pour les props
interface MobileFilterSheetProps {
  onCategoryChange: (category: number) => void;
}

// Accepter la prop dans la fonction du composant
export default function MobileFilterSheet({ onCategoryChange }: MobileFilterSheetProps) {
  const [open, setOpen] = useState(false)
  
  const handlePriceChange = (min: number, max: number) => {
    console.log('Price changed:', min, max)
    // Logique de filtrage ici
  }
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="lg:hidden rounded-full border-gray-200 w-10 h-10 flex items-center justify-center"
        >
          <SlidersHorizontal className="h-5 w-5 text-green-700" />
          <span className="sr-only">Filtres</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtres</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <FilterList 
            onCategoryChange={onCategoryChange}
            onPriceChange={handlePriceChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
} 