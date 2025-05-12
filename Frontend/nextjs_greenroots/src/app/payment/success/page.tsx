"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoaderCircle, CheckCircle, XCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { getCsrfToken } from "@/utils/functions/function";
import { url } from "@/utils/url";

// Type pour la réponse de l'API de vérification
interface VerifySessionResponse {
  purchaseId: number;
}

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  
  // Lire le token de vérification depuis l'URL
  const verificationToken = searchParams.get("verification_token"); 
  
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [purchaseId, setPurchaseId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // Ajouter un état pour savoir si la vérification a été lancée
  const [hasVerificationStarted, setHasVerificationStarted] = useState(false);

  useEffect(() => {
    const verifyPaymentSession = async () => {
      try {
        const csrfToken = await getCsrfToken();
        const response = await fetch(`${url.current}/purchases/verify-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify({ verificationToken: verificationToken }), 
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Erreur serveur (${response.status})`);
        }

        const result: VerifySessionResponse = await response.json();
        setPurchaseId(result.purchaseId);
        setVerificationStatus('success');
        clearCart();

        const timer = setTimeout(() => {
          router.push(`/recapitulatif/${result.purchaseId}`);
        }, 1500);

      } catch (error) {
        console.error("Erreur lors de la vérification du token:", error);
        setErrorMessage(error instanceof Error ? error.message : "Une erreur inconnue est survenue.");
        setVerificationStatus('error');
      }
    };

    // Lancer la vérification SEULEMENT si le token existe ET qu'elle n'a pas déjà démarré
    if (verificationToken && !hasVerificationStarted) {
      setHasVerificationStarted(true); // Marquer comme démarrée
      verifyPaymentSession();
    }

    // Gérer le cas où le token est manquant dès le début
    if (!verificationToken && !hasVerificationStarted) {
        console.error("Token de vérification manquant dans l'URL de succès.");
        setErrorMessage("Token de vérification manquant.");
        setVerificationStatus('error');
        setHasVerificationStarted(true); // Marquer comme traitée (erreur)
    }

    // Les dépendances incluent les éléments nécessaires pour la logique de décision
  }, [verificationToken, hasVerificationStarted, clearCart, router]); 

  // Rendu basé sur l'état de la vérification
  if (verificationStatus === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <LoaderCircle className="w-16 h-16 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Vérification du paiement...</p>
      </div>
    );
  }

  if (verificationStatus === 'success' && purchaseId) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4"/>
          <h1 className="text-2xl font-semibold mb-2">Paiement validé !</h1>
          <p className="text-gray-600 mb-4">Votre commande #{purchaseId} a été confirmée.</p>
          <div className="flex flex-col items-center">
            <img
                src="/gif_tree.gif"
                alt="Chargement de la redirection..."
                className="w-[150px] mb-2"
            />
            <p className="text-primary font-bold animate pulse">Redirection en cours...</p>
          </div>
        </div>
    );
  }

  // Cas d'erreur
  return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <XCircle className="w-16 h-16 text-red-500 mb-4"/>
        <h1 className="text-2xl font-semibold mb-2">Erreur de validation du paiement</h1>
        <p>
          <a href="/" className="text-blue-600 hover:underline">Retourner à l'accueil</a>
        </p>
      </div>
  );
}


export default function SuccessPage() {
  return (
      <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]"><LoaderCircle className="w-12 h-12 text-blue-500 animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
} 