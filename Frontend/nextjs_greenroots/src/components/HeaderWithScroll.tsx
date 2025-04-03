"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import AuthModals from "./AuthModals";
import { useCart } from "@/context/CartContext";

export default function HeaderWithScroll() {
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isErrorPage = pathname === "/500";
  const shouldBeTransparent = isHomePage || isErrorPage;

  // S'assurer que le composant est monté côté client avant d'ajouter des écouteurs d'événements
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Vérifier l'état initial du scroll
    if (typeof window !== "undefined") {
      handleScroll();
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const isTransparent = mounted && shouldBeTransparent && !scrolled;
  const headerClasses = `fixed top-0 z-50 w-full transition-colors duration-300 ${
    isTransparent ? "bg-transparent" : "bg-white shadow-md"
  }`;

  // Logo qui change en fonction du défilement
  const logoSrc = isTransparent ? "/logo11.png" : "/logo12.png";

  return (
    <header className={headerClasses}>
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          prefetch={false}
          className="relative h-10 md:h-14 w-auto flex items-center shrink-0"
        >
          <img
            src={logoSrc}
            alt="Logo"
            className="h-10 md:h-14 w-auto transition-all duration-300"
          />
        </Link>

        {/* Barre de recherche - visible sur tous les écrans */}
        <div className="flex-1 mx-2 md:mx-4 max-w-xs md:max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Rechercher..."
              className={`w-full py-1 md:py-2 pl-8 md:pl-10 pr-2 md:pr-4 rounded-full border text-sm md:text-base ${
                isTransparent
                  ? "border-white/30 bg-white/10 text-white placeholder-white/70"
                  : "border-gray-300 text-gray-700 placeholder-gray-500"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            <Search
              className={`absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 ${
                isTransparent ? "text-white/70" : "text-gray-500"
              }`}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-1 md:space-x-6 shrink-0">
          {/* Version desktop des liens */}
          <div
            className={`hidden md:block ${
              isTransparent ? "text-white" : "text-primary-500"
            }`}
          >
            <AuthModals />
          </div>
          <div className="flex items-center space-x-1">
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
          <div className="text-white bg-green-400 w-6 h-6 rounded-full text-center">{cartItems.length}</div>
          </div>

          {/* Version mobile des liens (icônes) */}
          <Link
            href="#"
            className={`md:hidden p-2 rounded-full ${
              isTransparent
                ? "text-white hover:bg-white/10"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            prefetch={false}
          >
            <User className="h-5 w-5" />
          </Link>
          <Link
            href="/panier"
            className={`md:hidden p-2 rounded-full ${
              isTransparent
                ? "text-white hover:bg-white/10"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            prefetch={false}
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
