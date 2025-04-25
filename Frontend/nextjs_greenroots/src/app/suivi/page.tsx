'use client'

import { PurchaseDetails } from "@/utils/interfaces/purchase.interface";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import HeaderWithScroll from "@/components/HeaderWithScroll";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import Image from "next/image";

export default function SuiviPage() {
    const [ purchases, setPurchases ] = useState<PurchaseDetails[]>([]);
    const [ isLoadingPurchases, setIsLoadingPurchases ] = useState(true);
    
    const { user, isLoading: isLoadingAuth } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (isLoadingAuth) {
            return;
        }

        if (!user) {
            toast.info("Veuillez vous connecter pour voir vos commandes.");
            router.push("/");
            return;
        }

        let isMounted = true;
        setIsLoadingPurchases(true);
        const fetchPurchases = async () => {
            try {
                const response = await fetch(`http://localhost:3000/purchases/user/${user.id}`);
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: response.statusText }));
                    console.error("Error fetching purchases:", response.status, errorData);
                    if (isMounted) {
                        if (response.status === 401) {
                            toast.error("Session expirée ou invalide. Veuillez vous reconnecter.");
                            router.push("/");
                        } else {
                            toast.error(`Erreur lors de la récupération des commandes: ${errorData.message || response.status}`);
                        }
                    }
                    return;
                }

                const data = await response.json();
                console.log("Achats récupérés:", data);
                if (isMounted) {
                    setPurchases(data);
                }

            } catch (error) {
                console.error("Network or other error fetching purchases:", error);
                if (isMounted) {
                    toast.error("Une erreur réseau est survenue lors de la récupération des commandes.");
                }
            } finally {
                if (isMounted) {
                    setIsLoadingPurchases(false);
                }
            }
        };

        fetchPurchases();

        return () => {
            isMounted = false;
        };

    }, [isLoadingAuth, user, router]);

    if (isLoadingAuth) {
        return (
            <div className="relative min-h-screen flex items-center justify-center">
                <div>Chargement...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="relative min-h-screen flex items-center justify-center">
                <Suspense fallback={<div className="h-16"></div>}>
                    <HeaderWithScroll />
                </Suspense>
                <div>Redirection...</div>
                <Footer />
            </div>
        );
    }
    return (
        <div className="relative min-h-screen flex flex-col">
            <Suspense fallback={<div className="h-16"></div>}>
                <HeaderWithScroll />
            </Suspense>

            <main className="flex-grow pt-24 pb-16">
                <div className="container mx-auto max-w-7xl px-4 md:px-6">
                    <Breadcrumb 
                        items={[
                        { label: "Accueil", href: "/" },
                        { label: "Suivi de commande" }
                        ]} 
                    />

                    <h1 className="font-['Archive'] text-4xl font-bold text-green-700 mt-8 mb-12">
                        MES COMMANDES
                    </h1>

                    {isLoadingPurchases ? (
                        <div className="flex justify-center items-center h-40">
                            <p className="text-gray-500">Chargement des commandes...</p>
                        </div>
                    ) : purchases.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-gray-600">Vous n'avez pas encore passé de commande.</p>
                        </div>
                    ) : (
                        <Accordion type="single" collapsible className="w-full space-y-4">
                            {purchases.map(p => (
                                <AccordionItem key={p.id} value={`item-${p.id}`} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                                    <AccordionTrigger className="px-4 md:px-6 py-4 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-t-lg">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full text-left">
                                            <div className="mb-2 md:mb-0">
                                                <span className="text-lg font-semibold text-gray-800">Commande #{p.id}</span>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {p.date ? new Date(p.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date inconnue'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-md font-semibold text-gray-900">
                                                    Total: {p.total ? `${p.total.toFixed(2)}€` : 'N/A'}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Statut: <span className="font-medium">{p.status || 'Inconnu'}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="px-4 md:px-6 pb-6 pt-4 border-t border-gray-200">
                                        <h3 className="text-md font-semibold text-gray-700 mb-4">Articles commandés</h3>
                                        <ul className="space-y-4">
                                            {p.PurchaseProduct && p.PurchaseProduct.length > 0 ? (
                                                p.PurchaseProduct.map(item => (
                                                    <li key={item.id} className="flex items-start space-x-4 text-sm">
                                                        <Image 
                                                            src={item.Product?.Image?.[0]?.url || '/product.png'} 
                                                            alt={item.Product?.name || 'Produit'} 
                                                            width={48}
                                                            height={48}
                                                            className="w-12 h-12 object-cover rounded border border-gray-200 flex-shrink-0"
                                                        />
                                                        <div className="flex-grow">
                                                            <span className="font-medium text-gray-800 block">{item.Product?.name || 'Produit inconnu'}</span>
                                                        </div>
                                                        <div className="text-right flex-shrink-0 ml-4">
                                                            <span className="text-gray-600 block">Quantité: {item.quantity}</span>
                                                            {item.Product?.price && 
                                                                <span className="text-gray-800 block">{item.Product.price.toFixed(2)}€</span>
                                                            }
                                                        </div>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-gray-500 text-sm">Aucun détail d'article disponible.</li>
                                            )}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}