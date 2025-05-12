import { useState, useEffect } from "react";
import { getCsrfToken } from "@/utils/functions/function";
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: any;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function useFetch<T>(endpoint: string, options: FetchOptions = {}) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        let token = "";
        try {
          token = await getCsrfToken();
        } catch (e) {
          console.warn("Impossible de récupérer le token CSRF");
        }
        setState((prev) => ({ ...prev, loading: true }));

        const defaultHeaders = {
          "Content-Type": "application/json",
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: options.method || "GET",
          headers: {
            ...defaultHeaders,
            ...options.headers,
            "X-CSRF-Token": token,
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        setState({
          data,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error:
            error instanceof Error
              ? error
              : new Error("Une erreur est survenue"),
        });
      }
    };

    fetchData();
  }, [endpoint, JSON.stringify(options)]);

  return state;
}

/*

-Pour récupérer des produits
const { data: products, loading, error } = useFetch<Product[]>('/products');

-Pour créer un nouveau produit
const { data } = useFetch<Product>('/products', {
  method: 'POST',
  body: { name: 'Nouveau produit', price: 100 }
});

-Pour mettre à jour un produit
const { data } = useFetch<Product>('/products/1', {
  method: 'PUT',
  body: { price: 150 }
});

*/
