import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {ShoppingCart} from 'lucide-react';


interface ProductCardProps {
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function ProductCard({ title, description, price, imageUrl }: ProductCardProps) {
  return (
    <div className="rounded-xs border border-gray-200 bg-white shadow-xs overflow-hidden">
      <div className="relative h-70">
        <Link href="#" className="block h-full">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        </Link>
      </div>
      <div className="p-4 space-y-4">
        <Link 
          href="#"
          className="text-lg font-semibold leading-tight text-gray-900 hover:underline block"
        >
          {title}
        </Link>
        <p className="text-gray-500 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between gap-4">
          <p className="text-md font-extrabold leading-tight text-gray-900">{price.toFixed(2)}€</p>
          <Button> <ShoppingCart  className={'mr-1'}  height={18}/>
            Ajouter</Button>
        </div>
      </div>
    </div>
  );
} 