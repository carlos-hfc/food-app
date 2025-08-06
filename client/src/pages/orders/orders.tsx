import { Seo } from "@/components/seo"

import { OrderItem } from "./order-item"

export function Orders() {
  return (
    <div className="flex flex-col gap-6">
      <Seo title="Meus pedidos" />

      <div className="space-y-3">
        <span className="text-xl lg:text-2xl block font-bold">
          Meus pedidos
        </span>

        <div className="grid gap-3 md:gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <OrderItem key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
