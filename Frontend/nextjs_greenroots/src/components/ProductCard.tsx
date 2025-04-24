import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-toastify";

interface ProductCardProps {
  id: number;
  name: string;
  short_description: string;
  price: number;
  imageUrl: string;
}

export default function ProductCard({
  id,
  name,
  short_description,
  price,
  imageUrl,
}: ProductCardProps) {
  const { addToCart, cartItems } = useCart();

  const handleAddToCart = () => {
    console.log("handleAddToCart triggered");
    try {
      addToCart({
        id,
        title: name,
        price,
        quantity: 1,
        imageUrl,
        description: short_description,
      });
      console.log("TOAST");
      toast.success("Produit ajouté au panier avec succès !");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Erreur lors de l'ajout du produit au panier.");
    }
  };

  return (
    <div className="rounded-xs border border-gray-200 bg-white shadow-xs overflow-hidden">
      <div className="relative h-70">
        <Link href={`/liste/product/${id}`} className="block h-full relative">
          <Image
            src={imageUrl}
            alt={name}
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
          {name}
        </Link>
        <p className="text-gray-500 line-clamp-2">{short_description}</p>
        <div className="flex items-center justify-between gap-4">
          <p className="text-md font-extrabold leading-tight text-gray-900">
            {price.toFixed(2)}€
          </p>
          <Button onClick={handleAddToCart}>
            <ShoppingCart className={"mr-1"} height={18} />
            Ajouter
          </Button>
        </div>
      </div>
    </div>
  );
}
