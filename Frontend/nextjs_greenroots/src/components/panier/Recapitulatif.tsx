'use client'

import { Button } from "@/components/ui/button"
// import type { User } from "@/utils/interfaces/users.interface"; // On n'utilise plus ce type ici

// Définition du type User attendu par ce composant, aligné avec useAuth
interface AuthUser {
  name?: string;
  id?: string;
  email?: string;
  image?: string;
  [key: string]: any;
}

interface RecapitulatifProps {
  fixedSubtotal: string;
  fixedTva: string;
  fixedTotal: string;
  isCartEmpty: boolean;
  authUser: AuthUser | null | undefined;
  handleCheckoutClick: () => void;
}

export default function Recapitulatif({
  fixedSubtotal,
  fixedTva,
  fixedTotal,
  isCartEmpty,
  authUser,
  handleCheckoutClick,
}: RecapitulatifProps) {
  return (
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
            {authUser ? "Procéder à l'achat" : "Se connecter pour acheter"}
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
  );
}
