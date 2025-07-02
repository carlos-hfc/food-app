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

const orderFilterSchema = z.object({
  status: z.string().optional(),
  payment: z.string().optional(),
})

type OrderFilterSchema = z.infer<typeof orderFilterSchema>

export function OrderTableFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const status = searchParams.get("status")
  const payment = searchParams.get("payment")

  const { handleSubmit, control, reset } = useForm({
    resolver: zodResolver(orderFilterSchema),
    defaultValues: {
      status: status ?? "all",
      payment: payment ?? "all",
    },
  })

  function handleFilter(data: OrderFilterSchema) {
    setSearchParams(prev => {
      if (data.status) {
        prev.set("status", data.status)
      } else {
        prev.delete("status")
      }

      if (data.payment) {
        prev.set("payment", data.payment)
      } else {
        prev.delete("payment")
      }

      prev.set("page", "1")

      return prev
    })
  }

  function handleClearFilters() {
    setSearchParams(prev => {
      prev.delete("status")
      prev.delete("payment")
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
        name="status"
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
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="pending">Pendente</SelectItem>
              <SelectItem value="canceled">Cancelado</SelectItem>
              <SelectItem value="preparing">Em preparo</SelectItem>
              <SelectItem value="routing">Em entrega</SelectItem>
              <SelectItem value="delivered">Entregue</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <Controller
        name="payment"
        control={control}
        render={({ field }) => (
          <Select
            defaultValue="all"
            name={field.name}
            value={field.value}
            onValueChange={field.onChange}
            disabled={field.disabled}
          >
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
