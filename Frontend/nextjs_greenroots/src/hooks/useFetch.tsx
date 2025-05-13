import { useState, useEffect } from "react";
import { getCsrfToken } from "@/utils/functions/function";
import DOMPurify from "dompurify";

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: any;
  validateBody?: (body: any) => boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Fonction récursive pour nettoyer tous les champs string d'un objet avec DOMPurify
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return DOMPurify.sanitize(obj);
  } else if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  } else if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const key in obj) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }
  return obj;
}

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
          "Cache-Control": "no-store",
        };

        if (
          options.body &&
          typeof options.validateBody === "function" &&
          !options.validateBody(options.body)
        ) {
          throw new Error("Le corps de la requête n'est pas valide.");
        }

        // Nettoyage de tous les champs string du body avant l'envoi
        let sanitizedBody = options.body;
        if (options.body && (options.method === 'POST' || options.method === 'PUT')) {
          sanitizedBody = sanitizeObject(options.body);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: options.method || "GET",
          headers: {
            ...defaultHeaders,
            ...options.headers,
            "X-CSRF-Token": token,
          },
          body: sanitizedBody ? JSON.stringify(sanitizedBody) : undefined,
          credentials: "include",
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
