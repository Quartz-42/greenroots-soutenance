"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import AuthModals from "./AuthModals";
import { useCart } from "@/context/CartContext";
import { useFetch } from "@/hooks/useFetch";
import { Product } from "@/utils/interfaces/products.interface";
export default function HeaderWithScroll() {
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isErrorPage = pathname === "/500";
  const shouldBeTransparent = isHomePage || isErrorPage;

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    if (typeof window !== "undefined") {
      handleScroll();
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 350);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const endpoint = debouncedSearchQuery
      ? `products?searchQuery=${encodeURIComponent(debouncedSearchQuery)}`
      : null;

  const { data: productsData, loading: searchLoading, error: searchError } = useFetch<Product[]>(endpoint || "", { method: "GET" });

  useEffect(() => {
    if (productsData) {
      setSearchedProducts(productsData);
    } else {
      setSearchedProducts([]);
    }
  }, [productsData]);

  const isTransparent = mounted && shouldBeTransparent && !scrolled;
  const headerClasses = `fixed top-0 z-50 w-full transition-colors duration-300 ${
      isTransparent ? "bg-transparent" : "bg-white shadow-md"
  }`;

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
          <div ref={searchContainerRef} className="flex-1 mx-2 md:mx-4 max-w-xs md:max-w-md relative">
            <div className="relative w-full">
              <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
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
            {isSearchFocused && debouncedSearchQuery && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
                  {searchedProducts.length > 0 && (
                    <ul>
                      {searchedProducts.slice(0, 10).map((product) => (
                          <li key={product.id} className="border-b last:border-b-0">
                            <Link
                                href={`/liste/product/${product.id}`}
                                className="flex items-center p-2 hover:bg-gray-100"
                                onClick={() => {
                                  setSearchQuery("");
                                  setIsSearchFocused(false);
                                }}
                                prefetch={false}
                            >
                              <Image
                                  src={product.Image && product.Image.length > 0 ? product.Image[0].url : '/placeholder-image.png'}
                                  alt={product.name}
                                  width={40}
                                  height={40}
                                  className="object-cover rounded mr-3"
                              />
                              <span className="text-sm text-gray-800">{product.name}</span>
                            </Link>
                          </li>
                      ))}
                    </ul>
                  )}
                  {(searchLoading) && <div className="p-2 text-sm text-gray-500">Chargement...</div>}
                  {(!searchLoading && !searchError && searchedProducts.length == 0) && <div className="p-2 text-sm text-gray-500">Aucun produit trouvé.</div>}
                  {(searchError) && <div className="p-2 text-sm text-red-500">Erreur de chargement.</div>}
                </div>
            )}
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
              <div className="text-white bg-primary-500 w-6 h-6 rounded-full text-center">{cartItems.length}</div>
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
