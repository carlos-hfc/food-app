import { HeartIcon } from "lucide-react"
import { Link } from "react-router"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FavoriteItemProps {
  favorite: {
    id: string
    restaurant: string
    tax: number
    deliveryTime: number
    image: string | null
    category: string
    weekday: number
    open: boolean
    openedAt: string
    closedAt: string
    isOpen: boolean
    openingAt?: string
  }
}

export function FavoriteItem({ favorite }: FavoriteItemProps) {
  return (
    <Link
      to="/"
      className="flex items-center gap-2 hover:shadow-md rounded-md px-4 py-2"
    >
      <img
        src={favorite.image ?? "/hamburger.webp"}
        alt={favorite.restaurant}
        className="rounded-full size-24 object-contain"
      />

      <div className="flex flex-col">
        <p className="font-semibold">{favorite.restaurant}</p>
        <span className="text-muted-foreground text-sm">
          {favorite.category}
        </span>
        <div className="text-sm text-muted-foreground mt-2">
          <span>
            {favorite.deliveryTime}-{favorite.deliveryTime + 10} min
          </span>{" "}
          -{" "}
          <span className={cn(favorite.tax === 0 && "text-green-600")}>
            {favorite.tax === 0
              ? "Grátis"
              : favorite.tax.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
          </span>
        </div>
      </div>

      <Button
        size="icon"
        variant="outline"
        className="ml-auto self-center"
        aria-label="Restaurante favoritado"
      >
        <HeartIcon className="size-6 fill-primary stroke-primary shrink-0" />
      </Button>
    </Link>
  )
}
