'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation"
import { getCsrfToken, logoutUser } from '@/utils/functions/function';
import { url } from '@/utils/url';

interface User {
  name?: string;
  id?: string;
  email?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Validation d'utilisateur
const isValidUser = (user: any): boolean => {
  return (
    user &&
    typeof user === 'object' &&
    (user.id !== undefined) &&
    (user.email !== undefined || user.name !== undefined)
  );
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (isValidUser(parsedUser)) {
          setUser(parsedUser);
        } else {
          console.error("Données utilisateur invalides dans localStorage");
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error);
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        if (event.newValue) {
           try {
             const parsedUser = JSON.parse(event.newValue);
             if (isValidUser(parsedUser)) {
               setUser(parsedUser);
             } else {
               console.error("Données utilisateur invalides depuis l'événement storage");
               setUser(null);
             }
           } catch (error) {
             console.error("Erreur lors de la mise à jour depuis localStorage:", error);
             setUser(null);
           }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (userData: User) => {
    try {
      if (!isValidUser(userData)) {
        throw new Error("Données utilisateur invalides");
      }
      
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      
    } catch (error) {
        console.error("Erreur lors de la sauvegarde de l'utilisateur:", error);
        toast.error("Erreur lors de la connexion.");
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
      
      localStorage.removeItem("user");
      setUser(null);
      // toast.success("Vous êtes déconnecté.");
      router.push("/");
      return Promise.resolve();
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion.");
      return Promise.reject(error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading,
      isAuthenticated: !!user 
    }}>
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
