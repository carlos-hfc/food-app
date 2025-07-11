import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { useSearchParams } from "react-router"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const productFilterSchema = z.object({
  active: z.string().optional(),
  available: z.string().optional(),
})

type ProductFilterSchema = z.infer<typeof productFilterSchema>

export function ProductTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const active = searchParams.get("active")
  const available = searchParams.get("available")

  const { handleSubmit, control, reset } = useForm<ProductFilterSchema>({
    resolver: zodResolver(productFilterSchema),
    defaultValues: {
      active: active ?? "all",
      available: available ?? "all",
    },
  })

  function handleFilter(data: ProductFilterSchema) {
    setSearchParams(prev => {
      if (data.active) {
        prev.set("active", data.active)
      } else {
        prev.delete("active")
      }

      if (data.available) {
        prev.set("available", data.available)
      } else {
        prev.delete("available")
      }

      prev.set("page", "1")

      return prev
    })
  }

  function handleClearFilters() {
    setSearchParams(prev => {
      prev.delete("active")
      prev.delete("available")
      prev.delete("page")

      return prev
    })

    reset()
  }

  return (
    <form
      className="flex items-center gap-2"
      onSubmit={handleSubmit(handleFilter)}
    >
      <span className="text-sm font-semibold">Filtros</span>

      <Controller
        name="active"
        control={control}
        render={({ field }) => (
          <Select
            defaultValue="all"
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            disabled={field.disabled}
          >
            <SelectTrigger className="h-8 w-48">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todos os ativos</SelectItem>
              <SelectItem value="true">Ativos</SelectItem>
              <SelectItem value="false">Inativos</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Controller
        name="available"
        control={control}
        render={({ field }) => (
          <Select
            defaultValue="all"
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            disabled={field.disabled}
          >
            <SelectTrigger className="h-8 w-48">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todos os disponíveis</SelectItem>
              <SelectItem value="true">Disponíveis</SelectItem>
              <SelectItem value="false">Indisponíveis</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Button
        type="submit"
        variant={"secondary"}
        size={"xs"}
      >
        Filtrar resultados
      </Button>
      <Button
        type="button"
        variant={"outline"}
        size={"xs"}
        onClick={handleClearFilters}
      >
        Remover filtros
      </Button>
    </form>
  )
}
