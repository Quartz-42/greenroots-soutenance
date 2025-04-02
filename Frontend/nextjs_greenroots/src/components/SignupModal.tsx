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
import { useFetch } from "@/hooks/useFetch";
import { User } from "@/utils/interfaces/users.interface";

interface SignupModalProps {
  onSignupSuccess?: () => void;
  onSwitchToLogin?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function SignupModal({
  onSignupSuccess,
  onSwitchToLogin,
  open,
  onOpenChange,
  trigger,
}: SignupModalProps) {
  const [name, setName] = useState<string>("ben");
  const [email, setEmail] = useState<string>("test@test.c");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const register = async () => {
    try {
      const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (e) {
      console.log(e);
    }
  };

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
            type="name"
            placeholder="Nom prénom"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email</Label>
          <Input
            id="signup-email"
            type="email"
            placeholder="nom@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-password">Mot de passe</Label>
          <Input
            id="signup-password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
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
          />
        </div>
        <Button className="w-full" onClick={register}>
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

  // Si open et onOpenChange sont fournis, c'est un contrôle externe
  if (open !== undefined && onOpenChange) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        {dialogContent}
      </Dialog>
    );
  }

  // Sinon, c'est un contrôle interne avec trigger
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
