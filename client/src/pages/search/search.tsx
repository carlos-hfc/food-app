import { useQuery } from "@tanstack/react-query"
import { Navigate, useSearchParams } from "react-router"

import { RestaurantCard } from "@/components/restaurant-card"
import { RestaurantCardSkeleton } from "@/components/restaurant-card-skeleton"
import { RestaurantFilters } from "@/components/restaurant-filters"
import { Seo } from "@/components/seo"
import { listRestaurants } from "@/http/list-restaurants"

import { SearchNotFound } from "./search-not-found"

export function Search() {
  const [searchParams] = useSearchParams()

  const name = searchParams.get("q")
  const tax = searchParams.get("tax")
  const deliveryTime = searchParams.get("deliveryTime")
  const rate = searchParams.get("rate")
  const category = searchParams.get("category")

  const { data: restaurants, isLoading: isLoadingRestaurants } = useQuery({
    queryKey: ["restaurants", name, category, tax, deliveryTime, rate],
    queryFn: () =>
      listRestaurants({
        name,
        category,
        tax,
        deliveryTime,
        rate,
      }),
  })

  if (!name) {
    return (
      <Navigate
        to="/restaurantes"
        replace
      />
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Seo title={`Busca por "${name}"`} />

      <h1 className="text-xl lg:text-2xl font-bold">
        Resultados da busca por <q className="text-primary">{name}</q>
      </h1>

      <RestaurantFilters />

      {isLoadingRestaurants ? (
        <RestaurantCardSkeleton />
      ) : restaurants && restaurants.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {restaurants?.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
      ) : (
        <SearchNotFound />
      )}
    </div>
  )
}
