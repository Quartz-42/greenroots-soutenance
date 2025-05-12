"use client";

import { useEffect, Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { LoaderCircle, CheckCircle, XCircle } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null);

  useEffect(() => {
    if (sessionId) {
      setIsValidSession(true);
      // Redirection après un court délai pour montrer le succès
      const timer = setTimeout(() => {
       /* avant la redirection faire une verification de la commande coté api  */
        /*!todo on pourrait comparer le params session_id a ce qu'envoi le hook stripe  */

        router.push('/recapitulatif/1'); 
      }, 2500); 

      return () => clearTimeout(timer); // Nettoyage du timer
    } else {
      setIsValidSession(false);
      // Gérer le cas où session_id est manquant (ne devrait pas arriver si Stripe redirige)
      console.error("ID de session Stripe manquant dans l'URL de succès.");
    }
  }, [sessionId, router]);

  // Affichage initial pendant la vérification (très rapide)
  if (isValidSession === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <LoaderCircle className="w-16 h-16 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Vérification...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {isValidSession ? (
        <>
          <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Paiement reçu !</h1>
          <p className="text-gray-600">Votre commande est en cours de traitement. Vous allez être redirigé...</p>
          {/* Message indiquant que la validation complète se fera par webhook */}
          <p className="mt-4 text-sm text-gray-500">La confirmation finale et la création de la commande seront effectuées par notre système.</p> 
        </>
      ) : (
        <>
          <XCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-semibold mb-2">Erreur</h1>
          <p className="text-gray-600">L'identifiant de session de paiement est manquant ou invalide.</p>
          <p className="mt-4">
            <a href="/" className="text-blue-600 hover:underline">Retourner à l'accueil</a>
          </p>
        </>
      )}
    </div>
  );
}


export default function SuccessPage() {
  // Suspense est nécessaire car useSearchParams est utilisé
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-[60vh]"><LoaderCircle className="w-12 h-12 text-blue-500 animate-spin" /></div>}>
      <SuccessContent />
    </Suspense>
  );
} 