import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "../interfaces/users.interface";
import { toast } from "react-toastify";

interface HandleProcessOrderParams {
  user: User | null | undefined;
  isCartEmpty: boolean;
  hasValidCart: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  router: AppRouterInstance;
}

export const handleProcessOrder = async ({
  user,
  isCartEmpty,
  hasValidCart,
  setIsLoginModalOpen,
  router,
}: HandleProcessOrderParams) => {
  if (!user) {
    console.warn("Tentative de traiter la commande sans être connecté.")
    setIsLoginModalOpen(true);
    return;
  }
  
  if (isCartEmpty) {
    toast.error("Impossible de procéder avec un panier vide");
    return;
  }
  
  if (!hasValidCart) {
    toast.error("Impossible de procéder avec un panier invalide");
    return;
  }
  
  router.push("/checkout");
}