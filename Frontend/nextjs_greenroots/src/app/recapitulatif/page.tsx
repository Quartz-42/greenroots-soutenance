'use client'

import HeaderWithScroll from "@/components/HeaderWithScroll"
import { Suspense } from "react"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import { Button } from "@/components/ui/button"

export default function RecapitulatifPage() {
  const orderNumber = "7564804"
  const orderDate = "14 Mars 2025"
  const paymentMethod = "Carte bancaire"
  const customerInfo = {
    name: "O'CLock",
    address: "10 rue de Penthièvre à Paris (75008)",
    phone: "07 00 00 00 00"
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
              { label: "Récapitulatif" }
            ]} 
          />

          <h1 className="font-['Archive'] text-4xl font-bold text-green-700 mt-8 mb-12">
            RÉCAPITULATIF
          </h1>

          <div className="bg-white border rounded-lg p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Merci pour votre commande !
            </h2>

            <p className="text-gray-600 text-center mb-12">
              Votre commande n° {orderNumber} sera traitée sous 24 heures ouvrées. Nous vous informerons par e-mail de son expédition.
            </p>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 py-4 bg-gray-50 rounded-lg px-6">
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">{orderDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Méthode de paiement</p>
                  <p className="font-medium">{paymentMethod}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 bg-gray-50 rounded-lg px-6">
                <div>
                  <p className="text-gray-600">Nom</p>
                  <p className="font-medium">{customerInfo.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Téléphone</p>
                  <p className="font-medium">{customerInfo.phone}</p>
                </div>
              </div>

              <div className="py-4 bg-gray-50 rounded-lg px-6">
                <p className="text-gray-600">Addresse</p>
                <p className="font-medium">{customerInfo.address}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-12">
              <Button
                variant="outline"
                className="min-w-[200px]"
                asChild
              >
                <a href="/">Retour à la boutique</a>
              </Button>
              <Button 
                className="min-w-[200px]"
                asChild
              >
                <a href="/suivi">Suivre ma commande</a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 