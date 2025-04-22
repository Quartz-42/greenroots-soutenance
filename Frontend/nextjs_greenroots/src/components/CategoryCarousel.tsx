"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Category } from "@/utils/interfaces/category.interface";
import { useFetch } from "@/hooks/useFetch";

export default function CategoryCarousel() {
  const [api, setApi] = React.useState<any>(null);
  const {
    data: categories = [],
    loading,
    error,
  } = useFetch<Category[]>("categories");

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        Error: {error.message}
      </div>
    );
  }

  return (
    <section className="pt-8 bg-white w-full">
      <div className="container mx-auto max-w-7xl px-4 md:px-6 mb-8">
        <h2 className="font-['Archive'] text-3xl font-bold text-green-700">
          Découvrir nos produits
        </h2>
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
            {categories &&
              categories.map((category: Category) => (
                <CarouselItem
                  key={category.id}
                  className="pl-4 sm:basis-1/2 md:basis-1/3 lg:basis-[28%]"
                >
                  <Link href={`liste`} className="block h-full">
                    <div className="relative h-[70vh] overflow-hidden transition-all duration-300 hover:shadow-lg border-0">
                      <div className="absolute inset-0 w-full h-full">
                        <Image
                          src={category.image ?? "/banner3.png"}
                          alt={category.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">
                          {category.name}
                        </h3>
                        <p className="text-sm text-white/80 italic">
                          {category.description ?? "Aucune description fournie"}
                        </p>
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
  );
}
