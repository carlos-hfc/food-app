import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronRightIcon, StarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { OrderStatus, OrderStatusType } from "./order-status"

interface OrderItemProps {
  order: {
    id: string
    status: string
    date: string
    rate: number | null
    restaurant: {
      name: string
      image: string | null
    }
    products: {
      quantity: number
      product: string
    }[]
  }
}

export function OrderItem({ order }: OrderItemProps) {
  const orderDate = format(new Date(order.date), "EEEEEE dd MMMM yyyy", {
    locale: ptBR,
  })

  return (
    <div className="space-y-2">
      <time
        dateTime={order.date}
        title={orderDate}
        className="text-muted-foreground text-xs md:text-sm block capitalize"
      >
        {orderDate}
      </time>

      <div className="rounded-md shadow-md p-3 md:px-6 divide-y space-y-3 *:pb-3">
        <div className="flex items-center gap-2 md:gap-4">
          <img
            src={order.restaurant.image ?? "/hamburger.webp"}
            alt={order.restaurant.name}
            className="rounded-full object-cover size-16 md:size-24"
          />

          <span className="text-sm md:text-base font-semibold">
            {order.restaurant.name}
          </span>

          <ChevronRightIcon
            className="size-4 md:size-6 ml-auto"
            aria-label="Ver pedido"
          />
        </div>

        <div className="text-xs md:text-sm space-y-1">
          <OrderStatus status={order.status as OrderStatusType} />

          <div className="flex items-center gap-1">
            <span className="rounded-sm bg-accent px-1">
              {order.products.at(0)?.quantity}
            </span>
            <p className="text-muted-foreground">
              {order.products.at(0)?.product}
            </p>
          </div>

          {order.products.length > 1 && (
            <span className="font-semibold text-muted-foreground">
              mais {order.products.length - 1} item(s)
            </span>
          )}
        </div>

        {order.rate && (
          <div className="flex text-sm justify-between">
            <span className="text-muted-foreground">Avaliação</span>

            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon
                  key={i}
                  className={cn(
                    "size-4 fill-foreground stroke-foreground",
                    Number(order.rate) <= i &&
                      "fill-foreground/50 stroke-foreground/40",
                  )}
                />
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2 pb-0!">
          <Button
            variant="link"
            size="sm"
            className="text-sm! flex-1"
          >
            Detalhes
          </Button>
          <div className="h-auto w-px bg-border" />
          <Button
            variant="link"
            size="sm"
            className="text-sm! flex-1"
          >
            Adicionar à sacola
          </Button>
        </div>
      </div>
    </div>
  )
}
