"use client";

import HeaderWithScroll from "@/components/HeaderWithScroll";
import { Suspense, useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FilterList from "@/components/products/FilterList";
import MobileFilterSheet from "@/components/products/MobileFilterSheet";
import ListePagination from "@/components/products/ListePagination";
import ProductGrid from "@/components/products/ProductGrid";
import { Product } from "@/utils/interfaces/products.interface";
import { fetchData } from "@/utils/functions/products.function";

export default function ListePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesSelected, setCategoriesSelected] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const [priceFilter, setPriceFilter] = useState<
    { min: number; max: number }[]
  >([]);
  const [isMobile, SetIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      SetIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  useEffect(() => {
    fetchData(
      categoriesSelected,
      priceFilter,
      currentPage,
      setProducts,
      setTotalProducts,
      setHasMoreProducts
    );
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

          <div className="flex justify-between mt-4 items-center mb-4 ">
            <ListePagination 
              products={products}
              currentPage={currentPage}
              hasMoreProducts={hasMoreProducts}
              totalProducts={totalProducts}
              handlePageChange={handlePageChange}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            {isMobile ? (
              <div className="flex items-center gap-3">
                <MobileFilterSheet
                  onCategoryChange={onCategoryChange}
                  onPriceChange={onPriceChange}
                />
              </div>
            ) : (
              <div className="lg:block w-64 flex-shrink-0">
                <FilterList
                  onCategoryChange={onCategoryChange}
                  onPriceChange={onPriceChange}
                />
              </div>
            )}

            {/* Grille de produits */}
            <ProductGrid products={products} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
