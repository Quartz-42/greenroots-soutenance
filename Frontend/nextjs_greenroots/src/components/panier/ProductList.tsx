'use client'

import ProductSummary from "@/components/products/ProductSummary"
import type { CartItem } from "@/context/CartContext"

interface ProductListProps {
  cartItems: CartItem[];
  isCartEmpty: boolean;
}

export default function ProductList({ cartItems, isCartEmpty }: ProductListProps) {
  return (
    <div className="lg:col-span-2 space-y-4">
      {isCartEmpty ? (
        <p className="text-gray-600">Vous n'avez aucun article dans votre panier.</p>
      ) : (
        cartItems.map((product) => (
          <ProductSummary
            key={product.id}
            id={product.id}
            title={product.title || ''}
            description={product.description || ''}
            price={product.price || 0}
            quantity={product.quantity}
            imageUrl={product.imageUrl || ''}
          />
        ))
      )}
    </div>
  );
}
