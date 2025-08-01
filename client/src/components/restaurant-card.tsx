import { StarIcon } from "lucide-react"
import { Link } from "react-router"

import { cn } from "@/lib/utils"

interface RestaurantCardProps {
  restaurant: {
    id: string
    category: string
    name: string
    image: string | null
    tax: number
    deliveryTime: number
    grade: number
    isOpen: boolean
    openingAt?: string
  }
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link
      key={restaurant.id}
      to={`/restaurantes/${restaurant.id}`}
      className={cn(
        "flex items-center gap-2 md:gap-4 hover:shadow-md rounded-md p-2 lg:p-3",
        !restaurant.isOpen && "saturate-0",
      )}
    >
      <img
        src={restaurant.image ?? "/hamburger.webp"}
        alt={restaurant.name}
        className="rounded-md max-w-32"
      />

      <div className="space-y-1">
        <p className="text-base font-bold line-clamp-1">{restaurant.name}</p>

        <div className="flex items-center text-xs">
          <div className="flex items-center gap-1">
            <StarIcon className="size-3 shrink-0 stroke-yellow-500 fill-yellow-500" />{" "}
            <span className="text-xs text-yellow-500 font-bold">
              {restaurant.grade !== 0
                ? restaurant.grade.toFixed(2)
                : "Novidade"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {" "}
            - {restaurant.category}
          </span>
        </div>

        <div className="text-sm text-muted-foreground">
          {restaurant.isOpen ? (
            <>
              <span>
                {restaurant.deliveryTime}-{restaurant.deliveryTime + 10} min -
              </span>{" "}
              <span className={cn(restaurant.tax === 0 && "text-green-600")}>
                {restaurant.tax === 0
                  ? "Grátis"
                  : restaurant.tax.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
              </span>
            </>
          ) : (
            <span>Fechado</span>
          )}
        </div>
      </div>
    </Link>
  )
}
