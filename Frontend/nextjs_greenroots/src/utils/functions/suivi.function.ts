import { toast } from "react-toastify";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { PurchaseDetails } from "@/utils/interfaces/purchase.interface";
import { url } from "../url";

interface FetchUserPurchasesParams {
  userId: string;
  setPurchases: React.Dispatch<React.SetStateAction<PurchaseDetails[]>>;
  setIsLoadingPurchases: React.Dispatch<React.SetStateAction<boolean>>;
  router: AppRouterInstance;
}

export const fetchUserPurchases = async ({
  userId,
  setPurchases,
  setIsLoadingPurchases,
  router,
}: FetchUserPurchasesParams): Promise<void> => {
  setIsLoadingPurchases(true);
  try {
    const response = await fetch(`${url.current}/purchases/user/${userId}`);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error("Error fetching purchases:", response.status, errorData);
      if (response.status === 401) {
        toast.error("Session expirée ou invalide. Veuillez vous reconnecter.");
        router.push("/");
      } else {
        toast.error(`Erreur lors de la récupération des commandes: ${errorData.message || response.status}`);
      }
      setPurchases([]);
      setIsLoadingPurchases(false);
      return;
    }

    const data = await response.json();
    setPurchases(data);

  } catch (error) {
    console.error("Network or other error fetching purchases:", error);
    toast.error("Une erreur réseau est survenue lors de la récupération des commandes.");
    setPurchases([]);
  } finally {
    setIsLoadingPurchases(false);
  }
};
