import { ShoppingBagIcon } from "lucide-react"

import { useCart } from "@/contexts/cart"

import { Cart } from "./cart"
import { Sheet, SheetTrigger } from "./ui/sheet"

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
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex shrink-0 items-center gap-2 cursor-default">
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
      </SheetTrigger>

      <Cart />
    </Sheet>
  )
}
