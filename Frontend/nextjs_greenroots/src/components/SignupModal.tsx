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
    }
    
    // Validation email
    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "L'email est invalide";
    }
    
    // Validation mot de passe
    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (password.length < 3) {
      newErrors.password = "Le mot de passe doit contenir au moins 3 caractères";
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
    
    try {
      const response = await register(email, password, name);
      toast.success("Votre compte a été créé avec succès");
      onOpenChange?.(false);
      return response;
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
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
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "border-red-500" : ""}
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
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-red-500" : ""}
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
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "border-red-500" : ""}
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
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={errors.confirmPassword ? "border-red-500" : ""}
          />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
        </div>
        <Button 
          className="w-full" 
          onClick={handleRegister}
          disabled={!isFormValid}
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
