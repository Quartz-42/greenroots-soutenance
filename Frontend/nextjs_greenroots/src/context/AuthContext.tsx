'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation"

// Définition du type pour l'utilisateur (peut être partagée ou importée)
interface User {
  name?: string;
  id?: string; // Assurez-vous que l'ID est inclus si nécessaire
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean; // Pour gérer l'état de chargement initial depuis localStorage
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Indique si on charge depuis localStorage
  const router = useRouter();
  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur depuis localStorage:", error);
      // Optionnel : supprimer l'item invalide
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false); // Fin du chargement initial
    }

    // Écouter les changements dans localStorage (provoqués par d'autres onglets/fenêtres)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        if (event.newValue) {
           try {
             setUser(JSON.parse(event.newValue));
           } catch (error) {
             console.error("Erreur lors de la mise à jour depuis localStorage:", error);
             setUser(null);
           }
        } else {
          // Si newValue est null, l'utilisateur a été supprimé (déconnexion)
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (userData: User) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      // Le toast est maintenant géré dans le composant qui appelle login si nécessaire
    } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'utilisateur dans localStorage:", error);
        toast.error("Erreur lors de la connexion.");
    }
  };

  const logout = async () => {
    try {
    const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la déconnexion.");
      }

      localStorage.removeItem("user");
      setUser(null);
      toast.success("Vous êtes déconnecté.");
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
