import { formatPriceNumber } from "@/lib/format-price-number"

interface CheckoutItemProps {
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

export function CheckoutItem({ product }: CheckoutItemProps) {
  return (
    <div className="flex gap-2">
      <img
        src={product.image ?? "/hamburger.webp"}
        alt={product.name}
        className="size-16 object-contain rounded-md"
      />

      <div className="leading-0">
        <p className="text-sm font-bold line-clamp-2">{product.name}</p>
        <span className="text-xs text-muted-foreground line-clamp-1">
          {product.description}
        </span>
        <span className="text-sm font-bold block mt-1">
          {formatPriceNumber(product.price)}
        </span>
      </div>
    </div>
  )
}
