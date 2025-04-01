'use client'

import HeaderWithScroll from "@/components/HeaderWithScroll"
import { Suspense } from "react"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import ProductCheckout from "@/components/ProductCheckout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data pour les produits
const products = [
  {
    id: 1,
    title: "Arbre violet",
    description: "Description du produit horizontally within a fixed viewport area.du produit horizontally within a ...",
    price: 169,
    quantity: 1,
    imageUrl: "/trees/erable.jpg"
  },
  {
    id: 2,
    title: "Arbre violet",
    description: "Description du produit horizontally within a fixed viewport area.du produit horizontally within a ...",
    price: 169,
    quantity: 1,
    imageUrl: "/trees/olivier.jpg"
  },
  {
    id: 3,
    title: "Arbre violet",
    description: "Description du produit horizontally within a fixed viewport area.du produit horizontally within a ...",
    price: 169,
    quantity: 1,
    imageUrl: "/trees/sapin.jpg"
  }
]

export default function CheckoutPage() {
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
              { label: "Panier", href: "/panier" },
              { label: "Enregistrement" }
            ]} 
          />

          <h1 className="font-['Archive'] text-4xl font-bold text-green-700 mt-8 mb-12">
            ENREGISTREMENT
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Formulaire */}
            <div>
              <div className="space-y-6">
                <div className="bg-white border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-6">Adresse</h2>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom*</Label>
                      <Input id="firstName" placeholder="Entrez votre prénom" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom*</Label>
                      <Input id="lastName" placeholder="Entrez votre nom" />
                    </div>
                  </div>
                  {/*TODO pour le tel a voir si on peut utiliser une libriairie qui met en forme les num de tél avec jolis petits drapeaux SO CUTE comme  intl-tel-input*/}
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="phone">Téléphone*</Label>
                    <div className="flex gap-2">
                      <Select defaultValue="+33">
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="+33" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+33">+33</SelectItem>
                          <SelectItem value="+32">+32</SelectItem>
                          <SelectItem value="+41">+41</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input placeholder="7 00 00 00 00" />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="address">Adresse*</Label>
                    <Input id="address" placeholder="Entrez votre adresse" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">Pays*</Label>
                      <Select defaultValue="france">
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un pays" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="france">France</SelectItem>
                          <SelectItem value="belgique">Belgique</SelectItem>
                          <SelectItem value="suisse">Suisse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville*</Label>
                      <Input id="city" placeholder="Entrez votre ville" />
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-2">
                    <Checkbox id="saveAddress" />
                    <label
                      htmlFor="saveAddress"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sauvegarder l'adresse
                    </label>
                  </div>
                </div>

                <div className="bg-white border rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-6">Adresse de livraison</h2>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="sameAddress" defaultChecked />
                      <label
                        htmlFor="sameAddress"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Délivrer à la même adresse
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="otherAddress" />
                      <label
                        htmlFor="otherAddress"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Autre adresse
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Récapitulatif */}
            <div>
              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Résumé de la commande</h2>
                
                <div className="divide-y">
                  {products.map((product) => (
                    <ProductCheckout
                      key={product.id}
                      title={product.title}
                      description={product.description}
                      price={product.price}
                      quantity={product.quantity}
                      imageUrl={product.imageUrl}
                    />
                  ))}
                </div>

                <div className="mt-6 space-y-4">
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
                  Procéder au paiement
                </Button>
                <a 
                  href="/panier" 
                  className="block text-center text-green-600 hover:text-green-700 mt-4 text-sm"
                >
                  Retour vers le panier →
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 