"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// Données des catégories d'arbres avec images
const treeCategories = [
  {
    id: 1,
    name: "Pinaceae",
    description: "Famille des pins, sapins et épicéas",
    image: "/trees/sapin.jpg",
    overlay: "from-green-800/30 to-green-600/30",
    slug: "pinaceae",
  },
  {
    id: 2,
    name: "Fagaceae",
    description: "Famille des chênes et hêtres",
    image: "/trees/fagaceae.jpg",
    overlay: "from-green-700/30 to-yellow-600/30",
    slug: "fagaceae",
  },
  {
    id: 3,
    name: "Betulaceae",
    description: "Famille des bouleaux et aulnes",
    image: "/trees/betulaceae.jpg",
    overlay: "from-green-600/30 to-emerald-400/30",
    slug: "betulaceae",
  },
  {
    id: 4,
    name: "Sapindaceae",
    description: "Famille des érables",
    image: "/trees/erable.jpg",
    overlay: "from-emerald-700/30 to-red-500/30",
    slug: "sapindaceae",
  },
  {
    id: 5,
    name: "Cupressaceae",
    description: "Famille des cyprès et genévriers",
    image: "/trees/cypres.jpg",
    overlay: "from-teal-700/30 to-teal-500/30",
    slug: "cupressaceae",
  },
  {
    id: 6,
    name: "Salicaceae",
    description: "Famille des saules et peupliers",
    image: "/trees/sapin.jpg", // Image de remplacement
    overlay: "from-green-600/30 to-lime-400/30",
    slug: "salicaceae",
  },
  {
    id: 7,
    name: "Rosaceae",
    description: "Famille des arbres fruitiers",
    image: "/trees/fruitier.jpg",
    overlay: "from-green-600/30 to-pink-400/30",
    slug: "rosaceae",
  },
  {
    id: 8,
    name: "Oleaceae",
    description: "Famille des frênes et oliviers",
    image: "/trees/olivier.jpg",
    overlay: "from-green-700/30 to-blue-500/30",
    slug: "oleaceae",
  },
];

export default function CategoryCarousel() {
  const [api, setApi] = React.useState<any>(null)
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <section className="pt-8 bg-white w-full">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 mb-8">
        <h2 className="font-['Archive'] text-3xl font-bold text-green-700">Découvrir nos produits</h2>
      </div>
      
      <div className="w-full">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          setApi={setApi}
          className="w-full relative"
        >
          <CarouselContent className="-ml-4">
            {treeCategories.map((category) => (
              <CarouselItem key={category.id} className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-[28%]">
                <Link href={`/categories/${category.slug}`} className="block h-full">
                  <div className="relative h-[70vh] overflow-hidden transition-all duration-300 hover:shadow-lg border-0">
                    {/* Image de fond */}
                    <div className="absolute inset-0 w-full h-full">
                      <Image 
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                        priority={category.id <= 3}
                      />
                    </div>
                    
                    {/* Overlay de dégradé subtil */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.overlay} mix-blend-multiply`} />
                    
                    {/* Overlay sombre en bas pour le texte */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                    
                    {/* Contenu texte en bas de l'image */}
                    <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                      <p className="text-sm text-white/80">{category.description}</p>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 hover:bg-white border-green-200 z-20" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 hover:bg-white border-green-200 z-20" />
        </Carousel>
      </div>
    </section>
  )
} 