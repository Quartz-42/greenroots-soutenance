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
import {  login } from "@/utils/functions/function";

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
  const { login: loginUser } = useAuth();

  // Validation lors des changements de champs
  useEffect(() => {
    const newErrors: { email?: string; password?: string } = {};
    
    // Validation email
    if (!email) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "L'email est invalide";
    }
    
    // Validation mot de passe
    if (!password) {
      newErrors.password = "Le mot de passe est requis";
    }
    
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [email, password]);

  const handleLogin = async () => {
    if (!isFormValid) return;
    
    try {
      const response = await login(email, password);
      if (response) {
        loginUser(response);
        toast.success(`Bienvenue ${response.name || response.email} !`);
        onOpenChange?.(false);
        onLoginSuccess?.();
      } else {
        toast.error("Une erreur est survenue lors de la connexion.");
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
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
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "border-red-500" : ""}
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
            onChange={(e) => setPassword(e.target.value)}
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Se souvenir de moi
            </label>
          </div>
          <Button variant="link" className="text-green-600 p-0 h-auto text-sm">
            Mot de passe oublié ?
          </Button>
        </div>
        <Button 
          className="w-full" 
          onClick={handleLogin} 
          disabled={!isFormValid}
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
