"use client";

import * as React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/utils/interfaces/products.interface";
import { useFetch } from "@/hooks/useFetch";

export default function BestSellers() {
  const [randomIds, setRandomIds] = React.useState<number[]>([]);

  React.useEffect(() => {
    // Fonction pour générer un nombre aléatoire entre min et max inclus
    const getRandomInt = (min: number, max: number) => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // Générer 4 IDs uniques aléatoires
    const generateRandomIds = () => {
      const ids = new Set<number>();
      while (ids.size < 4) {
        ids.add(getRandomInt(1, 188));
      }
      return Array.from(ids);
    };

    setRandomIds(generateRandomIds());
  }, []);

  // Récupération des produits avec les IDs aléatoires
  const {
    data: product1,
    loading: loading1,
    error: error1,
  } = useFetch<Product>(randomIds[0] ? `products/${randomIds[0]}` : "");
  const {
    data: product2,
    loading: loading2,
    error: error2,
  } = useFetch<Product>(randomIds[1] ? `products/${randomIds[1]}` : "");
  const {
    data: product3,
    loading: loading3,
    error: error3,
  } = useFetch<Product>(randomIds[2] ? `products/${randomIds[2]}` : "");
  const {
    data: product4,
    loading: loading4,
    error: error4,
  } = useFetch<Product>(randomIds[3] ? `products/${randomIds[3]}` : "");

  // Combinaison des résultats
  const bestSellerProducts = React.useMemo(() => {
    const products = [];
    if (product1?.id) products.push(product1);
    if (product2?.id) products.push(product2);
    if (product3?.id) products.push(product3);
    if (product4?.id) products.push(product4);
    return products;
  }, [product1, product2, product3, product4]);

  // État de chargement global
  const isLoading =
    loading1 || loading2 || loading3 || loading4 || randomIds.length === 0;

  // Gestion des erreurs
  const hasError = randomIds.length > 0 && (error1 || error2 || error3 || error4);
  const errorMessage =
    error1?.message ||
    error2?.message ||
    error3?.message ||
    error4?.message ||
    "Une erreur est survenue lors du chargement des produits";

  if (isLoading) {
    return (
      <section className="bg-white pt-2 pb-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-['Archive'] text-3xl font-bold text-green-700 mb-8">
            Nos best-sellers
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="h-64 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-64 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-64 bg-gray-200 animate-pulse rounded-md"></div>
            <div className="h-64 bg-gray-200 animate-pulse rounded-md"></div>
          </div>
        </div>
      </section>
    );
  }

  if (hasError) {
    return (
      <section className="bg-white pt-2 pb-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-['Archive'] text-3xl font-bold text-green-700 mb-8">
            Nos best-sellers
          </h2>
          <div className="p-4 bg-red-100 text-gray-200 rounded-md">
            Erreur: {errorMessage}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white pt-2 pb-16">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="font-['Archive'] text-3xl font-bold text-green-700 mb-8">
          Nos best-sellers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellerProducts &&
            bestSellerProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                short_description={product.short_description || ""}
                price={product.price}
                imageUrl={
                  product.Image && product.Image[0]
                    ? product.Image[0].url
                    : "/product.png"
                }
              />
            ))}
        </div>
      </div>
    </section>
  );
}
