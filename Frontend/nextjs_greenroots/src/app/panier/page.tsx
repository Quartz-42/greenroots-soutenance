'use client'

import HeaderWithScroll from "@/components/header/HeaderWithScroll"
import { Suspense, useEffect, useState } from "react"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import BestSellers from "@/components/BestSellers";
import { useCart } from "@/context/CartContext"
import { toast } from "react-toastify"
import LoginModal from "@/components/modals/LoginModal"
import SignupModal from "@/components/modals/SignupModal"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { handleProcessOrder } from "@/utils/functions/panier.function"
import type { User as UserInterface } from "@/utils/interfaces/users.interface";
import ProductList from "@/components/panier/ProductList";
import Recapitulatif from "@/components/panier/Recapitulatif";


export default function PanierPage() {
  const { cartItems } = useCart()
  const { user: authUser, isLoading } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [hasValidCart, setHasValidCart] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const validCartItems = cartItems.every(item => 
      item && 
      typeof item.id === 'number' && 
      typeof item.quantity === 'number' && 
      item.quantity > 0 && 
      typeof item.price === 'number' && 
      item.price >= 0
    );
    
    setHasValidCart(validCartItems);
    
    if (!validCartItems && cartItems.length > 0) {
      toast.error("Certains articles de votre panier sont invalides");
    }
  }, [cartItems]);

  const handleLoginSuccess = () => {
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

  const isCartEmpty = cartItems.length === 0;

  const subtotal = cartItems.reduce((sum, product) => {
    const price = product.price || 0;
    const quantity = Math.max(1, product.quantity);
    return sum + (price * quantity);
  }, 0);
  
  const tva = Math.max(0, subtotal * 0.2);
  const total = subtotal + tva;
  const fixedTotal = total.toFixed(2)
  const fixedSubtotal = subtotal.toFixed(2)
  const fixedTva = tva.toFixed(2)

  const handleCheckoutClick = () => {
    if (!hasValidCart) {
      toast.error("Impossible de procéder avec un panier invalide");
      return;
    }
    
    if (!authUser) {
      setIsLoginModalOpen(true);
    } else if (!isCartEmpty) {
      let userForOrder: UserInterface | null = null;
      if (authUser && authUser.id && authUser.name && authUser.email) {
        const parsedId = parseInt(authUser.id as string, 10);
        if (!isNaN(parsedId)) {
          userForOrder = {
            id: parsedId,
            name: authUser.name,
            email: authUser.email,
            image: authUser.image || undefined,
            password: 'N/A',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
        } else {
          toast.error("Erreur avec les données utilisateur (ID invalide).");
          return;
        }
      } else {
        toast.error("Données utilisateur incomplètes pour procéder à l\'achat.");
        setIsLoginModalOpen(true);
        return;
      }

      if (userForOrder) {
        handleProcessOrder({user: userForOrder, isCartEmpty, hasValidCart, setIsLoginModalOpen, router});
      } else {
        console.log("Erreur avec les données utilisateur (ID invalide).");
      }
    } else {
      toast.info("Votre panier est vide");
    }
  };


  if (isLoading) {
     return (
      <div className="relative min-h-screen flex items-center justify-center">
        <Suspense fallback={<div className="h-16"></div>}>
          <HeaderWithScroll />
        </Suspense>
        <div>Chargement...</div> 
        <Footer />
      </div>
     ) 
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
            <ProductList cartItems={cartItems} isCartEmpty={isCartEmpty} />

            {/* Récapitulatif */}
            <Recapitulatif 
              fixedSubtotal={fixedSubtotal}
              fixedTva={fixedTva}
              fixedTotal={fixedTotal}
              isCartEmpty={isCartEmpty}
              authUser={authUser}
              handleCheckoutClick={handleCheckoutClick}
            />
          </div>
        </div>
        <BestSellers/>
      </main>

      <Footer />
    </div>
  )
} 