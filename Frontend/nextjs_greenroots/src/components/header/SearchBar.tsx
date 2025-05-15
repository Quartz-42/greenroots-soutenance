"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import { useFetch } from "@/hooks/useFetch";
import { Product } from "@/utils/interfaces/products.interface";
import {
  validateSearchQuery,
  sanitizeSearchInput,
  getSecureImageUrl,
} from "@/utils/functions/function";

interface SearchBarProps {
  isTransparent: boolean;
}

export default function SearchBar({ isTransparent }: SearchBarProps) {
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
    tooManyAttempts: false,
  });

  const searchAttemptsRef = useRef(0);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const resetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Constantes pour la validation
  const MAX_SEARCH_LENGTH = 50;
  const MIN_SEARCH_LENGTH = 2;
  const MAX_SEARCH_ATTEMPTS = 15;
  const SEARCH_COOLDOWN = 350; // ms

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      let valueToSet = rawValue;
      if (rawValue.length > MAX_SEARCH_LENGTH) {
        valueToSet = sanitizeSearchInput(rawValue, MAX_SEARCH_LENGTH);
      }
      setSearchQuery(valueToSet);

      const validation = validateSearchQuery(valueToSet, MIN_SEARCH_LENGTH);
      setSearchStatus(prev => ({
        ...prev,
        tooShort: validation.tooShort,
        invalid: validation.invalid,
      }));
    },
    [MIN_SEARCH_LENGTH, MAX_SEARCH_LENGTH]
  );

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchAttemptsRef.current >= MAX_SEARCH_ATTEMPTS) {
      setSearchStatus((prev) => {
        if (!prev.tooManyAttempts || prev.invalid || prev.tooShort) {
          return {
            ...prev,
            tooManyAttempts: true,
            invalid: false,
            tooShort: false,
          };
        }
        return prev;
      });
      return;
    }

    const validationResult = validateSearchQuery(searchQuery, MIN_SEARCH_LENGTH);
    setSearchStatus(prev => ({
      ...prev,
      tooShort: validationResult.tooShort,
      invalid: validationResult.invalid,
    }));

    if (validationResult.isValid) {
      debounceTimerRef.current = setTimeout(() => {
        const sanitized = sanitizeSearchInput(searchQuery, MAX_SEARCH_LENGTH);
        setDebouncedSearchQuery(sanitized);
        searchAttemptsRef.current += 1;

        if (!resetTimerRef.current) {
          resetTimerRef.current = setTimeout(() => {
            searchAttemptsRef.current = 0;
            setSearchStatus((prev) => {
              if (prev.tooManyAttempts) {
                return { ...prev, tooManyAttempts: false };
              }
              return prev;
            });
            resetTimerRef.current = null;
          }, 60000);
        }
      }, SEARCH_COOLDOWN);
    } else {
      if (debouncedSearchQuery !== "") {
        setDebouncedSearchQuery("");
      }
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [
    searchQuery,
    debouncedSearchQuery,
    MIN_SEARCH_LENGTH,
    MAX_SEARCH_LENGTH,
    MAX_SEARCH_ATTEMPTS,
    SEARCH_COOLDOWN,
  ]);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchContainerRef]);

  const endpoint = debouncedSearchQuery
    ? `products?searchQuery=${encodeURIComponent(debouncedSearchQuery.trim())}`
    : "";

  const {
    data: productsData,
    loading: searchLoading,
    error: searchError,
  } = useFetch<any>(debouncedSearchQuery ? endpoint : "", { method: "GET" });

  useEffect(() => {
    if (productsData && debouncedSearchQuery) {
      try {
        const products = productsData.data || productsData;
        if (!Array.isArray(products)) {
          console.error("Format de données invalide:", products);
          setSearchedProducts([]);
          return;
        }
        const validProducts = products.filter(
          (product) =>
            product &&
            typeof product.id === "number" &&
            typeof product.name === "string"
        );
        setSearchedProducts(validProducts);
      } catch (error) {
        console.error(
          "Erreur lors du traitement des données de recherche:",
          error
        );
        setSearchedProducts([]);
      }
    } else if (!debouncedSearchQuery) {
      setSearchedProducts([]);
    }
  }, [productsData, debouncedSearchQuery]);

  const isDebouncedQueryValid = useMemo(() => {
    if (!debouncedSearchQuery) return false;
    const validation = validateSearchQuery(debouncedSearchQuery, MIN_SEARCH_LENGTH);
    return validation.isValid;
  }, [debouncedSearchQuery, MIN_SEARCH_LENGTH]);

  return (
    <div
      ref={searchContainerRef}
      className="flex-1 mx-2 md:mx-4 max-w-xs md:max-w-md relative"
    >
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
      {isSearchFocused && searchStatus.tooShort && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
          <p className="text-sm text-orange-500">
            Veuillez saisir au moins {MIN_SEARCH_LENGTH} caractères
          </p>
        </div>
      )}
      {isSearchFocused && searchStatus.invalid && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
          <p className="text-sm text-red-500">
            Caractères non autorisés détectés
          </p>
        </div>
      )}
      {isSearchFocused && searchStatus.tooManyAttempts && (
        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
          <p className="text-sm text-red-500">
            Trop de recherches. Veuillez patienter un moment.
          </p>
        </div>
      )}
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
                      alt={product.name || "Produit"}
                      width={40}
                      height={40}
                      className="object-cover rounded mr-3"
                    />
                    <span className="text-sm text-gray-800">
                      {product.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <>
              {searchLoading && (
                <div className="p-2 text-sm text-gray-500">
                  Chargement...
                </div>
              )}
              {!searchLoading && !searchError && (
                <div className="p-2 text-sm text-gray-500">
                  Aucun produit trouvé.
                </div>
              )}
              {searchError && (
                <div className="p-2 text-sm text-red-500">
                  Erreur de chargement: {searchError.message}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
} 