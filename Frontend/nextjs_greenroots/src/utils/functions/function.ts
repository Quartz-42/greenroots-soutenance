import { url } from "../url";
import { PurchaseData } from "../interfaces/purchase.interface";
import { Product } from "../interfaces/products.interface";
import { User } from "../interfaces/users.interface";
import { StripeCheckoutResponse } from "../interfaces/stripe.interface";
import { validateForm } from "@/utils/functions/validation.function";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import DOMPurify from "dompurify";

export interface CartItem {
  id: number;
  price?: number;
  quantity: number;
}

// Fonctions de validation
const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const isValidPassword = (password: string): boolean => {
  return !!password && password.length >= 3;
};

const isValidName = (name: string): boolean => {
  return !!name && name.trim().length > 0;
};

/**
 * Nettoie une chaîne avec DOMPurify et optionnellement limite sa longueur
 * @param input La chaîne d'entrée
 * @param maxLength Longueur maximale optionnelle
 * @returns La chaîne nettoyée et éventuellement tronquée
 */
export const sanitizeInput = (input: string, maxLength?: number): string => {
  // Nettoyer d'abord (trim + suppression espaces)
  let cleaned = input.trim();

  // Limiter la longueur si spécifiée
  if (maxLength && cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }

  // Sanitiser avec DOMPurify (uniquement côté client)
  if (typeof window !== "undefined") {
    return DOMPurify.sanitize(cleaned);
  }

  return cleaned;
};

// Fonction sécurisée pour obtenir un token CSRF
export const getCsrfToken = async () => {
  try {
    const response = await fetch(`${url.current}/csrf-token`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Impossible d'obtenir le token CSRF");
    }

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error("Erreur lors de la récupération du token CSRF:", error);
    throw error;
  }
};

// Fonction sécurisée pour l'enregistrement
export const register = async (
  email: string,
  password: string,
  name: string
) => {
  // Validation des données
  if (!isValidEmail(email)) {
    throw new Error("Email invalide");
  }

  if (!isValidPassword(password)) {
    throw new Error("Le mot de passe doit contenir au moins 3 caractères");
  }

  if (!isValidName(name)) {
    throw new Error("Le nom est requis");
  }

  try {
    const token = await getCsrfToken();
    const response = await fetch(`${url.current}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token,
      },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Erreur lors de l'inscription");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    throw error;
  }
};

// Fonction sécurisée pour la connexion
export const login = async (email: string, password: string) => {
  // Validation des données
  if (!isValidEmail(email)) {
    throw new Error("Email invalide");
  }

  if (!password) {
    throw new Error("Le mot de passe est requis");
  }

  try {
    const token = await getCsrfToken();
    const response = await fetch(`${url.current}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token,
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || "Erreur lors de la connexion");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    throw error;
  }
};

// Fonction sécurisée pour la création d'une commande
export const createPurchase = async (purchaseData: PurchaseData) => {
  try {
    // Validation des données de la commande
    const { purchase, purchase_products } = purchaseData;

    if (!purchase.address || purchase.address.trim() === "") {
      throw new Error("L'adresse est requise");
    }

    if (!purchase.city || purchase.city.trim() === "") {
      throw new Error("La ville est requise");
    }

    if (!purchase.postalcode || purchase.postalcode.trim() === "") {
      throw new Error("Le code postal est requis");
    }

    if (!purchase_products || purchase_products.length === 0) {
      throw new Error("Aucun produit dans le panier");
    }

    // Vérification des produits
    for (const product of purchase_products) {
      if (!product.product_id) {
        throw new Error("Identifiant de produit manquant");
      }
      if (product.quantity <= 0) {
        throw new Error("La quantité doit être supérieure à 0");
      }
    }

    const token = await getCsrfToken();
    const response = await fetch(`${url.current}/purchases`, {
      method: "POST",
      body: JSON.stringify(purchaseData),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || "Erreur lors de la création de la commande"
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la création de la commande:", error);
    throw error;
  }
};

// Fonction sécurisée pour récupérer les produits bestsellers
export const fetchBestSellers = async (
  setBestSellerProducts: (products: Product[]) => void
) => {
  try {
    const response = await fetch(`${url.current}/products/best-sellers`);
    console.log(response);
    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des meilleurs produits");
    }

    const data = await response.json();
    setBestSellerProducts(data);
  } catch (error) {
    console.error("Erreur lors de la récupération des bestsellers:", error);
    setBestSellerProducts([]);
    throw error;
  }
};

// Fonction pour mettre à jour le profil utilisateur
export const updateUserProfile = async (
  userId: number,
  name: string,
  email: string
) => {
  // Validation des données
  if (!isValidName(name)) {
    throw new Error("Le nom doit contenir au moins 2 caractères");
  }

  if (!isValidEmail(email)) {
    throw new Error("Email invalide");
  }

  try {
    const token = await getCsrfToken();
    const response = await fetch(`${url.current}/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token,
      },
      credentials: "include",
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erreur inconnue" }));

      // Gestion spécifique pour l'email déjà utilisé
      if (
        errorData.message &&
        errorData.message.toLowerCase().includes("email")
      ) {
        throw new Error("Cet email est déjà utilisé par un autre compte");
      }

      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    const updatedUser = await response.json();

    // Vérifier la cohérence des données
    if (!updatedUser || !updatedUser.id) {
      throw new Error("Données utilisateur invalides reçues du serveur");
    }

    return updatedUser;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    throw error;
  }
};

// Fonction pour se déconnecter
export const logoutUser = async () => {
  try {
    const token = await getCsrfToken();
    const response = await fetch(`${url.current}/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token,
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erreur inconnue" }));
      throw new Error(errorData.message || `Erreur ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
    throw error;
  }
};

// Fonction pour demander confirmation
export const confirmAction = (message: string): boolean => {
  return window.confirm(message);
};

// Fonction pour valider le formulaire utilisateur
export const validateUserForm = (
  name: string,
  email: string
): { isValid: boolean; errors: { name?: string; email?: string } } => {
  const errors: { name?: string; email?: string } = {};

  if (!isValidName(name)) {
    errors.name = "Le nom doit contenir au moins 2 caractères";
  }

  if (!isValidEmail(email)) {
    errors.email = "L'email est invalide";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const createCheckoutSession = async (purchaseId: string) => {
  const token = await getCsrfToken();
  const response = await fetch(
    `${url.current}/purchases/${purchaseId}/checkout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token,
      },
      credentials: "include",
    }
  );
  return response;
};

export const handleCheckoutSubmit = async (
  e: React.FormEvent<HTMLFormElement>,
  firstName: string,
  lastName: string,
  address: string,
  city: string,
  zipCode: string,
  setErrors: React.Dispatch<
    React.SetStateAction<{ [key: string]: string | undefined }>
  >,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  user: User | null,
  cartItems: CartItem[],
  router: AppRouterInstance,
  roundedTotal: number
) => {
  e.preventDefault();
  if (!validateForm(firstName, lastName, address, city, zipCode, setErrors)) {
    alert(
      "Veuillez corriger les erreurs dans le formulaire avant de continuer."
    );
    return;
  }
  setLoading(true);
  if (!user?.id) {
    alert("Veuillez vous connecter pour passer une commande.");
    setLoading(false);
    return;
  }
  if (cartItems.length === 0) {
    alert("Votre panier est vide.");
    setLoading(false);
    router.push("/");
    return;
  }

  const sanitizedAddress = sanitizeInput(address);
  const sanitizedCity = sanitizeInput(city);
  const sanitizedZipCode = sanitizeInput(zipCode);

  const dataForApi = {
    purchase: {
      user_id: user.id,
      address: sanitizedAddress,
      postalcode: sanitizedZipCode,
      city: sanitizedCity,
      total: roundedTotal,
      status: "En cours",
      date: new Date(),
      payment_method: "carte bancaire",
    },
    purchase_products: cartItems.map((product) => ({
      product_id: product.id,
      quantity: product.quantity,
      total: Math.round((product.price || 0) * product.quantity * 100) / 100,
    })),
  };

  try {
    const purchaseResult = await createPurchase(dataForApi);

    if (!purchaseResult || !purchaseResult.id) {
      throw new Error(
        "La création de la commande a échoué ou l'ID est manquant."
      );
    }
    const purchaseId = purchaseResult.id;
    const response = await createCheckoutSession(purchaseId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message:
          "Erreur inconnue lors de la création de la session de paiement",
      }));
      throw new Error(
        errorData.message ||
        "Erreur lors de la création de la session de paiement"
      );
    }

    const responseData = (await response.json()) as StripeCheckoutResponse;
    const { sessionId, url: checkoutUrl } = responseData;

    if (!sessionId || !checkoutUrl) {
      throw new Error(
        "ID de session Stripe ou URL de paiement invalide ou manquant"
      );
    }

    router.push(checkoutUrl);
  } catch (error) {
    console.error("Erreur lors du processus de paiement:", error);
    setLoading(false);

    if (error instanceof Error) {
      alert(`Erreur: ${error.message}`);
    } else {
      alert(
        "Une erreur inattendue s'est produite lors du processus de paiement."
      );
    }
  }
};

/**
 * Valide la requête de recherche
 */
export const validateSearchQuery = (
  query: string,
  minSearchLength: number
): {
  isValid: boolean;
  tooShort: boolean;
  invalid: boolean;
  search: string;
} => {
  const currentQuery = query.trim();
  let newTooShort = false;
  let newInvalid = false;
  let isValid = true;

  const disallowedPattern = /[<>{}\[\]\\^~|]/;
  if (disallowedPattern.test(query)) {
    newInvalid = true;
    isValid = false;
  } else if (query.length > 0 && currentQuery.length < minSearchLength) {
    newTooShort = true;
    isValid = false;
  }

  //cas de base : champ vide, pas d'erreur de validation
  if (currentQuery.length === 0 && !newInvalid) {
    newTooShort = false;
    isValid = false;
  }

  return {
    isValid,
    tooShort: newTooShort,
    invalid: newInvalid,
    search: currentQuery,
  };
};
