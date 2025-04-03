"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

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
  addToCart: (item: CartItem) => void;
  updateCartItem: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Chargement au montage depuis le localstorage
  useEffect(() => {
    const storedCart = localStorage.getItem("panier");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Sauvegarde a chaque changement
  useEffect(() => {
    localStorage.setItem("panier", JSON.stringify(cart));
  }, [cart]);

  // Fonctions de gestion du panier
  const addToCart = (item: CartItem) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + item.quantity } : cartItem
      ));
    } else {
      setCart([...cart, item]);
    }
  };

  const updateCartItem = (item: CartItem) => {
    setCart(cart.map(cartItem => 
      cartItem.id === item.id ? { ...cartItem, quantity: item.quantity } : cartItem
    ));
  };

  const removeFromCart = (item: CartItem) => {
    setCart(cart.filter(cartItem => cartItem.id !== item.id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const value = {
    cartItems: cart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
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