import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Product } from "@/utils/interfaces/products.interface";

interface ProductInfoProps {
  product: Product | null;
  quantity: number;
  setQuantity: (quantity: number) => void;
  handleAddToCart: () => void;
}

function ProductInfo({ product, quantity, setQuantity, handleAddToCart }: ProductInfoProps) {
  if (!product) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{product?.name}</h2>
      <div className={"flex justify-between items-center"}>
        <div className="text-3xl font-bold mb-6">
          {product?.price} €
        </div>
        <div className="mb-8 flex items-center ">
          <p className="text-sm ">Paiement sécurisé avec</p>
          <div className="flex gap-2">
            <Image
              src="/stripe.webp"
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
          <Select
            value={quantity.toString()}
            onValueChange={(value) => setQuantity(parseInt(value, 10))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="1" />
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
        <Button
          onClick={handleAddToCart}
          className="bg-green-700 text-white hover:bg-green-800 pointer"
        >
          Ajouter au panier
        </Button>
      </div>

      <div className="mt-8 pt-8 border-t">
        <h3 className="text-xl font-semibold mb-4">Caractéristiques</h3>
        <p className="text-gray-600 mb-4 max-h-56 overflow-auto">
          {product?.detailed_description}
        </p>
      </div>
    </div>
  );
}

export default ProductInfo;