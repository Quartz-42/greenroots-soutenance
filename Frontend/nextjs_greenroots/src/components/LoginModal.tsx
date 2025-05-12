"use client";

import { useState } from "react";
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
import { getCsrfToken, login } from "@/utils/functions/csrf-token.function";


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
  const { login: loginUser } = useAuth();


  const handleLogin= async () => {
    try {
      const response = await login(email, password);
      toast.success(`Bienvenue ${response.user.name || 'utilisateur'} !`);
      onOpenChange?.(false);
      onLoginSuccess?.();
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
        <Button className="w-full" onClick={handleLogin}>
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
