import { zodResolver } from "@hookform/resolvers/zod"
import { useQuery } from "@tanstack/react-query"
import { Controller, useForm } from "react-hook-form"
import { useSearchParams } from "react-router"
import z from "zod"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { listCategories } from "@/http/list-categories"

const restaurantFilterSchema = z.object({
  category: z.string().optional(),
  tax: z.string().optional(),
  deliveryTime: z.string().optional(),
  grade: z.string().optional(),
})

type RestaurantFilterSchema = z.infer<typeof restaurantFilterSchema>

export function RestaurantFilters() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories({}),
    staleTime: Infinity,
  })

  const [searchParams, setSearchParams] = useSearchParams()

  const category = searchParams.get("category")
  const tax = searchParams.get("tax")
  const deliveryTime = searchParams.get("deliveryTime")
  const grade = searchParams.get("grade")

  const { handleSubmit, control, reset } = useForm<RestaurantFilterSchema>({
    resolver: zodResolver(restaurantFilterSchema),
    defaultValues: {
      category: category ?? "all",
      tax: tax ?? "all",
      deliveryTime: deliveryTime ?? "all",
      grade: grade ?? "all",
    },
  })

  function handleFilter(data: RestaurantFilterSchema) {
    setSearchParams(prev => {
      if (data.category) {
        prev.set("category", data.category)
      } else {
        prev.delete("category")
      }

      if (data.tax) {
        prev.set("tax", data.tax)
      } else {
        prev.delete("tax")
      }

      if (data.deliveryTime) {
        prev.set("deliveryTime", data.deliveryTime)
      } else {
        prev.delete("deliveryTime")
      }

      if (data.grade) {
        prev.set("grade", data.grade)
      } else {
        prev.delete("grade")
      }

      return prev
    })
  }

  function handleClearFilters() {
    setSearchParams(prev => {
      prev.delete("category")
      prev.delete("tax")
      prev.delete("deliveryTime")
      prev.delete("grade")

      return prev
    })

    reset()
  }

  return (
    <form
      className="flex flex-col lg:flex-row lg:items-center gap-2"
      onSubmit={handleSubmit(handleFilter)}
    >
      <span className="font-semibold">Filtros</span>

      <div>
        <Label className="sr-only">Categoria</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select
              defaultValue="all"
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              disabled={field.disabled}
            >
              <SelectTrigger className="w-full lg:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Categoria</SelectItem>
                {categories?.map(category => (
                  <SelectItem
                    key={category.id}
                    value={category.name}
                  >
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label className="sr-only">Taxa de entrega</Label>
        <Controller
          name="tax"
          control={control}
          render={({ field }) => (
            <Select
              defaultValue="all"
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              disabled={field.disabled}
            >
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Taxa de entrega</SelectItem>
                <SelectItem value="5">Até R$ 5,00</SelectItem>
                <SelectItem value="10">Até R$ 10,00</SelectItem>
                <SelectItem value="15">Até R$ 15,00</SelectItem>
                <SelectItem value="20">Até R$ 20,00</SelectItem>
                <SelectItem value="25">Até R$ 25,00</SelectItem>
                <SelectItem value="30">Até R$ 30,00</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label className="sr-only">Tempo de entrega</Label>
        <Controller
          name="deliveryTime"
          control={control}
          render={({ field }) => (
            <Select
              defaultValue="all"
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              disabled={field.disabled}
            >
              <SelectTrigger className="w-full lg:w-44">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Tempo de entrega</SelectItem>
                <SelectItem value="30">Até 30 minutos</SelectItem>
                <SelectItem value="60">Até 60 minutos</SelectItem>
                <SelectItem value="90">Até 90 minutos</SelectItem>
                <SelectItem value="120">Até 120 minutos</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label className="sr-only">Avaliação</Label>
        <Controller
          name="grade"
          control={control}
          render={({ field }) => (
            <Select
              defaultValue="all"
              name={field.name}
              value={field.value}
              onValueChange={field.onChange}
              disabled={field.disabled}
            >
              <SelectTrigger className="w-full lg:w-32">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Avaliação</SelectItem>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="flex flex-col md:flex-row items-center gap-2">
        <Button className="text-sm! flex-1 w-full md:w-auto">
          Filtrar resultados
        </Button>
        <Button
          type="button"
          className="text-sm! flex-1 w-full md:w-auto"
          variant="outline"
          onClick={handleClearFilters}
        >
          Limpar filtros
        </Button>
      </div>
    </form>
  )
}
