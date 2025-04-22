"use client";

import HeaderWithScroll from "@/components/HeaderWithScroll";
import { Suspense, useState } from "react";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FilterList from "@/components/FilterList";
import ProductCard from "@/components/ProductCard";
import MobileFilterSheet from "@/components/MobileFilterSheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Product } from "@/utils/interfaces/products.interface";
import { useFetch } from "@/hooks/useFetch";

export default function ListePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [category, setCategory] = useState<number | undefined>(undefined);
  const {
    data: products,
    loading,
    error,
    // } = useFetch<Product>(
    //   `products/query?page=${currentPage}&category=${category}`
  } = useFetch<Product[]>(`products?page=${currentPage}`);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        Error: {error.message}
      </div>
    );
  }

  // Fonction pour changer de page
  const handlePageChange = (page: number) => {
    if (page > 0) {
      setCurrentPage(page);
    }
  };

  const handleCategoryChange = (newCategory: number) => {
    // si on reclique sur la même catégorie, on lève le filtre
    setCategory((prev) => (prev === newCategory ? undefined : newCategory));
  };

  return (
    <>
      {console.log(products.length)}
      <div className="relative min-h-screen">
        <Suspense fallback={<div className="h-16"></div>}>
          <HeaderWithScroll />
        </Suspense>

        <main className="pt-24 pb-16">
          <div className="container mx-auto max-w-7xl px-4 md:px-6">
            <Breadcrumb
              items={[
                { label: "Accueil", href: "/" },
                { label: "Liste des produits" },
              ]}
            />

            <h1 className="font-['Archive'] text-3xl font-bold text-green-700 mb-6 mt-4 uppercase">
              Liste des produits
            </h1>

            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <MobileFilterSheet />
                <span className="text-gray-500 text-sm">
                  {products.length} résultats
                </span>
              </div>

              <div className="flex items-center">
                <div className="relative">
                  <Select>
                    <SelectTrigger className="border-none shadow-none px-3 focus-visible:ring-0 focus-visible:border-0 text-gray-700">
                      <span className="flex items-center">
                        <span className="mr-2">Trier par prix</span>
                        <SelectValue placeholder="" />
                      </span>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Prix croissant</SelectItem>
                      <SelectItem value="desc">Prix décroissant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              {/* Filtres - masqués sur mobile */}
              <div className="hidden lg:block w-64 flex-shrink-0">
                <FilterList onCategoryChange={handleCategoryChange} />
              </div>

              {/* Grille de produits */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      short_description={product.short_description}
                      price={product.price}
                      imageUrl={
                        product.Image && product.Image[0]
                          ? product.Image[0].url
                          : "/product.png"
                      }
                    />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8">
                  <Pagination>
                    <PaginationContent>
                      {/* Page précédente */}
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Précédent
                        </PaginationPrevious>
                      </PaginationItem>
                      {/* Page actuelle */}
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>
                      {/* Page suivante */}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={products.length < 20} // Assumes that there are always 20 items per page
                        >
                          Suivant
                        </PaginationNext>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
