import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "react-router"
import z from "zod"

import { listCategories } from "@/http/list-categories"
import { listRestaurants } from "@/http/list-restaurants"

import { CategoryCard } from "./category-card"

export function Restaurants() {
  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get("category")
  const name = searchParams.get("name")
  const tax = z.coerce
    .number()
    .nullable()
    .parse(searchParams.get("tax") ?? null)
  const deliveryTime = z.coerce
    .number()
    .nullable()
    .parse(searchParams.get("deliveryTime") ?? null)
  const grade = z.coerce
    .number()
    .nullable()
    .parse(searchParams.get("grade") ?? null)

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

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <span className="text-xl lg:text-2xl block font-bold">
          Conheça as categorias
        </span>

        <div className="flex gap-4 overflow-x-auto scrollbar-hidden">
          {categories?.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2"></div>
    </div>
  )
}
