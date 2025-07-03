import { useMutation } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ArrowRightIcon, SearchIcon, XIcon } from "lucide-react"
import { useState } from "react"

import { OrderStatus, OrderStatusType } from "@/components/order-status"
import { PaymentMethod } from "@/components/payment-method"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { TableCell, TableRow } from "@/components/ui/table"
import { approveOrder } from "@/http/approve-order"
import { cancelOrder } from "@/http/cancel-order"
import { deliverOrder } from "@/http/deliver-order"
import { dispatchOrder } from "@/http/dispatch-order"
import { GetOrdersResponse } from "@/http/get-orders"
import { queryClient } from "@/lib/react-query"

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  function updateOrderStatusOnCache(orderId: string, status: OrderStatusType) {
    const ordersListCache = queryClient.getQueriesData<GetOrdersResponse>({
      queryKey: ["orders"],
    })

    ordersListCache.forEach(([cacheKey, cacheData]) => {
      if (!cacheData) return

      queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
        ...cacheData,
        orders: cacheData.orders.map(order => {
          if (order.id === orderId) {
            return { ...order, status }
          }

          return order
        }),
      })
    })
  }

  const { mutateAsync: cancelOrderFn, isPending: isCancelingOrder } =
    useMutation({
      mutationFn: cancelOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, "CANCELED")
      },
    })

  const { mutateAsync: approveOrderFn, isPending: isApprovingOrder } =
    useMutation({
      mutationFn: approveOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, "PREPARING")
      },
    })

  const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } =
    useMutation({
      mutationFn: dispatchOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, "ROUTING")
      },
    })

  const { mutateAsync: deliverOrderFn, isPending: isDeliveringOrder } =
    useMutation({
      mutationFn: deliverOrder,
      async onSuccess(_, { orderId }) {
        updateOrderStatusOnCache(orderId, "DELIVERED")
      },
    })

  return (
    <TableRow>
      <TableCell>
        <Dialog
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant={"outline"}
              size={"xs"}
              aria-label="Detalhes do pedido"
            >
              <SearchIcon className="size-3" />
            </Button>
          </DialogTrigger>

          <OrderDetails
            open={isDetailsOpen}
            orderId={order.id}
          />
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
      <TableCell>
        <PaymentMethod paymentMethod={order.payment} />
      </TableCell>
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
        {order.status === "PENDING" && (
          <Button
            variant={"outline"}
            size={"xs"}
            onClick={() => approveOrderFn({ orderId: order.id })}
            disabled={isApprovingOrder}
          >
            <ArrowRightIcon className="mr-2 size-3" />
            Aprovar
          </Button>
        )}

        {order.status === "PREPARING" && (
          <Button
            variant={"outline"}
            size={"xs"}
            onClick={() => dispatchOrderFn({ orderId: order.id })}
            disabled={isDispatchingOrder}
          >
            <ArrowRightIcon className="mr-2 size-3" />
            Em entrega
          </Button>
        )}

        {order.status === "ROUTING" && (
          <Button
            variant={"outline"}
            size={"xs"}
            onClick={() => deliverOrderFn({ orderId: order.id })}
            disabled={isDeliveringOrder}
          >
            <ArrowRightIcon className="mr-2 size-3" />
            Entregue
          </Button>
        )}
      </TableCell>
      <TableCell>
        <Button
          variant={"ghost"}
          size={"xs"}
          disabled={
            !["PENDING", "PREPARING"].includes(order.status) || isCancelingOrder
          }
          onClick={() => cancelOrderFn({ orderId: order.id })}
        >
          <XIcon className="mr-2 size-3" />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  )
}
