"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import {
  User,
  Settings,
  Package,
  Save,
  X,
  Loader2,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  updateUserProfile,
  logoutUser,
  confirmAction,
} from "@/utils/functions/function";
import DOMPurify from "dompurify";

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Fonction utilitaire pour nettoyer les entrées
const sanitizeInput = (input: string): string => {
  return DOMPurify.sanitize(input.trim());
};

// Validation du nom (lettres, espaces, tirets)
const isValidName = (name: string): boolean => {
  return (
    /^[a-zA-ZÀ-ÿ\s'-]+$/.test(name) && name.length >= 2 && name.length <= 50
  );
};

// Validation de l'email avec une regex plus stricte
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 100;
};

export default function UserProfileModal({
  open,
  onOpenChange,
}: UserProfileModalProps) {
  const { user, login, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [updateAttempts, setUpdateAttempts] = useState(0);

  // Initialisation et réinitialisation des champs
  useEffect(() => {
    if (user) {
      setEditedName(user.name || "");
      setEditedEmail(user.email || "");
    }
    if (!open) {
      setIsEditing(false);
      setIsLoggingOut(false);
      setErrors({});
      setUpdateAttempts(0);
    }
  }, [user, open]);

  // Fonction de gestion des changements d'input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const { id, value } = e.target;

    // Limite la longueur des entrées en temps réel
    const maxLengths: { [key: string]: number } = {
      name: 50,
      email: 100,
    };

    // Appliquer des filtres spécifiques en fonction du champ
    let sanitizedValue = value;

    if (sanitizedValue.length <= maxLengths[id]) {
      setter(sanitizedValue);
    }
  };

  // Validation du formulaire
  useEffect(() => {
    if (!isEditing) return;

    const newErrors: { name?: string; email?: string } = {};

    if (!editedName) {
      newErrors.name = "Le nom est requis";
    } else if (!isValidName(editedName)) {
      newErrors.name =
        "Le nom doit contenir uniquement des lettres, espaces et tirets (2-50 caractères)";
    }

    if (!editedEmail) {
      newErrors.email = "L'email est requis";
    } else if (!isValidEmail(editedEmail)) {
      newErrors.email = "L'email est invalide";
    }

    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [editedName, editedEmail, isEditing]);

  if (!user) {
    return null;
  }

  const handleCancelEdit = () => {
    setEditedName(user.name || "");
    setEditedEmail(user.email || "");
    setIsEditing(false);
    setErrors({});
  };

  const handleSaveInfo = async () => {
    if (!user?.id || !isFormValid) return;

    // Éviter les requêtes inutiles
    if (editedName === user.name && editedEmail === user.email) {
      setIsEditing(false);
      toast.info("Aucune modification détectée.");
      return;
    }

    // Limiter le nombre de tentatives
    if (updateAttempts >= 5) {
      toast.error(
        "Trop de tentatives de modification. Veuillez réessayer plus tard."
      );
      return;
    }

    setIsLoading(true);
    try {
      // Nettoyer les entrées avant l'envoi
      const sanitizedName = sanitizeInput(editedName);
      const sanitizedEmail = sanitizeInput(editedEmail);

      const updatedUser = await updateUserProfile(
        Number(user.id),
        sanitizedName,
        sanitizedEmail
      );
      login(updatedUser);
      toast.success("Informations mises à jour avec succès !");
      setIsEditing(false);
      setUpdateAttempts(0);
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(
        error.message || "Impossible de mettre à jour les informations."
      );
      setUpdateAttempts((prev) => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      await logout();
      onOpenChange(false);
      toast.success("Vous êtes maintenant déconnecté");
    } catch (error) {
      console.error("Erreur interceptée lors de la déconnexion:", error);
      toast.error("Erreur lors de la déconnexion. Veuillez réessayer.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleLogoutRequest = () => {
    if (confirmAction("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      handleLogoutConfirm();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" /> Mon Profil
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Section des informations */}
          {!isEditing ? (
            <>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium text-gray-500">
                    Nom
                  </span>
                  <span className="col-span-3 text-sm font-medium">
                    {user.name || "Non défini"}
                  </span>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <span className="text-right text-sm font-medium text-gray-500">
                    Email
                  </span>
                  <span className="col-span-3 text-sm font-medium">
                    {user.email || "Non défini"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  className="flex-1"
                  size="sm"
                >
                  <Settings className="mr-2 h-4 w-4" /> Modifier
                </Button>
                <Button
                  asChild
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1"
                  size="sm"
                >
                  <Link href="/suivi">
                    <Package className="mr-2 h-4 w-4" /> Mes commandes
                  </Link>
                </Button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  value={editedName}
                  onChange={(e) => handleInputChange(e, setEditedName)}
                  className={errors.name ? "border-red-500" : ""}
                  disabled={isLoading}
                  maxLength={50}
                  placeholder="Votre nom"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={editedEmail}
                  onChange={(e) => handleInputChange(e, setEditedEmail)}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isLoading}
                  maxLength={100}
                  placeholder="votre@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <Button
                  onClick={handleSaveInfo}
                  disabled={isLoading || !isFormValid || updateAttempts >= 5}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Enregistrer
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={isLoading}
                >
                  <X className="mr-2 h-4 w-4" /> Annuler
                </Button>{" "}
              </div>
            </div>
          )}

          {/* Bouton de déconnexion toujours visible */}
          {!isEditing && (
            <Button
              variant="destructive"
              className="text-white w-full mt-4"
              onClick={handleLogoutRequest}
              disabled={isLoggingOut}
              size="sm"
            >
              {isLoggingOut ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="mr-2 h-4 w-4" />
              )}
              Déconnexion
            </Button>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              disabled={isLoading || isLoggingOut}
              className="w-full"
            >
              Fermer
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
