"use client";

import HeaderWithScroll from "@/components/HeaderWithScroll";
import { Suspense, useEffect, useState } from "react";
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
} from "@/components/ui/pagination";
import { Product } from "@/utils/interfaces/products.interface";
import {
  fetchProductsQuery,
  fetchProducts,
} from "@/utils/functions/filter.function";

export default function ListePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesSelected, setCategoriesSelected] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [priceFilter, setPriceFilter] = useState<
    { min: number; max: number }[]
  >([]);

  // Fonction unifiée pour récupérer les produits
  const fetchData = async () => {
    try {
      let response;

      if (categoriesSelected.length > 0 || priceFilter.length > 0) {
        const params: any = {
          page: currentPage.toString(),
        };
        if (categoriesSelected.length > 0)
          params.category = categoriesSelected.map(String);
        if (priceFilter.length > 0)
          params.price = priceFilter.map(({ min, max }) =>
            [min, max].join("-")
          );

        response = await fetchProductsQuery(
          params.page,
          params.category,
          params.price
        );
      } else {
        response = await fetchProducts(currentPage.toString());
      }

      // Extraire les produits et les métadonnées de pagination
      const { data, meta } = response;
      setProducts(data);
      setTotalProducts(meta.totalItems);
      setHasMoreProducts(meta.hasMore);
    } catch (error) {
      console.error("Erreur lors de la récupération des produits:", error);
    }
  };

  // Effect unique qui gère toutes les requêtes de produits
  useEffect(() => {
    fetchData();
  }, [categoriesSelected, priceFilter, currentPage]);

  const handlePageChange = (page: number) => {
    if (page > 0) {
      setCurrentPage(page);
    }
  };

  const onCategoryChange = (categories: number[]): boolean => {
    setCategoriesSelected(categories);
    setCurrentPage(1);
    return true;
  };

  const onPriceChange = (intervals: { min: number; max: number }[]) => {
    setPriceFilter(intervals);
    setCurrentPage(1);

  };

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

          <h1 className="font-['Archive'] text-3xl font-bold text-green-700 mb-2 mt-4 uppercase">
            Liste des produits
          </h1>
          <span className="text-gray-500 text-sm">
            {totalProducts} résultats
          </span>

          <div className="flex justify-between mt-4 items-center mb-4">
            <div className="md:hidden flex items-center gap-3">
              <MobileFilterSheet />

            </div>
            <div className="flex flex-row justify-center items-center">
              {/* Pagination */}
              {products && products.length > 0 && (
                <div>
                  <Pagination>
                    <PaginationContent>
                      {/* Précédent */}
                      <PaginationItem>
                        <button
                          className={`px-3 py-1 rounded-md border text-sm font-medium ${
                            currentPage === 1
                              ? "text-gray-400 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Précédent
                        </button>
                      </PaginationItem>

                      {/* Pages précédentes */}
                      {currentPage > 2 && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={() => handlePageChange(currentPage - 2)}
                          >
                            {currentPage - 2}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      {currentPage > 1 && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={() => handlePageChange(currentPage - 1)}
                          >
                            {currentPage - 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}

                      {/* Page actuelle */}
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>

                      {/* Pages suivantes */}
                      {hasMoreProducts && (
                        <PaginationItem>
                          <PaginationLink
                            href="#"
                            onClick={() => handlePageChange(currentPage + 1)}
                          >
                            {currentPage + 1}
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      {hasMoreProducts &&
                        currentPage + 1 < totalProducts / 9 && (
                          <PaginationItem>
                            <PaginationLink
                              href="#"
                              onClick={() => handlePageChange(currentPage + 2)}
                            >
                              {currentPage + 2}
                            </PaginationLink>
                          </PaginationItem>
                        )}

                      {/* Suivant */}
                      <PaginationItem>
                        <button
                          className={`px-3 py-1 rounded-md border text-sm font-medium ${
                            !hasMoreProducts
                              ? "text-gray-400 cursor-not-allowed"
                              : "hover:bg-gray-100"
                          }`}
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={!hasMoreProducts}
                        >
                          Suivant
                        </button>
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            {/* Filtres - masqués sur mobile */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <FilterList
                onCategoryChange={onCategoryChange}
                onPriceChange={onPriceChange}
              />
            </div>

            {/* Grille de produits */}
            <div className="flex-1">
              {products && products.length > 0 ? (
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

              ) : (
                <div className="text-center py-12 text-gray-500">
                  Aucun produit trouvé
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
