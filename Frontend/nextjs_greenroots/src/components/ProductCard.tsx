import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from 'react-toastify';

interface ProductCardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
}

export default function ProductCard({
  id,
  title,
  description,
  price,
  imageUrl,
}: ProductCardProps) {
  const { addToCart, cartItems } = useCart();



  const handleAddToCart = () => {
    try {
    addToCart({
      id,
      title,
      price,
      quantity: 1,
      imageUrl,
      description,
    })
    toast("Produit ajouter au panier avec succès!");

  } catch (error) {
    console.error("Error adding to cart:", error);
  }
  }


  return (
    <div className="rounded-xs border border-gray-200 bg-white shadow-xs overflow-hidden">
      <div className="relative h-70">
        <Link href={`/liste/product/${id}`}  className="block h-full relative">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover"
          />
        </Link>
      </div>
      <div className="p-4 space-y-4">
        <Link
          href={`/liste/product/${id}`}
          className="text-lg font-semibold leading-tight text-gray-900 hover:underline block"
        >
          {title}
        </Link>
        <p className="text-gray-500 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between gap-4">
          <p className="text-md font-extrabold leading-tight text-gray-900">
            {price.toFixed(2)}€
          </p>
          <Button
            onClick={handleAddToCart}
          >
            <ShoppingCart className={"mr-1"} height={18} />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}
