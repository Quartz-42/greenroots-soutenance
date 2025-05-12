"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "react-toastify";

export type CartItem = {
  id: number;
  title?: string;
  description?: string;
  price: number | undefined;
  quantity: number;
  imageUrl?: string;
};

export type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => boolean;
  updateCartItem: (item: CartItem) => boolean;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
};

// Fonction de validation pour les éléments du panier
const isValidCartItem = (item: CartItem): boolean => {
  return (
    typeof item.id === 'number' && 
    item.id > 0 && 
    typeof item.quantity === 'number' && 
    item.quantity > 0 && 
    (item.price === undefined || typeof item.price === 'number')
  );
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Chargement au montage depuis le localstorage avec validation
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("panier");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        // Valider que c'est un tableau
        if (Array.isArray(parsedCart)) {
          // Filtrer les éléments valides
          const validItems = parsedCart.filter(isValidCartItem);
          setCart(validItems);
          
          // Si des éléments invalides ont été trouvés
          if (validItems.length !== parsedCart.length) {
            console.warn("Certains articles du panier étaient invalides et ont été supprimés");
            localStorage.setItem("panier", JSON.stringify(validItems));
          }
        } else {
          console.error("Format de panier invalide dans localStorage");
          localStorage.removeItem("panier");
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement du panier:", error);
      localStorage.removeItem("panier");
    }
  }, []);

  // Sauvegarde a chaque changement
  useEffect(() => {
    try {
      localStorage.setItem("panier", JSON.stringify(cart));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde du panier:", error);
      toast.error("Impossible de sauvegarder votre panier");
    }
  }, [cart]);

  // Fonctions de gestion du panier
  const addToCart = (item: CartItem): boolean => {
    if (!isValidCartItem(item)) {
      console.error("Tentative d'ajout d'un article invalide au panier", item);
      toast.error("Impossible d'ajouter cet article au panier");
      return false;
    }

    try {
      const existingItem = cart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        setCart(cart.map(cartItem => 
          cartItem.id === item.id ? { 
            ...cartItem, 
            quantity: Math.max(1, cartItem.quantity + item.quantity) 
          } : cartItem
        ));
      } else {
        setCart([...cart, { ...item, quantity: Math.max(1, item.quantity) }]);
      }
      return true;
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      toast.error("Erreur lors de l'ajout au panier");
      return false;
    }
  };

  const updateCartItem = (item: CartItem): boolean => {
    if (!isValidCartItem(item)) {
      console.error("Tentative de mise à jour avec un article invalide", item);
      toast.error("Impossible de mettre à jour cet article");
      return false;
    }

    try {
      // Vérifier si l'article existe
      const exists = cart.some(cartItem => cartItem.id === item.id);
      if (!exists) {
        console.warn("Tentative de mise à jour d'un article qui n'existe pas dans le panier");
        return false;
      }
      
      setCart(cart.map(cartItem => 
        cartItem.id === item.id ? { ...cartItem, quantity: Math.max(1, item.quantity) } : cartItem
      ));
      return true;
    } catch (error) {
      console.error("Erreur lors de la mise à jour du panier:", error);
      return false;
    }
  };

  const removeFromCart = (item: CartItem) => {
    try {
      setCart(cart.filter(cartItem => cartItem.id !== item.id));
    } catch (error) {
      console.error("Erreur lors de la suppression du panier:", error);
    }
  };

  const clearCart = () => {
    try {
      setCart([]);
    } catch (error) {
      console.error("Erreur lors de la vidange du panier:", error);
    }
  };

  const getTotalItems = (): number => {
    try {
      return cart.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error("Erreur lors du calcul du nombre total d'articles:", error);
      return 0;
    }
  };

  const getTotalPrice = (): number => {
    try {
      return cart.reduce((total, item) => total + ((item.price || 0) * item.quantity), 0);
    } catch (error) {
      console.error("Erreur lors du calcul du prix total:", error);
      return 0;
    }
  };

  const value = {
    cartItems: cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};