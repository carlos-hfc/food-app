import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"

import { getMenu } from "@/http/get-menu"

import { Info } from "./info"
import { ProductCard } from "./product-card"
import { ProductCardSkeleton } from "./product-card-skeleton"

export function Restaurant() {
  const { restaurantId } = useParams() as { restaurantId: string }

  const { data: menu } = useQuery({
    queryKey: ["restaurant-menu", restaurantId],
    queryFn: () => getMenu({ restaurantId }),
  })

  return (
    <div className="flex flex-col gap-6">
      <div className="relative h-96 overflow-hidden -mx-4 lg:mx-0 -mt-6">
        <div className="absolute bg-[url(/banner.jpg)] h-full w-full bg-no-repeat bg-cover bg-position-[center_bottom_50px] bg-fixed" />
      </div>

      <Info />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menu ? (
          menu?.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))
        ) : (
          <ProductCardSkeleton />
        )}
      </div>
    </div>
  )
}
