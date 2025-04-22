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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Product } from "@/utils/interfaces/products.interface";
import { useFetch } from "@/hooks/useFetch";

export default function ListePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesSelected, setCategoriesSelected] = useState<number[]>([]);

  const categoryQuery = categoriesSelected
    .map((id) => `category=${id}`)
    .join("&");

  const url = `products/query?page=${currentPage}${
    categoryQuery ? `&${categoryQuery}` : ""
  }`;

  const { data: products, loading, error } = useFetch<Product[]>(url);

  console.log("categories sélectionnées :", categoriesSelected);
  console.log("les produits", products);

  const handlePageChange = (page: number) => {
    if (page > 0) {
      setCurrentPage(page);
    }
  };
  console.log("url : ", url);

  const onCategoryChange = (categories: number[]) => {
    setCategoriesSelected(categories);
    setCurrentPage(1);
    console.log("url CHANGED: ", url);
  };



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

  return (
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
                {products?.length ?? 0} résultats
              </span>
            </div>

            <div className="flex items-center">
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

          <div className="flex gap-4">
            {/* Filtres - masqués sur mobile */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <FilterList onCategoryChange={onCategoryChange} />
            </div>

            {/* Grille de produits */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
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
                      {currentPage > 1 ? (
                        <PaginationPrevious
                          onClick={() => handlePageChange(currentPage - 1)}
                        >
                          Précédent
                        </PaginationPrevious>
                      ) : (
                        <div className="opacity-50 pointer-events-none">
                          <PaginationPrevious>Précédent</PaginationPrevious>
                        </div>
                      )}
                    </PaginationItem>

                    {/* Page actuelle */}
                    <PaginationItem>
                      <PaginationLink href="#" isActive>
                        {currentPage}
                      </PaginationLink>
                    </PaginationItem>

                    {/* Page suivante */}
                    <PaginationItem>
                      {products && products.length === 20 ? (
                        <PaginationNext
                          onClick={() => handlePageChange(currentPage + 1)}
                        >
                          Suivant
                        </PaginationNext>
                      ) : (
                        <div className="opacity-50 pointer-events-none">
                          <PaginationNext>Suivant</PaginationNext>
                        </div>
                      )}
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
  );
}
