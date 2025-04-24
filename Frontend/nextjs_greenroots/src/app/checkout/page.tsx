'use client'

import HeaderWithScroll from "@/components/HeaderWithScroll"
import { Suspense, useEffect, useState } from "react"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import ProductCheckout from "@/components/ProductCheckout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { useCart } from "@/context/CartContext"
import { User } from "@/utils/interfaces/users.interface"


export default function CheckoutPage() {

  const { cartItems, clearCart } = useCart();
  const [ user, setUser ] = useState<User | null>(null)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [purchaseId, setPurchaseId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (purchaseId) {
      console.log(purchaseId);
    }
  }, [purchaseId]);

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setZipCode(e.target.value);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const subtotal = cartItems.reduce((sum, product) => sum + ((product.price || 0) * product.quantity), 0)
  const roundedSubtotal = Math.round(subtotal * 100) / 100
  const tva = subtotal * 0.2 // 20% TVA
  const roundedTva = Math.round(tva * 100) / 100
  const total = subtotal + tva
  const roundedTotal = Math.round(total * 100) / 100

  const data = {
    purchase: {
      user_id: user?.id,
      address: address,
      postalcode: zipCode,
      city: city,
      total: roundedTotal,
      status: "En cours",
      date: new Date(),
      payment_method: "carte bancaire",
    },
    purchase_products: cartItems.map((product) => ({
      product_id: product.id,
      quantity: product.quantity,
    })),
  }
  
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
      
    try {
      const response = await fetch('http://localhost:3000/purchases', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande');
      }

      const result = await response.json();
      setPurchaseId(result.id);
      router.push(`/recapitulatif/${result.id}`);
      clearCart();
    } catch (error) {
      console.error('Erreur lors de la création de la commande:', error);
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
                      <Input id="firstName" placeholder="Entrez votre prénom" value={firstName} onChange={handleFirstNameChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom*</Label>
                      <Input id="lastName" placeholder="Entrez votre nom" value={lastName} onChange={handleLastNameChange} />
                    </div>
                  </div>
                  {/* TODO pour le tel a voir si on peut utiliser une libriairie qui met en forme les num de tél avec jolis petits drapeaux SO CUTE comme  intl-tel-input
                  <div className="space-y-2 mb-4">
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
                  </div> */}

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="address">Adresse*</Label>
                    <Input id="address" placeholder="Entrez votre adresse" value={address} onChange={handleAddressChange} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* <div className="space-y-2">
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
                    </div> */}
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville*</Label>
                      <Input id="city" placeholder="Entrez votre ville" value={city} onChange={handleCityChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Code postal*</Label>
                      <Input id="zipCode" placeholder="Entrez votre code postal" value={zipCode} onChange={handleZipCodeChange} />
                    </div>
                  </div>

                  {/* <div className="mt-4 flex items-center space-x-2">
                    <Checkbox id="saveAddress" />
                    <label
                      htmlFor="saveAddress"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Sauvegarder l'adresse
                    </label>
                  </div> */}
                </div>

                {/* <div className="bg-white border rounded-lg p-6">
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
                </div> */}
              </div>
            </div>

            {/* Récapitulatif */}
            <div>
              <div className="bg-white border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Résumé de la commande</h2>
                
                <div className="divide-y">
                  {cartItems.map((product) => (
                    <ProductCheckout
                      key={product.id}
                      title={product.title ?? 'Produit sans titre'}
                      description={product.description ?? ''}
                      price={product.price ?? 0}
                      quantity={product.quantity}
                      imageUrl={product.imageUrl ?? '/placeholder.png'}
                    />
                  ))}
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>{roundedSubtotal}€</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>TVA</span>
                    <span>{roundedTva}€</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-4 border-t">
                    <span>Total</span>
                    <span>{roundedTotal}€</span>
                  </div>
                </div>

                <Button className="w-full mt-6" onClick={handleSubmit}>
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