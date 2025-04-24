'use client'

import HeaderWithScroll from "@/components/HeaderWithScroll"
import { Suspense, useEffect, useState } from "react"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import ProductSummary from "@/components/ProductSummary"
import { Button } from "@/components/ui/button"
import BestSellers from "@/components/BestSellers";
import { useCart } from "@/context/CartContext"
import {processCartItems} from "@/utils/functions/cart.function"
import { toast } from "react-toastify"
import { User } from "@/utils/interfaces/users.interface"
import LoginModal from "@/components/LoginModal"
import SignupModal from "@/components/SignupModal"
import { useRouter } from "next/navigation"


export default function PanierPage() {
  const { cartItems, clearCart } = useCart()
  const [user, setUser] = useState<User | null>(null)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  //! ------------------- const [isCartEmpty, setIsCartEmpty] = useState(false); 

  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error);
      setUser(null);
    }
  }, []);

  const handleLoginSuccess = () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour des données utilisateur après connexion:", error);
      setUser(null);
    }
    setIsLoginModalOpen(false);
  };

  const handleSwitchToSignup = () => {
    setIsLoginModalOpen(false);
    setTimeout(() => setIsSignupModalOpen(true), 100);
  };

  const handleSwitchToLogin = () => {
    setIsSignupModalOpen(false);
    setTimeout(() => setIsLoginModalOpen(true), 100);
  };

  const handleSignupSuccess = () => {
    setIsSignupModalOpen(false);
    toast.success("Inscription réussie ! Vous pouvez maintenant vous connecter.");
  };

  const isCartEmpty = cartItems.length === 0;

  const subtotal = cartItems.reduce((sum, product) => sum + ((product.price || 0) * product.quantity), 0)
  
  const tva = subtotal * 0.2 // 20% TVA
  const total = subtotal + tva
  const fixedTotal = total.toFixed(2)
  const fixedSubtotal = subtotal.toFixed(2)
  const fixedTva = tva.toFixed(2)

  const handleCheckoutClick = () => {
    if (!user) {
      setIsLoginModalOpen(true);
    } else if (!isCartEmpty) {
      handleProcessOrder();
    }
  };

  const handleProcessOrder = async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    console.log("Produits dans le panier pour la commande :", cartItems)
    router.push("/checkout");
  }

  return (
    <div className="relative min-h-screen">
      <Suspense fallback={<div className="h-16"></div>}>
        <HeaderWithScroll />
      </Suspense>
      <LoginModal 
        open={isLoginModalOpen} 
        onOpenChange={setIsLoginModalOpen}
        onLoginSuccess={handleLoginSuccess}
        onSwitchToSignup={handleSwitchToSignup}
      />
      <SignupModal
        open={isSignupModalOpen}
        onOpenChange={setIsSignupModalOpen}
        onSwitchToLogin={handleSwitchToLogin}
      />

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
              {isCartEmpty ? (
                 <p className="text-gray-600">Vous n'avez aucun article dans votre panier.</p>
              ) : (
                cartItems.map((product) => (
                  <ProductSummary
                    key={product.id}
                    id={product.id}
                    title={product.title || ''}
                    description={product.description || ''}
                    price={product.price || 0}
                    quantity={product.quantity}
                    imageUrl={product.imageUrl || ''}
                  />
                ))
              )}
            </div>

            {/* Récapitulatif */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-lg border">
                <h2 className="text-xl font-semibold mb-6">Récapitulatif</h2>
                {!isCartEmpty ? (
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Sous-total</span>
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
                ) : (
                  <div className="text-center text-gray-500 my-6">Votre panier est vide.</div>
                )}
                
                {isCartEmpty ? (
                  <div className="text-center text-gray-500 mt-6">Ajoutez des articles pour continuer.</div>
                ) : (
                  <Button 
                    className="w-full mt-6" 
                    onClick={handleCheckoutClick}
                  >
                    {user ? "Procéder à l'achat" : "Se connecter pour acheter"} 
                  </Button>
                )}
                
                <a 
                  href="/liste" 
                  className="block text-center text-primary-500 mt-4 text-sm"
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