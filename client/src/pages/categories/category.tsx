import { useQuery } from "@tanstack/react-query"
import { Navigate, useParams, useSearchParams } from "react-router"

import { RestaurantCard } from "@/components/restaurant-card"
import { RestaurantCardSkeleton } from "@/components/restaurant-card-skeleton"
import { RestaurantFilters } from "@/components/restaurant-filters"
import { Seo } from "@/components/seo"
import { ListCategoriesResponse } from "@/http/list-categories"
import { listRestaurants } from "@/http/list-restaurants"
import { queryClient } from "@/lib/react-query"

export function Category() {
  const [searchParams] = useSearchParams()
  const { categoryId } = useParams() as { categoryId: string }

  const cache = queryClient.getQueryData<ListCategoriesResponse>(["categories"])

  const category = cache?.find(cat => cat.id === categoryId)

  const name = searchParams.get("name")
  const tax = searchParams.get("tax")
  const deliveryTime = searchParams.get("deliveryTime")
  const grade = searchParams.get("grade")

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants", name, category?.name, tax, deliveryTime, grade],
    queryFn: () =>
      listRestaurants({
        name,
        category: category?.name,
        tax,
        deliveryTime,
        grade,
      }),
  })

  if (!category)
    return (
      <Navigate
        to="/restaurantes"
        replace
      />
    )

  return (
    <div className="flex flex-col gap-6">
      <Seo title={category.name} />

      <h1 className="text-xl lg:text-2xl font-bold">{category.name}</h1>

      <RestaurantFilters />

      {restaurants ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {restaurants?.map(restaurant => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
      ) : (
        <RestaurantCardSkeleton />
      )}
    </div>
  )
}
