"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import AuthModals from "../modals/AuthModals";
import { useCart } from "@/context/CartContext";

interface NavigationIconsProps {
  isTransparent: boolean;
}

export default function NavigationIcons({ isTransparent }: NavigationIconsProps) {
  const { cartItems } = useCart();

  return (
    <nav className="flex items-center space-x-1 md:space-x-6 shrink-0">
      {/* Icône utilisateur (desktop et mobile) */}
      <div className={isTransparent ? "text-white" : "text-primary-500"}>
        <AuthModals />
      </div>

      {/* Panier avec notification (desktop et mobile) */}
      <div className="flex items-center space-x-1">
        {/* Version desktop du lien panier */}
        <Link
          href="/panier"
          className={`hidden md:inline-block text-sm font-medium ${
            isTransparent
              ? "text-white hover:text-gray-200"
              : "text-primary-500 hover:text-green-800"
          }`}
          prefetch={false}
        >
          Panier
        </Link>

        {/* Version mobile du lien panier */}
        <Link
          href="/panier"
          className={`md:hidden p-2 rounded-full relative ${
            isTransparent
              ? "text-white hover:bg-white/10"
              : "text-gray-700 hover:bg-gray-100"
          }`}
          prefetch={false}
        >
          <ShoppingCart className="h-5 w-5" />
          {cartItems.length > 0 && (
            <div className="absolute -top-1 -right-1 text-white bg-primary-500 w-5 h-5 rounded-full text-center text-xs flex items-center justify-center">
              {cartItems.length}
            </div>
          )}
        </Link>

        {/* Notification de panier (version desktop) */}
        {cartItems.length > 0 && (
          <div className="hidden md:flex text-white bg-primary-500 w-6 h-6 rounded-full text-center items-center justify-center">
            {cartItems.length}
          </div>
        )}
      </div>
    </nav>
  );
} 