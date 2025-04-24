'use client'

import Image from "next/image"

interface ProductCheckoutProps {
  title: string
  description: string
  price: number
  quantity: number
  imageUrl: string
}

export default function ProductCheckout({
  title,
  description,
  price,
  quantity,
  imageUrl
}: ProductCheckoutProps) {
  return (
    <div className="flex gap-4 py-4">
      {/* Image du produit */}
      <div className="relative w-24 h-24 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="96px"
          className="object-cover rounded-lg"
        />
      </div>

      {/* Informations du produit */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between">
          <div>
            <h3 className="text-base font-medium">{title}</h3>
            <p className="text-sm text-gray-500 line-clamp-1 mt-1">
              {description}
            </p>
          </div>
          <div className="text-right">
            <span className="text-base font-medium">
              {price}€
            </span>
            <p className="text-sm text-gray-500 mt-1">
              Quantité : {quantity}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 