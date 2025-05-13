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
import { toast } from "react-toastify";
import { register } from "@/utils/functions/function";
import DOMPurify from 'dompurify';

// Fonction utilitaire pour nettoyer les entrées
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};

// Validation d'email avec regex plus stricte
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Vérification de la robustesse du mot de passe
const isStrongPassword = (password: string): boolean => {
  // Au moins 8 caractères, avec une majuscule, une minuscule et un chiffre
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

interface SignupModalProps {
  onSwitchToLogin?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function SignupModal({
  onSwitchToLogin,
  open,
  onOpenChange,
  trigger,
}: SignupModalProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [registrationAttempts, setRegistrationAttempts] = useState(0);

  // Gestion des changements d'input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const { id, value } = e.target;
    // Limite la longueur des entrées en temps réel
    const maxLengths = {
      "signup-name": 50,
      "signup-email": 100,
      "signup-password": 64,
      "signup-confirm-password": 64
    };
    
    const maxLength = maxLengths[id as keyof typeof maxLengths];
    if (value.length <= maxLength) {
      setter(value);
    }
  };

  // Validation lors des changements de champs
  useEffect(() => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
    
    // Validation nom
    if (!name) {
      newErrors.name = "Le nom est requis";
    } else if (name.length > 50) {
      newErrors.name = "Le nom ne doit pas dépasser 50 caractères";
    } else if (!/^[a-zA-ZÀ-ÿ\s-]+$/.test(name)) {
      newErrors.name = "Le nom ne doit contenir que des lettres, espaces et tirets";
    }
    
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
    } else if (password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères";
    } else if (password.length > 64) {
      newErrors.password = "Le mot de passe ne doit pas dépasser 64 caractères";
    } else if (!isStrongPassword(password)) {
      newErrors.password = "Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre";
    }
    
    // Validation confirmation mot de passe
    if (!confirmPassword) {
      newErrors.confirmPassword = "Veuillez confirmer le mot de passe";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [name, email, password, confirmPassword]);

  const handleRegister = async () => {
    if (!isFormValid) return;
    
    // Limite le nombre de tentatives d'inscription
    if (registrationAttempts >= 5) {
      toast.error("Trop de tentatives d'inscription. Veuillez réessayer plus tard.");
      return;
    }
    
    try {
      // Nettoyer les entrées avant de les envoyer
      const sanitizedName = sanitizeInput(name);
      const sanitizedEmail = sanitizeInput(email);
      
      // Le mot de passe ne doit pas être sanitizé pour ne pas altérer sa valeur cryptographique
      const response = await register(sanitizedEmail, password, sanitizedName);
      toast.success("Votre compte a été créé avec succès");
      onOpenChange?.(false);
      setRegistrationAttempts(0);
      return response;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setRegistrationAttempts(prev => prev + 1);
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue lors de l'inscription");
    }
  }

  const dialogContent = (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">
          Créer un compte
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="signup-name">Nom</Label>
          <Input
            id="signup-name"
            type="text"
            placeholder="Nom prénom"
            value={name}
            onChange={(e) => handleInputChange(e, setName)}
            className={errors.name ? "border-red-500" : ""}
            maxLength={50}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
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
          <Label htmlFor="signup-password">Mot de passe</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => handleInputChange(e, setPassword)}
            className={errors.password ? "border-red-500" : ""}
            maxLength={64}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password">
            Saisir à nouveau le mot de passe
          </Label>
          <Input
            id="signup-confirm-password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => handleInputChange(e, setConfirmPassword)}
            className={errors.confirmPassword ? "border-red-500" : ""}
            maxLength={64}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
        <Button 
          className="w-full" 
          onClick={handleRegister}
          disabled={!isFormValid || registrationAttempts >= 5}
        >
          Créer mon compte
        </Button>
        <div className="text-center text-sm">
          <span className="text-gray-600">Vous avez déjà un compte ? </span>
          <Button
            variant="link"
            className="text-green-600 p-0 h-auto text-sm"
            onClick={() => {
              onOpenChange?.(false);
              onSwitchToLogin?.();
            }}
          >
            Se connecter
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
            Créer un compte
          </Button>
        )}
      </DialogTrigger>
      {dialogContent}
    </Dialog>
  );
}
