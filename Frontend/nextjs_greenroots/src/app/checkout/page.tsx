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
import DOMPurify from 'dompurify'

// Fonction utilitaire pour nettoyer les entrées
const sanitizeInput = (input: string): string => {
  // Utilise DOMPurify pour nettoyer les chaînes et éviter XSS
  return DOMPurify.sanitize(input.trim());
};

// Validation du code postal français
const isValidZipCode = (zipCode: string): boolean => {
  return /^[0-9]{5}$/.test(zipCode);
};

// Validation du nom/prénom (lettres, espaces, tirets, apostrophes)
const isValidName = (name: string): boolean => {
  return /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name) && name.length <= 50;
};

// Validation de l'adresse
const isValidAddress = (address: string): boolean => {
  return address.trim().length >= 5 && address.length <= 120;
};

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
  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    zipCode?: string;
  }>({});
  const [formValid, setFormValid] = useState(false);

  const router = useRouter();

  const validateForm = () => {
    const newErrors: {
      firstName?: string;
      lastName?: string;
      address?: string;
      city?: string;
      zipCode?: string;
    } = {};
    
    if (!firstName) {
      newErrors.firstName = "Le prénom est requis";
    } else if (!isValidName(firstName)) {
      newErrors.firstName = "Prénom invalide";
    }
    
    if (!lastName) {
      newErrors.lastName = "Le nom est requis";
    } else if (!isValidName(lastName)) {
      newErrors.lastName = "Nom invalide";
    }
    
    if (!address) {
      newErrors.address = "L'adresse est requise";
    } else if (!isValidAddress(address)) {
      newErrors.address = "Adresse invalide (min 5, max 120 caractères)";
    }
    
    if (!city) {
      newErrors.city = "La ville est requise";
    } else if (!isValidName(city)) {
      newErrors.city = "Nom de ville invalide";
    }
    
    if (!zipCode) {
      newErrors.zipCode = "Le code postal est requis";
    } else if (!isValidZipCode(zipCode)) {
      newErrors.zipCode = "Code postal invalide (format: 12345)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation à chaque changement de champ
  useEffect(() => {
    const isValid = validateForm();
    setFormValid(isValid);
  }, [firstName, lastName, address, city, zipCode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const { id, value } = e.target;
    
    // Limite la longueur des entrées en temps réel
    const maxLengths: {[key: string]: number} = {
      "firstName": 50,
      "lastName": 50,
      "address": 120,
      "city": 50,
      "zipCode": 5
    };
    
    // Appliquer des filtres spécifiques en fonction du champ
    let sanitizedValue = value;
    
    if (id === "zipCode") {
      // Pour le code postal, n'autoriser que les chiffres
      sanitizedValue = value.replace(/[^0-9]/g, '');
    }
    
    if (sanitizedValue.length <= maxLengths[id]) {
      setter(sanitizedValue);
    }
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
  
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    // Validation finale avant soumission
    if (!validateForm()) {
      alert("Veuillez corriger les erreurs dans le formulaire avant de continuer.");
      return;
    }
    
    setLoading(true);
    
    // Vérifier si l'utilisateur est connecté
    if (!user?.id) {
      alert("Veuillez vous connecter pour passer une commande.");
      setLoading(false);
      return;
    }

    // Vérifier si le panier n'est pas vide
    if (cartItems.length === 0) {
      alert("Votre panier est vide.");
      setLoading(false);
      router.push('/');
      return;
    }

    // Nettoyer toutes les entrées avant l'envoi
    const sanitizedFirstName = sanitizeInput(firstName);
    const sanitizedLastName = sanitizeInput(lastName);
    const sanitizedAddress = sanitizeInput(address);
    const sanitizedCity = sanitizeInput(city);
    const sanitizedZipCode = sanitizeInput(zipCode);

    // Créer l'objet de données pour l'API createPurchase
    const dataForApi = {
      purchase: {
        user_id: user.id,
        address: sanitizedAddress,
        postalcode: sanitizedZipCode,
        city: sanitizedCity,
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

    try {
      // 1. Créer la commande initiale dans la base de données
      const purchaseResult = await createPurchase(dataForApi);
      console.log('Commande initiale créée:', purchaseResult);

      if (!purchaseResult || !purchaseResult.id) {
        throw new Error("La création de la commande a échoué ou l'ID est manquant.");
      }
      
      const purchaseId = purchaseResult.id;

      // Récupérer le token CSRF AVANT la deuxième requête
      const csrfToken = await getCsrfToken();

      // 2. Créer la session Stripe Checkout en appelant le backend
      const response = await fetch(`${url.current}/purchases/${purchaseId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, 
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue lors de la création de la session de paiement' }));
        throw new Error(errorData.message || 'Erreur lors de la création de la session de paiement');
      }
      
      // 3. Récupérer les données de la session Stripe
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
                      <Input 
                        id="firstName" 
                        placeholder="Entrez votre prénom" 
                        value={firstName} 
                        onChange={(e) => handleInputChange(e, setFirstName)}
                        className={errors.firstName ? "border-red-500" : ""}
                        maxLength={50}
                      />
                      {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom*</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Entrez votre nom" 
                        value={lastName} 
                        onChange={(e) => handleInputChange(e, setLastName)}
                        className={errors.lastName ? "border-red-500" : ""}
                        maxLength={50}
                      />
                      {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <Label htmlFor="address">Adresse*</Label>
                    <Input 
                      id="address" 
                      placeholder="Entrez votre adresse" 
                      value={address} 
                      onChange={(e) => handleInputChange(e, setAddress)}
                      className={errors.address ? "border-red-500" : ""}
                      maxLength={120}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ville*</Label>
                      <Input 
                        id="city" 
                        placeholder="Entrez votre ville" 
                        value={city} 
                        onChange={(e) => handleInputChange(e, setCity)}
                        className={errors.city ? "border-red-500" : ""}
                        maxLength={50}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Code postal*</Label>
                      <Input 
                        id="zipCode" 
                        placeholder="Entrez votre code postal" 
                        value={zipCode} 
                        onChange={(e) => handleInputChange(e, setZipCode)}
                        className={errors.zipCode ? "border-red-500" : ""}
                        maxLength={5}
                      />
                      {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
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
                  disabled={loading || !formValid}
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