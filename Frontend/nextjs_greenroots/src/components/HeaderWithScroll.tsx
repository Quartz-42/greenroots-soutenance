"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, User, ShoppingCart } from "lucide-react";
import { usePathname } from "next/navigation";
import AuthModals from "./AuthModals";
import { useCart } from "@/context/CartContext";
import { useFetch } from "@/hooks/useFetch";
import { Product } from "@/utils/interfaces/products.interface";
import DOMPurify from 'dompurify';

export default function HeaderWithScroll() {
  const { cartItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [searchedProducts, setSearchedProducts] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchStatus, setSearchStatus] = useState<{
    tooShort: boolean;
    invalid: boolean;
    tooManyAttempts: boolean;
  }>({
    tooShort: false,
    invalid: false,
    tooManyAttempts: false
  });
  
  const searchAttemptsRef = useRef(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isErrorPage = pathname === "/500";
  const shouldBeTransparent = isHomePage || isErrorPage;

  // Constantes pour la validation
  const MAX_SEARCH_LENGTH = 50;
  const MIN_SEARCH_LENGTH = 2;
  const MAX_SEARCH_ATTEMPTS = 15; // Limite raisonnable pour éviter les abus
  const SEARCH_COOLDOWN = 350; // ms entre les requêtes

  // Validation améliorée du texte de recherche
  const validateSearchQuery = useCallback((query: string): boolean => {
    const currentQuery = query.trim(); // Trim once
    let newTooShort = false;
    let newInvalid = false;
    let isValid = true;

    // Vérifier les caractères non autorisés en premier
    const disallowedPattern = /[<>{}[\]\\^~|]/;
    if (disallowedPattern.test(query)) { // Tester la requête originale pour les caractères
      newInvalid = true;
      isValid = false;
    } else if (query.length > 0 && currentQuery.length < MIN_SEARCH_LENGTH) {
      // Uniquement "trop court" si pas invalide et que la requête a du contenu mais est trop courte après trim
      newTooShort = true;
      isValid = false;
    }
    
    // Si la requête est effectivement vide après trim et n'a pas de caractères invalides
    if (currentQuery.length === 0 && !newInvalid) {
        newTooShort = false; // Pas "trop court" pour l'affichage
        isValid = false;     // Mais pas valide pour lancer une recherche
    }

    setSearchStatus(prev => {
      // Mettre à jour uniquement si les indicateurs d'état pertinents changent réellement
      if (prev.tooShort !== newTooShort || prev.invalid !== newInvalid) {
        return { ...prev, tooShort: newTooShort, invalid: newInvalid };
      }
      return prev; // Aucun changement pour ces indicateurs, retourner l'objet d'état actuel
    });
    
    return isValid;
  }, [MIN_SEARCH_LENGTH]);

  // Nettoyage de l'entrée utilisateur
  const sanitizeSearchInput = useCallback((input: string): string => {
    // Limite la longueur
    const trimmed = input.slice(0, MAX_SEARCH_LENGTH);
    
    // Nettoyer avec DOMPurify
    return DOMPurify.sanitize(trimmed);
  }, []);

  // Gestion du changement de l'input de recherche
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    
    // Vérifier si la longueur maximale est dépassée
    if (rawValue.length > MAX_SEARCH_LENGTH) {
      const sanitized = sanitizeSearchInput(rawValue);
      setSearchQuery(sanitized);
      return;
    }
    
    setSearchQuery(rawValue);
  }, [sanitizeSearchInput]);
  
  // Gestion de la recherche avec debounce
  useEffect(() => {
    // Nettoyer le timer précédent
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Vérifier si trop de tentatives
    if (searchAttemptsRef.current >= MAX_SEARCH_ATTEMPTS) {
      setSearchStatus(prev => {
        if (!prev.tooManyAttempts || prev.invalid || prev.tooShort) { // Mettre à jour si pas déjà défini, ou pour effacer les autres indicateurs
          return { ...prev, tooManyAttempts: true, invalid: false, tooShort: false };
        }
        return prev;
      });
      return;
    }
    
    const queryIsValidForDebounce = validateSearchQuery(searchQuery); // Gère ses propres mises à jour de searchStatus intelligemment
    
    // Si la recherche est valide, définir un nouveau timer
    if (queryIsValidForDebounce) {
      debounceTimerRef.current = setTimeout(() => {
        // Sanitiser avant d'envoyer la requête
        const sanitized = sanitizeSearchInput(searchQuery);
        setDebouncedSearchQuery(sanitized);
        searchAttemptsRef.current += 1;
        
        // Démarrer le timer de réinitialisation s'il n'est pas déjà en cours
        if (!resetTimerRef.current) {
          resetTimerRef.current = setTimeout(() => {
            searchAttemptsRef.current = 0;
            setSearchStatus(prev => { // Mettre à jour conditionnellement
              if (prev.tooManyAttempts) {
                return { ...prev, tooManyAttempts: false };
              }
              return prev;
            });
            resetTimerRef.current = null;
          }, 60000); // Réinitialiser après 1 minute
        }
      }, SEARCH_COOLDOWN);
    } else {
      // Si la requête n'est pas valide pour le debounce (trop courte, invalide, ou vide après trim)
      // s'assurer qu'aucune recherche n'est en attente en vidant debouncedSearchQuery.
      if (debouncedSearchQuery !== "") { // Mettre à jour seulement si nécessaire
        setDebouncedSearchQuery("");
      }
    }
    
    // Nettoyage
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, sanitizeSearchInput, validateSearchQuery, debouncedSearchQuery, MAX_SEARCH_ATTEMPTS, SEARCH_COOLDOWN]);
  
  // Nettoyage des timers à la déconnexion
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (resetTimerRef.current) {
        clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  // Effet pour le défilement et l'initialisation
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

  // Détection des clics en dehors du conteneur de recherche
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

  // Sécurisation de l'URL de recherche
  const endpoint = debouncedSearchQuery
      ? `products?searchQuery=${encodeURIComponent(debouncedSearchQuery.trim())}`
      : "";

  // Ne faire la requête que si nous avons un endpoint valide avec une requête non vide
  const { data: productsData, loading: searchLoading, error: searchError } = useFetch<any>(
    debouncedSearchQuery ? endpoint : "", 
    { method: "GET" }
  );

  // Traitement des données de recherche
  useEffect(() => {
    if (productsData && debouncedSearchQuery) {
      try {
        // Validation des données reçues
        const products = productsData.data || productsData;
        
        if (!Array.isArray(products)) {
          console.error("Format de données invalide:", products);
          setSearchedProducts([]);
          return;
        }
        
        // Validation de chaque produit
        const validProducts = products.filter(product => 
          product && 
          typeof product.id === 'number' && 
          typeof product.name === 'string'
        );
        
        setSearchedProducts(validProducts);
      } catch (error) {
        console.error("Erreur lors du traitement des données de recherche:", error);
        setSearchedProducts([]);
      }
    } else if (!debouncedSearchQuery) {
      setSearchedProducts([]);
    }
  }, [productsData, debouncedSearchQuery]);

  const isTransparent = mounted && shouldBeTransparent && !scrolled;
  const headerClasses = `fixed top-0 z-50 w-full transition-colors duration-300 ${
      isTransparent ? "bg-transparent" : "bg-white shadow-md"
  }`;

  const logoSrc = isTransparent ? "/logo11.png" : "/logo12.png";
  
  // Fonction pour sécuriser les URLs d'images
  const getSecureImageUrl = (product: Product): string => {
    if (!product.Image || !Array.isArray(product.Image) || product.Image.length === 0) {
      return '/placeholder-image.png';
    }
    
    const image = product.Image[0];
    if (!image || typeof image.url !== 'string' || !image.url.trim()) {
      return '/placeholder-image.png';
    }
    
    return image.url;
  };
  
  // Ajout de la variable de validation mémoïsée pour l'affichage
  const isDebouncedQueryValid = useMemo(() => {
    const currentQuery = debouncedSearchQuery.trim();
    if (!debouncedSearchQuery) return false;
    if (currentQuery.length < MIN_SEARCH_LENGTH) return false;
    const disallowedPattern = /[<>{}[\\]\\^~|]/;
    if (disallowedPattern.test(debouncedSearchQuery)) return false;
    return true;
  }, [debouncedSearchQuery, MIN_SEARCH_LENGTH]);

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
                  ref={searchInputRef}
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  maxLength={MAX_SEARCH_LENGTH}
                  disabled={searchStatus.tooManyAttempts}
                  aria-invalid={searchStatus.invalid}
                  className={`w-full py-1 md:py-2 pl-8 md:pl-10 pr-2 md:pr-4 rounded-full border text-sm md:text-base ${
                      isTransparent
                          ? "border-white/30 bg-white/10 text-white placeholder-white/70"
                          : "border-gray-300 text-gray-700 placeholder-gray-500"
                  } focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    searchStatus.invalid ? "border-red-500" : ""
                  }`}
              />
              <Search
                  className={`absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 ${
                      isTransparent ? "text-white/70" : "text-gray-500"
                  }`}
              />
            </div>
            {/* Message d'erreur pour recherche trop courte */}
            {isSearchFocused && searchStatus.tooShort && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
                <p className="text-sm text-orange-500">Veuillez saisir au moins {MIN_SEARCH_LENGTH} caractères</p>
              </div>
            )}
            {/* Message d'erreur pour recherche invalide */}
            {isSearchFocused && searchStatus.invalid && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
                <p className="text-sm text-red-500">Caractères non autorisés détectés</p>
              </div>
            )}
            {/* Message d'erreur pour trop de tentatives */}
            {isSearchFocused && searchStatus.tooManyAttempts && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
                <p className="text-sm text-red-500">Trop de recherches. Veuillez patienter un moment.</p>
              </div>
            )}
            {/* Résultats de recherche */}
            {isSearchFocused && isDebouncedQueryValid && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
                  {searchedProducts && searchedProducts.length > 0 ? (
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
                                  src={getSecureImageUrl(product)}
                                  alt={product.name || 'Produit'}
                                  width={40}
                                  height={40}
                                  className="object-cover rounded mr-3"
                              />
                              <span className="text-sm text-gray-800">{product.name}</span>
                            </Link>
                          </li>
                      ))}
                    </ul>
                  ) : (
                    <>
                      {searchLoading && <div className="p-2 text-sm text-gray-500">Chargement...</div>}
                      {!searchLoading && !searchError && <div className="p-2 text-sm text-gray-500">Aucun produit trouvé.</div>}
                      {searchError && <div className="p-2 text-sm text-red-500">Erreur de chargement: {searchError.message}</div>}
                    </>
                  )}
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
