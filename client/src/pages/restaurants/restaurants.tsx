import { useQuery } from "@tanstack/react-query"
import { StarIcon } from "lucide-react"
import { Link, useSearchParams } from "react-router"

import { getBestRestaurants } from "@/http/get-best-restaurants"
import { listCategories } from "@/http/list-categories"
import { listRestaurants } from "@/http/list-restaurants"
import { cn } from "@/lib/utils"

import { BestRestaurantsCard } from "./best-restaurants-card"
import { BestRestaurantsCardSkeleton } from "./best-restaurants-card-skeleton"
import { CategoryCard } from "./category-card"
import { CategoryCardSkeleton } from "./category-card-skeleton"
import { RestaurantFilters } from "./restaurant-filters"

export function Restaurants() {
  const [searchParams] = useSearchParams()

  const category = searchParams.get("category")
  const name = searchParams.get("name")
  const tax = searchParams.get("tax")
  const deliveryTime = searchParams.get("deliveryTime")
  const grade = searchParams.get("grade")

  const { data: restaurants } = useQuery({
    queryKey: ["restaurants", name, category, tax, deliveryTime, grade],
    queryFn: () =>
      listRestaurants({ name, category, tax, deliveryTime, grade }),
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

          <div className="flex gap-4 overflow-x-auto py-2 scrollbar-hidden">
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

        <span className="text-xl lg:text-2xl block font-bold">Lojas</span>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {restaurants?.map(restaurant => (
            <Link
              key={restaurant.id}
              to={`/restaurante/${restaurant.id}`}
              className="flex items-center gap-2 md:gap-4 hover:shadow-md rounded-md p-2 lg:p-3"
            >
              <img
                src={restaurant.image ?? "/hamburger.webp"}
                alt={restaurant.name}
                className="rounded-md max-w-32"
              />

              <div className="space-y-1">
                <p className="text-base font-bold line-clamp-1">
                  {restaurant.name}
                </p>

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
                  <span>
                    {restaurant.deliveryTime}-{restaurant.deliveryTime + 10} min
                    -
                  </span>{" "}
                  <span
                    className={cn(restaurant.tax === 0 && "text-green-600")}
                  >
                    {restaurant.tax === 0
                      ? "Grátis"
                      : restaurant.tax.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
