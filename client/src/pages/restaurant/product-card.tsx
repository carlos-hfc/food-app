import { useQuery } from "@tanstack/react-query"
import { ShoppingCartIcon } from "lucide-react"
import { useRef } from "react"

import { InputNumber } from "@/components/input-number"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart"
import { getRestarauntInfo } from "@/http/get-restaurant-info"

interface ProductCardProps {
  product: {
    id: string
    restaurantId: string
    name: string
    description: string
    price: number
    image: string | null
  }
  closedRestaurant?: boolean
}

export function ProductCard({ product, closedRestaurant }: ProductCardProps) {
  const { data: result } = useQuery({
    queryKey: ["restaurant-info", product.restaurantId],
    queryFn: () => getRestarauntInfo({ restaurantId: product.restaurantId }),
  })

  const { addToCart } = useCart()

  const inputRef = useRef({} as HTMLInputElement)

  function handleAddToCart() {
    const quantity = Number(inputRef.current.value)

    if (quantity <= 0 || closedRestaurant) return

    addToCart({
      item: {
        ...product,
        quantity,
      },
      restaurant: result?.restaurant ?? null,
    })

    inputRef.current.value = "0"
  }

  return (
    <div className="flex flex-col border rounded-md space-y-3 p-3 hover:shadow-2xs transition-all">
      <div className="flex justify-between gap-4">
        <div className="flex flex-col gap-3">
          <p className="font-bold md:text-lg line-clamp-2 leading-snug">
            {product.name}
          </p>
          <span className="text-sm text-muted-foreground leading-tight line-clamp-3">
            {product.description}
          </span>
        </div>

        <img
          src={product.image ?? "/hamburger.webp"}
          alt={product.name}
          className="max-w-24 max-h-24 md:max-w-32 md:max-h-32 lg:max-w-36 lg:max-h-36 self-center shrink-0 object-cover rounded-md"
        />
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between">
        <span className="text-green-600 font-semibold">
          {product.price.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>

        <div
          className="flex gap-1"
          hidden={closedRestaurant}
        >
          <InputNumber
            ref={inputRef}
            defaultValue={0}
            onDecrement={() => inputRef.current.stepDown()}
            onIncrement={() => inputRef.current.stepUp()}
          />

          <Button
            size="icon"
            onClick={handleAddToCart}
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCartIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
