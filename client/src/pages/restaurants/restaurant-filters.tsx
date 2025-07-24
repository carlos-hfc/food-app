import { useQuery } from "@tanstack/react-query"

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

export function RestaurantFilters() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => listCategories({}),
    staleTime: Infinity,
  })

  return (
    <form className="flex flex-col lg:flex-row lg:items-center gap-2">
      <span className="font-semibold">Filtros</span>

      <div>
        <Label className="sr-only">Categoria</Label>
        <Select defaultValue="all">
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Categoria</SelectItem>
            {categories?.map(category => (
              <SelectItem
                key={category.id}
                value={category.id}
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="sr-only">Taxa de entrega</Label>
        <Select defaultValue="all">
          <SelectTrigger className="w-full lg:w-48">
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
      </div>

      <div>
        <Label className="sr-only">Tempo de entrega</Label>
        <Select defaultValue="all">
          <SelectTrigger className="w-full lg:w-48">
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
      </div>

      <Button className="text-sm!">Filtrar resultados</Button>
      <Button
        className="text-sm!"
        variant="outline"
      >
        Cancelar filtros
      </Button>
    </form>
  )
}
