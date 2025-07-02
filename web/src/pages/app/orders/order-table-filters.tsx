import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function OrderTableFilters() {
  return (
    <form className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros</span>

      <Select>
        <SelectTrigger className="h-8 w-48">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="canceled">Cancelado</SelectItem>
          <SelectItem value="preparing">Em preparo</SelectItem>
          <SelectItem value="routing">Em entrega</SelectItem>
          <SelectItem value="delivered">Entregue</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="h-8 w-52">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">Todos os pagamentos</SelectItem>
          <SelectItem value="pix">PIX</SelectItem>
          <SelectItem value="card">Cartão</SelectItem>
          <SelectItem value="cash">Dinheiro</SelectItem>
        </SelectContent>
      </Select>

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
      >
        Remover filtros
      </Button>
    </form>
  )
}
