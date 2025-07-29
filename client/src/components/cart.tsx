import { XIcon } from "lucide-react"

import { useCart } from "@/contexts/cart"

import { EmptyCart } from "./empty-cart"
import { Button } from "./ui/button"
import { SheetClose, SheetContent, SheetHeader, SheetTitle } from "./ui/sheet"

export function Cart() {
  const { numberOfItems } = useCart()

  return (
    <SheetContent
      aria-describedby={undefined}
      autoFocus={undefined}
    >
      <SheetHeader className="items-center flex-row border-b">
        <SheetClose
          asChild
          className="top-4 left-4"
        >
          <Button
            size="icon"
            variant="ghost"
          >
            <XIcon />
          </Button>
        </SheetClose>

        <SheetTitle hidden={numberOfItems === 0}>Sua sacola</SheetTitle>
      </SheetHeader>

      {numberOfItems === 0 && <EmptyCart />}
    </SheetContent>
  )
}
