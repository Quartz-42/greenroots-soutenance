'use client'

import HeaderWithScroll from "@/components/HeaderWithScroll"
import { Suspense } from "react"
import Footer from "@/components/Footer"
import Breadcrumb from "@/components/Breadcrumb"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import BestSellers from "@/components/BestSellers";

import { Product } from "@/utils/interfaces/products.interface";
import { useFetch } from "@/hooks/useFetch"

export default function ProductPage() {
  const { data: products, loading, error } = useFetch<Product[]>('products/1');

  console.log(products);  

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
              { label: "Liste des produits", href: "/liste" },
              { label: "Arbre violet" }
            ]} 
          />

          <h1 className="font-['Archive'] text-4xl font-bold text-green-700 mt-8 mb-12">
            ARBRES VIOLET
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {/* Image du produit */}
            <div className="relative aspect-square rounded-sm overflow-hidden bg-gray-100">
              <Image
                src="/trees/sapin.jpg"
                alt="Arbre violet"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>

            {/* Informations du produit */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                Arbre violet
              </h2>
              <div className={'flex justify-between items-center'}>
                <div className="text-3xl font-bold mb-6">
                  380,00 € TTC
                </div>
                <div className="mb-8 flex items-center ">
                  <p className="text-sm ">Paiement sécurisé avec</p>
                  <div className="flex gap-2">
                    <Image
                        src="/stripe.png"
                        alt="stripe"
                        width={140}
                        height={40}
                        className="object-contain w-auto h-auto"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Quantité</span>
                  <Select defaultValue="1">
                    <SelectTrigger className="w-[80px]">
                      <SelectValue placeholder="1"/>
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button>
                  Ajouter au panier
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t">
                <h3 className="text-xl font-semibold mb-4">Caractéristiques</h3>
                <p className="text-gray-600 mb-4">
                  Studio quality three mic array for crystal clear calls and voice recordings. Six-speaker sound system
                  for a
                  remarkably robust and high-quality audio experience. Up to 256GB of ultrafast SSD storage.
                </p>
                <p className="text-gray-600">
                  Two Thunderbolt USB 4 ports and up to two USB 3 ports. Ultrafast Wi-Fi 6 and Bluetooth 5.0 wireless.
                  Color
                  matched Magic Mouse with Magic Keyboard or Magic Keyboard with Touch ID.
                </p>
              </div>
            </div>
          </div>
        </div>
        <BestSellers/>
      </main>

      <Footer/>
    </div>
  )
} 