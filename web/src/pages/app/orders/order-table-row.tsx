import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowRightIcon, SearchIcon, XIcon } from "lucide-react"

import { OrderStatus } from "@/components/order-status"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { TableCell, TableRow } from "@/components/ui/table"

import { OrderDetails } from "./order-details"

interface OrderTableRowProps {
  order: {
    id: string
    date: string
    status: "PENDING" | "PREPARING" | "ROUTING" | "DELIVERED" | "CANCELED"
    payment: "CARD" | "CASH" | "PIX"
    total: number
    grade: number | null
    client: {
      name: string
    }
  }
}

export function OrderTableRow({ order }: OrderTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              size={"xs"}
              aria-label="Detalhes do pedido"
            >
              <SearchIcon className="size-3" />
            </Button>
          </DialogTrigger>

          <OrderDetails />
        </Dialog>
      </TableCell>
      <TableCell className="font-mono text-xs font-medium">
        {order.id}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {formatDistanceToNow(new Date(order.date), {
          locale: ptBR,
          addSuffix: true,
        })}
      </TableCell>
      <TableCell className="font-medium">{order.payment}</TableCell>
      <TableCell>
        <OrderStatus status={order.status} />
      </TableCell>
      <TableCell className="font-medium">{order.client.name}</TableCell>
      <TableCell className="font-medium">
        {order.total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </TableCell>
      <TableCell>
        <Button
          variant={"outline"}
          size={"xs"}
        >
          <ArrowRightIcon className="mr-2 size-3" />
          Aprovar
        </Button>
      </TableCell>
      <TableCell>
        <Button
          variant={"ghost"}
          size={"xs"}
        >
          <XIcon className="mr-2 size-3" />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  )
}
