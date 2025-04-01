'use client'

import HeaderWithScroll from "@/components/HeaderWithScroll"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Suspense } from "react"

export default function Error500Page() {
  return (
    <div className="relative min-h-screen">
      <div className="relative h-screen w-full bg-[url(/500.png)] bg-no-repeat bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40"></div>
        
        <Suspense fallback={<div className="h-16"></div>}>
          <HeaderWithScroll />
        </Suspense>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-red-600 font-['Archive'] text-9xl font-bold mb-8">
            500
          </h1>
          <p className="text-white text-2xl mb-12 text-center max-w-md">
            Une erreur est survenue sur notre serveur
          </p>
          <Button 
            variant="destructive" 
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white"
            asChild
          >
            <Link href="/">
              Retour à l'accueil
            </Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
} 