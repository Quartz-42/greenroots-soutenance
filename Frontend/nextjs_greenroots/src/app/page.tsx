import HeaderWithScroll from "@/components/header/HeaderWithScroll";
import { Suspense } from "react";
import CategoryCarousel from "@/components/CategoryCarousel";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import BestSellers from "@/components/BestSellers";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="relative h-[100vh] w-full overflow-hidden bg-[url(/banner2.png)] bg-no-repeat bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent"></div>

        <div className="absolute inset-0 flex items-center">
          <div className="container mx-auto px-4 md:px-6">
            <div className="w-full md:w-2/3 lg:w-2/3 space-y-12 md:space-y-6">
              <h1 className="font-['Archive'] text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight tracking-wide">
                GREENROOTS
              </h1>
              <p className="text-white font-medium text-base sm:text-lg md:text-xl lg:text-2xl max-w-xl">
                Nous sommes une société engagée dans la vente d'arbres de
                qualité et la participation active à la reforestation.
              </p>
              <p className="text-white font-medium text-base sm:text-lg md:text-xl lg:text-2xl max-w-xl mb-6 md:mb-8">
                Chaque arbre planté est un pas vers un avenir plus vert.
              </p>
              {/* <Button className="text-base md:text-lg px-6 py-3">
                A propos
              </Button> */}
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={<div className="h-16"></div>}>
        <HeaderWithScroll />
      </Suspense>
      <div className="relative -mt-24 z-10 w-full">
        <CategoryCarousel />
      </div>
      <HeroSection />
      <BestSellers />

      {/* Navigation temporaire */}
      {/* <div className="container mx-auto max-w-7xl px-4 md:px-6 py-8">
        <div className="p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Navigation temporaire</h2>
          <div className="flex flex-col space-y-2">
            <a
              href="/panier"
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              → Page Panier
            </a>
            <a
              href="/liste"
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              → Page Liste des produits
            </a>
            <a
              href="/liste/product"
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              → Page Détail produit
            </a>
            <a
              href="/checkout"
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              → Page Checkout
            </a>
            <a
              href="/recapitulatif"
              className="text-green-600 hover:text-green-700 hover:underline"
            >
              → Page Récapitulatif
            </a>
            <a
              href="/500"
              className="text-red-600 hover:text-red-700 hover:underline"
            >
              → Page Erreur 500
            </a>
          </div>
        </div>
      </div> */}

      <Footer />
    </div>
  );
}
