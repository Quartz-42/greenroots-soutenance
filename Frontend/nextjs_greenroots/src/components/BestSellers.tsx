"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/utils/interfaces/products.interface";
import { useFetch } from "@/hooks/useFetch";
export default function BestSellers() {
  const { data: bestSellerProducts, loading, error } = useFetch<Product[]>('products/best-sellers');

  // Gestion de l'état de chargement
  if (loading) {
    return (
      <section className="bg-white pt-2 pb-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-['Archive'] text-3xl font-bold text-green-700 mb-8">
            Nos best-sellers
          </h2>
          {/* Skeletons pour indiquer le chargement */}
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

  // Gestion de l'état d'erreur
  if (error) {
    return (
      <section className="bg-white pt-2 pb-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <h2 className="font-['Archive'] text-3xl font-bold text-green-700 mb-8">
            Nos best-sellers
          </h2>
          <div className="p-4 bg-red-100 text-red-700 rounded-md">
            Erreur lors du chargement des best-sellers: {error.message || 'Une erreur inconnue est survenue.'}
          </div>
        </div>
      </section>
    );
  }

  // Affichage des produits si tout s'est bien passé
  return (
    <section className="bg-white pt-2 pb-16">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="font-['Archive'] text-3xl font-bold text-green-700 mb-8">
          Nos best-sellers
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellerProducts && bestSellerProducts.length > 0 ? (
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
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">Aucun best-seller trouvé.</p> // Message si aucun produit n'est retourné
          )}
        </div>
      </div>
    </section>
  );
}
