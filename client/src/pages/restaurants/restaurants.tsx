import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"

import { RestaurantCard } from "@/components/restaurant-card"
import { RestaurantCardSkeleton } from "@/components/restaurant-card-skeleton"
import { RestaurantFilters } from "@/components/restaurant-filters"
import { Seo } from "@/components/seo"
import { getBestRestaurants } from "@/http/get-best-restaurants"
import { listCategories } from "@/http/list-categories"
import { listRestaurants } from "@/http/list-restaurants"

import { BestRestaurantsCard } from "./best-restaurants-card"
import { BestRestaurantsCardSkeleton } from "./best-restaurants-card-skeleton"
import { CategoryCard } from "./category-card"
import { CategoryCardSkeleton } from "./category-card-skeleton"

export function Restaurants() {
  const [searchParams] = useSearchParams()

  const category = searchParams.get("category")
  const name = searchParams.get("name")
  const tax = searchParams.get("tax")
  const deliveryTime = searchParams.get("deliveryTime")
  const rate = searchParams.get("rate")

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants", name, category, tax, deliveryTime, rate],
    queryFn: () => listRestaurants({ name, category, tax, deliveryTime, rate }),
  })

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories({}),
    staleTime: Infinity,
  })

  const { data: bestRestaurants } = useQuery({
    queryKey: ["best-restaurants"],
    queryFn: getBestRestaurants,
  })

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Restaurantes" />

      {categories ? (
        <div className="space-y-3">
          <span className="text-xl lg:text-2xl block font-bold">
            Conheça as categorias
          </span>

          <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hidden">
            {categories?.map(category => (
              <CategoryCard
                key={category.id}
                category={category}
              />
            ))}
          </div>
        </div>
      ) : (
        <CategoryCardSkeleton />
      )}

      {bestRestaurants ? (
        <div className="space-y-3 py-6">
          <span className="text-xl lg:text-2xl block font-bold">
            Os melhores no food.app
          </span>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto py-2 scrollbar-hidden">
            {bestRestaurants?.map(restaurant => (
              <BestRestaurantsCard
                key={restaurant.id}
                restaurant={restaurant}
              />
            ))}
          </div>
        </div>
      ) : (
        <BestRestaurantsCardSkeleton />
      )}

      <div className="space-y-3 py-6">
        <RestaurantFilters />

        {restaurants ? (
          <>
            <span className="text-xl lg:text-2xl block font-bold">Lojas</span>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {restaurants?.map(restaurant => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                />
              ))}
            </div>
          </>
        ) : (
          <RestaurantCardSkeleton />
        )}
      </div>
    </div>
  )
}
