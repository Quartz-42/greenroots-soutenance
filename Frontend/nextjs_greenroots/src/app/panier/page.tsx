'use client'

import HeaderWithScroll from "@/components/HeaderWithScroll"
import { Suspense } from "react"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import ProductSummary from "@/components/ProductSummary"
import { Button } from "@/components/ui/button"
import BestSellers from "@/components/BestSellers";
import { useCart } from "@/context/CartContext"
import {processCartItems} from "@/utils/functions/cart.function"
import { toast } from "react-toastify"



export default function PanierPage() {
  const { cartItems } = useCart()

  const subtotal = cartItems.reduce((sum, product) => sum + ((product.price || 0) * product.quantity), 0)
  
  const tva = subtotal * 0.2 // 20% TVA
  const total = subtotal + tva
  const fixedTotal = total.toFixed(2)
  const fixedSubtotal = subtotal.toFixed(2)
  const fixedTva = tva.toFixed(2)

  const handleProcessOrder = async () => {
    console.log("Produits dans le panier :", cartItems)
    try {
    processCartItems(cartItems, total)
    toast.success(`Votre commande a été traitée avec succès ! Pour un total de ${fixedTotal}€`, {
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
    })
    } catch (error) {
      console.error("Erreur lors du traitement de la commande :", error)
      toast.error("Une erreur est survenue lors du traitement de la commande. Veuillez réessayer.")
    }
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
              { label: "Panier de commande" }
            ]} 
          />

          <h1 className="font-['Archive'] text-4xl font-bold text-green-700 mt-8 mb-12">
            MON PANIER
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Liste des produits */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((product) => (
                <ProductSummary
                  key={product.id}
                  id={product.id}
                  title={product.title || ''}
                  description={product.description || ''}
                  price={product.price || 0}
                  quantity={product.quantity}
                  imageUrl={product.imageUrl || ''}
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
                    <span>{fixedSubtotal}€</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>TVA</span>
                    <span>{fixedTva}€</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t">
                    <span>Total</span>
                    <span>{fixedTotal}€</span>
                  </div>
                </div>
                <Button className="w-full mt-6" onClick={handleProcessOrder}>
                  Procéder à l'achat
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