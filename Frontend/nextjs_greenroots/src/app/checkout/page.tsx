'use client'

import HeaderWithScroll from "@/components/HeaderWithScroll"
import { Suspense, useEffect, useState } from "react"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import ProductCheckout from "@/components/ProductCheckout"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import { User } from "@/utils/interfaces/users.interface"
import { url } from "@/utils/url"
import { createPurchase, getCsrfToken } from "@/utils/functions/function"


// Type pour la réponse de l'API de création de session Stripe
interface StripeCheckoutResponse {
  sessionId: string;
  url: string;
}

export default function CheckoutPage() {

  const { cartItems, clearCart } = useCart();
  const [ user, setUser ] = useState<User | null>(null)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

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

  // Données pour la création initiale de la commande
  const initialPurchaseData = {
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
    setLoading(true);
    
    // Vérifier si l'utilisateur est connecté
    if (!user?.id) {
      alert("Veuillez vous connecter pour passer une commande.");
      setLoading(false);
      // Optionnel: rediriger vers la page de connexion
      // router.push('/login'); 
      return;
    }

    // Vérifier si le panier n'est pas vide
    if (cartItems.length === 0) {
      alert("Votre panier est vide.");
      setLoading(false);
      router.push('/'); // Rediriger vers la boutique par exemple
      return;
    }

    // Vérifier les champs obligatoires
    if (!firstName || !lastName || !address || !city || !zipCode) {
      alert("Veuillez remplir tous les champs d'adresse obligatoires.");
      setLoading(false);
      return;
    }

    // Créer l'objet de données pour l'API createPurchase
    const dataForApi = {
      purchase: {
        user_id: user.id, // Utiliser l'ID utilisateur vérifié
        address: address,
        postalcode: zipCode,
        city: city,
        total: roundedTotal,
        status: "En cours", // Statut initial
        date: new Date(), // La date est générée ici
        payment_method: "carte bancaire", // Ou autre méthode si choisie
      },
      purchase_products: cartItems.map((product) => ({
        product_id: product.id,
        quantity: product.quantity,
      })),
    }

    try {
      // 1. Créer la commande initiale dans la base de données
      const purchaseResult = await createPurchase(dataForApi);
      console.log('Commande initiale créée:', purchaseResult);

      if (!purchaseResult || !purchaseResult.id) {
        throw new Error("La création de la commande a échoué ou l'ID est manquant.");
      }
      
      const purchaseId = purchaseResult.id;

      // ***** AJOUT : Récupérer le token CSRF AVANT la deuxième requête *****
      const csrfToken = await getCsrfToken();

      // 2. Créer la session Stripe Checkout en appelant le backend
      const response = await fetch(`${url.current}/purchases/${purchaseId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ***** AJOUT : Inclure l'en-tête X-CSRF-Token *****
          'X-CSRF-Token': csrfToken, 
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue lors de la création de la session de paiement' }));
        throw new Error(errorData.message || 'Erreur lors de la création de la session de paiement');
      }
      
      // 3. Récupérer les données de la session Stripe (sessionId et url)
      const responseData = await response.json() as StripeCheckoutResponse;
      console.log("Réponse de l'API pour la session Stripe:", responseData);
      
      const { sessionId, url: checkoutUrl } = responseData;
      
      if (!sessionId || !checkoutUrl) {
        throw new Error('ID de session Stripe ou URL de paiement invalide ou manquant');
      }
      
      // 4. Rediriger l'utilisateur vers l'URL de paiement Stripe
      router.push(checkoutUrl);

    } catch (error) {
      console.error('Erreur lors du processus de paiement:', error);
      setLoading(false);
      
      if (error instanceof Error) {
        alert(`Erreur: ${error.message}`);
      } else {
        // Correction de la chaîne de caractères pour l'alerte
        alert('Une erreur inattendue s\'est produite lors du processus de paiement.'); 
      }
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

                <Button 
                  className="w-full mt-6" 
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Chargement...' : 'Procéder au paiement'}
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