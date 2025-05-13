"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { login } from "@/utils/functions/function";
import DOMPurify from 'dompurify';

// Fonction utilitaire pour nettoyer les entrées
const sanitizeInput = (input: string): string => {
  // Utilise DOMPurify pour nettoyer les chaînes et éviter XSS
  return DOMPurify.sanitize(input.trim());
};

// Validation d'email avec regex plus stricte
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

interface LoginModalProps {
  onLoginSuccess?: () => void;
  onSwitchToSignup?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function LoginModal({
  onLoginSuccess,
  onSwitchToSignup,
  open,
  onOpenChange,
  trigger,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { login: loginUser } = useAuth();

  // Validation lors des changements de champs
  useEffect(() => {
    const newErrors: { email?: string; password?: string } = {};
    
    // Validation email
    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!isValidEmail(email)) {
      newErrors.email = "L'email est invalide";
    } else if (email.length > 100) {
      newErrors.email = "L'email ne doit pas dépasser 100 caractères";
    }
    
    // Validation mot de passe
    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length > 64) {
      newErrors.password = "Le mot de passe ne doit pas dépasser 64 caractères";
    }
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [email, password]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    // Limite la longueur des entrées en temps réel
    if (e.target.value.length <= (e.target.id === "email" ? 100 : 64)) {
      setter(e.target.value);
    }
  };

  const handleLogin = async () => {
    if (!isFormValid) return;
    
    // Limite le nombre de tentatives de connexion
    if (loginAttempts >= 5) {
      toast.error("Trop de tentatives de connexion. Veuillez réessayer plus tard.");
      return;
    }
    
    try {
      // Nettoyer les entrées avant de les envoyer
      const sanitizedEmail = sanitizeInput(email);
      
      // Le mot de passe ne doit pas être modifié pour ne pas altérer sa valeur cryptographique
      const response = await login(sanitizedEmail, password);
      if (response) {
        loginUser(response);
        toast.success(`Bienvenue ${response.name || response.email} !`);
        onOpenChange?.(false);
        onLoginSuccess?.();
        // Réinitialiser le compteur de tentatives
        setLoginAttempts(0);
      } else {
        setLoginAttempts(prev => prev + 1);
        toast.error("Une erreur est survenue lors de la connexion.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setLoginAttempts(prev => prev + 1);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue lors de la connexion.");
    }
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Se connecter</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="nom@exemple.com"
            value={email}
            onChange={(e) => handleInputChange(e, setEmail)}
            className={errors.email ? "border-red-500" : ""}
            maxLength={100}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => handleInputChange(e, setPassword)}
            className={errors.password ? "border-red-500" : ""}
            maxLength={64}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div className="flex items-center justify-between">
          {/* <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Se souvenir de moi
            </label>
          </div> */}
          {/* <Button variant="link" className="text-green-600 p-0 h-auto text-sm">
            Mot de passe oublié ?
          </Button> */}
        </div>
        <Button 
          className="w-full" 
          onClick={handleLogin} 
          disabled={!isFormValid || loginAttempts >= 5}
        >
          Connexion
        </Button>
        <div className="text-center text-sm">
          <span className="text-gray-600">Vous n'avez pas de compte ? </span>
          <Button
            variant="link"
            className="text-green-600 p-0 h-auto text-sm"
            onClick={() => {
              onOpenChange?.(false);
              onSwitchToSignup?.();
            }}
          >
            Créer un compte
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {dialogContent}
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="link" className="text-sm font-medium">
            Se connecter
          </Button>
        )}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
