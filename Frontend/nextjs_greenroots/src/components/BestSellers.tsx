"use client";

import ProductCard from "./ProductCard";
import { Product } from "@/utils/interfaces/products.interface";
import { useFetch } from "@/hooks/useFetch";
export default function BestSellers() {
  const { data: bestSellerProducts, loading, error } = useFetch<Product[]>('products/best-sellers');

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
