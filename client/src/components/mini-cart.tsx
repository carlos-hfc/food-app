import { ShoppingBagIcon } from "lucide-react"

import { useCart } from "@/contexts/cart"

export function MiniCart() {
  const { numberOfItems, items } = useCart()

  const { total } = items.reduce(
    (accumulator, current) => {
      accumulator.total += current.price * current.quantity

      return accumulator
    },
    { total: 0 },
  )

  return (
    <div className="flex shrink-0 items-center gap-2">
      <ShoppingBagIcon className="size-6 shrink-0 text-primary" />

      <div className="text-muted-foreground text-xs">
        <span className="block">
          {total.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </span>
        <span>{numberOfItems} itens</span>
      </div>
    </div>
  )
}
