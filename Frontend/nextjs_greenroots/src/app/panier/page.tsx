'use client'

import HeaderWithScroll from "@/components/HeaderWithScroll"
import { Suspense } from "react"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import ProductSummary from "@/components/ProductSummary"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import BestSellers from "@/components/BestSellers";
import { useCart } from "@/context/CartContext"

// Mock data pour les produits du panier
const initialProducts = [
  {
    id: 1,
    title: "Arbre violet",
    description: "Description du produit horizontally within a fixed viewport area.du produit horizontally within a ...",
    price: 189,
    quantity: 1,
    imageUrl: "/banner1.png"
  },
  {
    id: 2,
    title: "Arbre violet",
    description: "Description du produit horizontally within a fixed viewport area.du produit horizontally within a ...",
    price: 189,
    quantity: 2,
    imageUrl: "/banner2.png"
  },
  {
    id: 3,
    title: "Arbre violet",
    description: "Description du produit horizontally within a fixed viewport area.du produit horizontally within a ...",
    price: 189,
    quantity: 1,
    imageUrl: "/banner3.png"
  }
]

export default function PanierPage() {
  const [products, setProducts] = useState(initialProducts)
  const { cartItems } = useCart()

  const handleQuantityChange = (productId: number, newQuantity: number) => {
    setProducts(products.map(product => 
      product.id === productId ? { ...product, quantity: newQuantity } : product
    ))
  }

  const handleRemoveProduct = (productId: number) => {
    setProducts(products.filter(product => product.id !== productId))
  }

  const subtotal = products.reduce((sum, product) => sum + (product.price * product.quantity), 0)
  const tva = subtotal * 0.2 // 20% TVA
  const total = subtotal + tva

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
              { label: "Panier de commande" }
            ]} 
          />

          <h1 className="font-['Archive'] text-4xl font-bold text-green-700 mt-8 mb-12">
            MON PANIER
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Liste des produits */}
            <div className="lg:col-span-2 space-y-4">
              {products.map((product) => (
                <ProductSummary
                  key={product.id}
                  title={product.title}
                  description={product.description}
                  price={product.price}
                  quantity={product.quantity}
                  imageUrl={product.imageUrl}
                  onQuantityChange={(quantity) => handleQuantityChange(product.id, quantity)}
                  onRemove={() => handleRemoveProduct(product.id)}
                />
              ))}
            </div>

            {/* Récapitulatif */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-6">Récapitulatif</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>{subtotal}€</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>TVA</span>
                    <span>{tva}€</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t">
                    <span>Total</span>
                    <span>{total}€</span>
                  </div>
                </div>
                <Button className="w-full mt-6">
                  Procéder à l'enregistrement
                </Button>
                <a 
                  href="/liste" 
                  className="block text-center text-primary-500  mt-4 text-sm"
                >
                  Continuer vos achats →
                </a>
              </div>
            </div>
          </div>
        </div>
        <BestSellers/>
      </main>

      <Footer />
    </div>
  )
} 