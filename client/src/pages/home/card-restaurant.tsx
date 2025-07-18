import { BadgeCheckIcon } from "lucide-react"

interface CardRestaurantProps {
  restaurant: {
    id: string
    name: string
    category: string
    image: string | null
  }
}

export function CardRestaurant({ restaurant }: CardRestaurantProps) {
  return (
    <div className="border rounded-md flex items-center gap-2 py-8 px-3 relative flex-1">
      <BadgeCheckIcon className="absolute size-6 right-3 top-3 fill-primary stroke-background" />

      <img
        src={restaurant.image ?? "hamburger.webp"}
        alt={restaurant.name}
        className="max-w-24"
      />

      <div>
        <p className="font-medium text-sm leading-none">{restaurant.name}</p>
        <span className="text-muted-foreground text-xs">
          {restaurant.category}
        </span>
      </div>
    </div>
  )
}
