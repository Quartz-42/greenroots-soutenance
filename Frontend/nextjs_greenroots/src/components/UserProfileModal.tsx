'use client'

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { User, Settings, Package, Save, X, Loader2, LogOut } from 'lucide-react';
import { toast } from 'react-toastify';

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function UserProfileModal({ open, onOpenChange }: UserProfileModalProps) {
  const { user, login, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedEmail, setEditedEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (user) {
      setEditedName(user.name || '');
      setEditedEmail(user.email || '');
    }
    if (!open) {
        setIsEditing(false);
        setIsLoggingOut(false);
    }
  }, [user, open]);

  if (!user) {
    return null;
  }

  const handleCancelEdit = () => {
    setEditedName(user.name || '');
    setEditedEmail(user.email || '');
    setIsEditing(false);
  }

  const handleSaveInfo = async () => {
    if (!user?.id) return;

    if (editedName === user.name && editedEmail === user.email) {
      setIsEditing(false);
      toast.info("Aucune modification détectée.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
            name: editedName, 
            email: editedEmail 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue'}));
        throw new Error(errorData.message || `Erreur ${response.status}`);
      }

      const updatedUser = await response.json();
      
      login(updatedUser); 

      toast.success("Informations mises à jour avec succès !");
      setIsEditing(false);

    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      toast.error(`Erreur: ${error.message || 'Impossible de mettre à jour les informations.'}`);
    } finally {
      setIsLoading(false);
    }
  }

  const handleLogoutConfirm = async () => {
      setIsLoggingOut(true);
      try {
          await logout();
          onOpenChange(false);
      } catch (error) {
          console.error("Erreur interceptée lors de la déconnexion:", error);
      } finally {
          setIsLoggingOut(false);
      }
  }

  const handleLogoutRequest = () => {
      if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
          handleLogoutConfirm();
      }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" /> Mon Profil
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isEditing ? (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nom</Label>
                <Input 
                    id="name" 
                    value={editedName} 
                    onChange={(e) => setEditedName(e.target.value)} 
                    className="col-span-3" 
                    disabled={isLoading}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input 
                    id="email" 
                    type="email"
                    value={editedEmail} 
                    onChange={(e) => setEditedEmail(e.target.value)} 
                    className="col-span-3" 
                    disabled={isLoading}
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right text-sm font-medium text-gray-500">Nom</span>
                <span className="col-span-3 text-sm">{user.name || 'Non défini'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-right text-sm font-medium text-gray-500">Email</span>
                <span className="col-span-3 text-sm">{user.email || 'Non défini'}</span>
              </div>
            </>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
          {isEditing ? (
            <div className="flex gap-2">
               <Button onClick={handleSaveInfo} disabled={isLoading}>
                 {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
                 Enregistrer
               </Button>
               <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
                 <X className="mr-2 h-4 w-4" /> Annuler
               </Button>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2 justify-start">
                <Button variant="outline" onClick={() => setIsEditing(true)} size="sm">
                  <Settings className="mr-2 h-4 w-4" /> Modifier
                </Button>
                 <Link href="/suivi" passHref legacyBehavior>
                   <Button asChild variant="outline" onClick={() => onOpenChange(false)} size="sm">
                     <a><Package className="mr-2 h-4 w-4" /> Commandes</a>
                   </Button>
                </Link>
                <Button variant="destructive" className='text-white' onClick={handleLogoutRequest} disabled={isLoggingOut} size="sm">
                    {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />} 
                    Déconnexion
                </Button>
            </div>
          )}
          
          <DialogClose asChild>
             <Button type="button" variant="secondary" disabled={isLoading || isLoggingOut}>
               Fermer
             </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 