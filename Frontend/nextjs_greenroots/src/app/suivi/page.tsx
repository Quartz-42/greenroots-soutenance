'use client'

import { PurchaseDetails } from "@/utils/interfaces/purchase.interface";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import HeaderWithScroll from "@/components/HeaderWithScroll";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import AccordionSuivi from "@/components/suivi/AccordionSuivi";
import { fetchUserPurchases } from "@/utils/functions/suivi.function";

export default function SuiviPage() {
    const [ purchases, setPurchases ] = useState<PurchaseDetails[]>([]);
    const [ isLoadingPurchases, setIsLoadingPurchases ] = useState(true);
    
    const { user, isLoading: isLoadingAuth } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (isLoadingAuth) {
            return;
        }

        if (!user || !user.id) {
            toast.info("Veuillez vous connecter pour voir vos commandes.");
            router.push("/");
            return;
        }

        fetchUserPurchases({
            userId: user.id,
            setPurchases,
            setIsLoadingPurchases,
            router
        });

    }, [isLoadingAuth, user, router]);

    if (isLoadingAuth) {
        return (
            <div className="relative min-h-screen flex items-center justify-center">
                <div>Chargement...</div>
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

                    <AccordionSuivi purchases={purchases} isLoadingPurchases={isLoadingPurchases} />
                </div>
            </main>

            <Footer />
        </div>
    );
}