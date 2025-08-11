import { useRef } from "react"

import { useCart } from "@/contexts/cart"
import { formatPriceNumber } from "@/lib/format-price-number"

import { InputNumber } from "./input-number"

interface ProductCartProps {
  product: {
    id: string
    restaurantId: string
    name: string
    description: string
    image: string | null
    price: number
    quantity: number
  }
}

export function ProductCart({ product }: ProductCartProps) {
  const { addToCart, restaurant, removeToCart } = useCart()

  const inputRef = useRef({} as HTMLInputElement)

  function handleChangeQuantity(quantity: number) {
    if (product.quantity === 1 && quantity <= 0) {
      return removeToCart(product.id)
    }

    addToCart({
      restaurant,
      item: {
        ...product,
        quantity,
      },
    })
  }

  return (
    <div className="flex items-center gap-2">
      <img
        src={product.image ?? "/hamburger.webp"}
        alt={product.name}
        className="size-16 object-contain rounded-md"
      />

      <div className="leading-0">
        <p className="text-sm font-bold line-clamp-2">{product.name}</p>
        <span className="text-sm font-bold block mt-1">
          {formatPriceNumber(product.price)}
        </span>
      </div>

      <div className="self-center ml-auto">
        <InputNumber
          ref={inputRef}
          defaultValue={product.quantity}
          onDecrement={() => {
            inputRef.current.stepDown()
            handleChangeQuantity(-1)
          }}
          onIncrement={() => {
            inputRef.current.stepUp()
            handleChangeQuantity(1)
          }}
          containerClassName="text-primary bg-accent border-accent"
          className="text-primary"
        />
      </div>
    </div>
  )
}
