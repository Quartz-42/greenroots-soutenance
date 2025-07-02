'use client';

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation"
import { logoutUser } from '@/utils/functions/function';

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
          localStorage.removeItem("user");
        }
      }
    } catch (error) {
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
              setUser(null);
            }
          } catch (error) {
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
      toast.error("Erreur lors de la connexion.");
    }
  };

  const logout = async () => {
    try {
      await logoutUser();

      localStorage.removeItem("user");
      setUser(null);
      router.push("/");
      return Promise.resolve();
    } catch (error) {
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
