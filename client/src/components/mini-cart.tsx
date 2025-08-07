import { ShoppingBagIcon } from "lucide-react"

import { useCart } from "@/contexts/cart"

import { Cart } from "./cart"
import { Sheet, SheetTrigger } from "./ui/sheet"

export function MiniCart() {
  const { numberOfItems } = useCart()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex shrink-0 items-center gap-2 cursor-default">
          <div className="relative">
            <ShoppingBagIcon className="size-6 shrink-0 text-primary" />

            <span className="absolute -top-2 -right-2.5 bg-primary rounded-full size-4 text-xs text-center text-background font-semibold">
              {numberOfItems}
            </span>
          </div>
        </div>
      </SheetTrigger>

      <Cart />
    </Sheet>
  )
}
