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
  const [lastSelectedCategories, setLastSelectedCategories] = useState<number[]>([])
  
  const handlePriceChange = (min: number, max: number) => {
    console.log('Price changed:', min, max)
    // Logique de filtrage ici
  }
  
  // Fonction adaptateur qui convertit onCategoryChange pour qu'il soit compatible avec FilterList
  const handleFilterListCategoryChange = (categoriesId: number[]): boolean => {
    // Identifier quelle catégorie a changé en comparant avec l'état précédent
    if (categoriesId.length > lastSelectedCategories.length) {
      // Une catégorie a été ajoutée - trouver laquelle
      const addedCategory = categoriesId.find(id => !lastSelectedCategories.includes(id))
      if (addedCategory !== undefined) {
        onCategoryChange(addedCategory)
      }
    } else if (categoriesId.length < lastSelectedCategories.length) {
      // Une catégorie a été supprimée - trouver laquelle
      const removedCategory = lastSelectedCategories.find(id => !categoriesId.includes(id))
      if (removedCategory !== undefined) {
        onCategoryChange(removedCategory)
      }
    }
    
    // Mettre à jour l'état des catégories sélectionnées
    setLastSelectedCategories(categoriesId)
    return true
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
            onCategoryChange={handleFilterListCategoryChange}
            onPriceChange={handlePriceChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  )
} 