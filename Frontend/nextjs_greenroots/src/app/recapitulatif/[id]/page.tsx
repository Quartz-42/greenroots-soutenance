'use client'

import HeaderWithScroll from "@/components/HeaderWithScroll"
import { Suspense, useEffect, useState } from "react"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import { Button } from "@/components/ui/button"
import { useParams } from "next/navigation"

// Define an interface for the expected purchase details
interface PurchaseDetails {
  id: number;
  date: string; // Assuming date is returned as a string
  payment_method: string;
  address: string;
  postalcode: string;
  city: string;
  User: { // Assuming User details are included in the response
    name: string;
    // Add other user fields if needed, e.g., email, phone (though phone wasn't in schema)
  };
  // Add other fields if your API returns them (e.g., total, status)
}

export default function Recapitulatif() {
  const params = useParams();
  const id = params.id as string;
  const [orderDetails, setOrderDetails] = useState<PurchaseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // Don't fetch if id is not available yet

    const fetchOrderDetails = async () => {
      setLoading(true);
      setError(null);
      const apiUrl = 'http://localhost:3000'; 
      try {
        const response = await fetch(`${apiUrl}/purchases/${id}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch order details: ${response.statusText}`);
        }
        const data: PurchaseDetails = await response.json();
        setOrderDetails(data);
      } catch (err: any) {
        console.error("Error fetching order details:", err);
        setError(err.message || "An error occurred while fetching order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]); // Dependency array includes id

  // Function to format date (optional)
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric' 
      });
    } catch (e) {
      return dateString; // Return original string if formatting fails
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        Chargement des détails de la commande...
      </div>
    );
  }

  if (error) {
     return (
      <div className="relative min-h-screen flex items-center justify-center text-red-600">
        Erreur: {error}
      </div>
    );   
  }

  if (!orderDetails) {
     return (
      <div className="relative min-h-screen flex items-center justify-center">
        Aucun détail de commande trouvé.
      </div>
    );      
  }

  // Now use orderDetails in the JSX
  const orderNumber = orderDetails.id;
  const orderDate = formatDate(orderDetails.date);
  const paymentMethod = orderDetails.payment_method;
  const customerInfo = {
    name: orderDetails.User?.name || "Nom non disponible", // Handle potential missing user data
    address: `${orderDetails.address}, ${orderDetails.postalcode} ${orderDetails.city}`,
    // phone: orderDetails.User?.phone || "Téléphone non disponible" // Add if phone is available
  };

  return (
    <div className="relative min-h-screen">
      <Suspense fallback={<div className="h-16"></div>}>
        <HeaderWithScroll />
      </Suspense>

      <main className="pt-24 pb-16">
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <Breadcrumb 
            items={[
              { label: "Accueil", href: "/" },
              { label: "Récapitulatif" }
            ]} 
          />

          <h1 className="font-['Archive'] text-4xl font-bold text-green-700 mt-8 mb-12">
            RÉCAPITULATIF
          </h1>

          <div className="bg-white border rounded-lg p-8 max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Merci pour votre commande !
            </h2>

            <p className="text-gray-600 text-center mb-12">
              Votre commande n° {orderNumber} sera traitée sous 24 heures ouvrées. Nous vous informerons par e-mail de son expédition.
            </p>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 py-4 bg-gray-50 rounded-lg px-6">
                <div>
                  <p className="text-gray-600">Date</p>
                  <p className="font-medium">{orderDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-600">Méthode de paiement</p>
                  <p className="font-medium">{paymentMethod}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 py-4 bg-gray-50 rounded-lg px-6">
                <div>
                  <p className="text-gray-600">Client</p>
                  <p className="font-medium">{customerInfo.name}</p>
                </div>
              </div>

              <div className="py-4 bg-gray-50 rounded-lg px-6">
                <p className="text-gray-600">Adresse de livraison</p>
                <p className="font-medium">{customerInfo.address}</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-12">
              <Button
                variant="outline"
                className="min-w-[200px]"
                asChild
              >
                <a href="/">Retour à la boutique</a>
              </Button>
              <Button 
                className="min-w-[200px]"
                asChild
              >
                <a href={`/suivi/${orderNumber}`}>Suivre ma commande</a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
} 