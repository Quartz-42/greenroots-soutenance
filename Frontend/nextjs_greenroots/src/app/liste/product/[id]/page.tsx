"use client";

import React, { useState } from "react";
import HeaderWithScroll from "@/components/header/HeaderWithScroll";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Image from "next/image";
import BestSellers from "@/components/BestSellers";
import { toast } from "react-toastify";
import ProductInfo from "@/components/products/ProductInfo";
import { Product } from "@/utils/interfaces/products.interface";
import { useFetch } from "@/hooks/useFetch";
import { useCart } from "@/context/CartContext";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;
  const {
    data: product,
    loading,
    error,
  } = useFetch<Product>(`products/${productId}`);
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
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

  const handleAddToCart = () => {
    if (!product) return;
    const productData = product as any;

    try {
      addToCart({
        id: productData.id,
        title: productData.name || "",
        price: productData.price,
        quantity: quantity,
        imageName: productData.Image?.[0]?.name,
        description: productData.short_description || "",
      });
      toast.success(
        `${productData.name || "Produit"} - Quantité: ${quantity} ajouté au panier !`
      );
    } catch (error) {
      toast.error("Erreur lors de l'ajout du produit au panier.");
    }
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
              { label: "Liste des produits", href: "/liste" },
              { label: product?.name || "Produit" },
            ]}
          />

          <h1 className="font-['Archive'] text-4xl font-bold text-green-700 mt-8 mb-12">
            {product?.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Image du produit */}
            <div className="relative aspect-square rounded-sm overflow-hidden bg-gray-100">
          <Image
              src={product?.Image?.[0]?.name || '/placeholder.jpg'}
              alt={product?.name || "Produit"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            </div>

            {/* Informations du produit - Maintenant géré par ProductInfo.tsx */}
            <ProductInfo
              product={product}
              quantity={quantity}
              setQuantity={setQuantity}
              handleAddToCart={handleAddToCart}
            />
          </div>
        </div>
        <BestSellers />
      </main>

      <Footer />
    </div>
  );
}
