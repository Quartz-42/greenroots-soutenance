'use client'

import Image from "next/image"
import { Button } from "@/components/ui/button"

import { useCart } from "@/context/CartContext"

interface ProductSummaryProps {
  title: string
  description: string
  price: number
  quantity: number
  imageUrl: string
}

export default function ProductSummary({
  title,
  description,
  price,
  quantity,
  imageUrl,

}: ProductSummaryProps) {

  const { updateCartItem, removeFromCart } = useCart()

  return (
    <div className="flex gap-6 p-6 border rounded-lg">
      {/* Image du produit */}
      <div className="relative w-32 h-32 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="128px"
          className="object-cover rounded-xs"
        />
      </div>

      {/* Informations du produit */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {description}
            </p>
          </div>
          <span className="text-lg font-bold">
            {price}€
          </span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <button 
              className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
              onClick={() => removeFromCart?.({ title, description, price, imageUrl, quantity})}                
              >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Retirer
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8"
                onClick={() => updateCartItem?.({ title, description, price, imageUrl, quantity: quantity - 1 })}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button 
                variant="outline" 
                size="icon"
                className="h-8 w-8"
                onClick={() => updateCartItem?.({ title, description, price, imageUrl, quantity: quantity + 1 })}                
              >
                +
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 