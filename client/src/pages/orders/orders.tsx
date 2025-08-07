import { useQuery } from "@tanstack/react-query"

import { Seo } from "@/components/seo"
import { listOrders } from "@/http/list-orders"

import { EmptyOrders } from "./empty-orders"
import { OrderItem } from "./order-item"
import { OrderItemSkeleton } from "./order-item-skeleton"

export function Orders() {
  const { data: orders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ["orders"],
    queryFn: listOrders,
  })

  return (
    <div className="flex flex-col gap-6">
      <Seo title="Meus pedidos" />

      <div className="space-y-3">
        <span className="text-xl lg:text-2xl block font-bold">
          Meus pedidos
        </span>

        <div className="grid gap-4 md:gap-6">
          {isLoadingOrders ? (
            <OrderItemSkeleton />
          ) : orders && orders.length > 0 ? (
            orders.map(order => (
              <OrderItem
                key={order.id}
                order={order}
              />
            ))
          ) : (
            <EmptyOrders />
          )}
        </div>
      </div>
    </div>
  )
}
