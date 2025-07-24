import { Link } from "react-router"

interface BestRestaurantsCardProps {
  restaurant: {
    id: string
    name: string
    image: string | null
  }
}

export function BestRestaurantsCard({ restaurant }: BestRestaurantsCardProps) {
  return (
    <Link
      to={`/restaurante/${restaurant.id}`}
      className="flex flex-col md:flex-row flex-1 items-center gap-2 py-3 px-2 hover:shadow-md transition-all rounded-md relative"
    >
      <img
        src={restaurant.image ?? "hamburger.webp"}
        alt={restaurant.name}
        className="max-w-16"
      />

      <p className="font-semibold text-xs lg:text-sm text-center md:text-left">
        {restaurant.name}
      </p>
    </Link>
  )
}
