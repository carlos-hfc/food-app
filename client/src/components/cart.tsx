import { XIcon } from "lucide-react"
import { useLocation, useNavigate } from "react-router"

import { useCart } from "@/contexts/cart"
import { formatPriceNumber } from "@/lib/format-price-number"
import { cn } from "@/lib/utils"

import { EmptyCart } from "./empty-cart"
import { ProductCart } from "./product-cart"
import { Button } from "./ui/button"
import {
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"

export function Cart() {
  const { numberOfItems, items, restaurant, cleanCart } = useCart()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  function navigateToRestaurant() {
    if (pathname === `/restaurantes/${restaurant?.id}`) return

    navigate(`/restaurantes/${restaurant?.id}`)
  }

  const { subtotal, tax, total } = items.reduce(
    (accumulator, current) => {
      accumulator.subtotal += current.price * current.quantity
      accumulator.total = accumulator.subtotal + accumulator.tax

      return accumulator
    },
    {
      subtotal: 0,
      tax: restaurant?.tax ?? 0,
      total: 0,
    },
  )

  return (
    <SheetContent
      aria-describedby={undefined}
      autoFocus={undefined}
      className="w-full"
    >
      <SheetHeader
        className={cn(
          "items-center flex-row sticky w-full top-0 border-t",
          numberOfItems > 0 && "border-b",
        )}
      >
        <SheetClose asChild>
          <Button
            size="icon"
            variant="ghost"
            className="top-4 left-4"
          >
            <XIcon />
          </Button>
        </SheetClose>

        <SheetTitle
          hidden={numberOfItems === 0}
          className="text-center flex-1"
        >
          Sua sacola
        </SheetTitle>

        <Button
          hidden={numberOfItems === 0}
          size="sm"
          variant="link"
          className="ml-auto text-sm!"
          onClick={cleanCart}
        >
          Limpar
        </Button>
      </SheetHeader>

      {numberOfItems === 0 && <EmptyCart />}

      {numberOfItems > 0 && (
        <>
          <div className="flex-1 overflow-y-auto px-4 space-y-6">
            <div className="flex items-center gap-3">
              <img
                src={restaurant?.image ?? "/hamburger.webp"}
                alt={restaurant?.name}
                className="rounded-full object-cover size-16"
              />

              <div>
                <p className="font-bold text-sm">{restaurant?.name}</p>

                <SheetClose asChild>
                  <Button
                    size="sm"
                    variant="link"
                    onClick={navigateToRestaurant}
                    className="text-sm! p-0 h-auto"
                  >
                    Adicionar mais itens
                  </Button>
                </SheetClose>
              </div>
            </div>

            <div className="space-y-3">
              <p className="font-bold">Itens selecionados</p>

              <div className="space-y-3">
                {items.map(item => (
                  <ProductCart
                    key={item.id}
                    product={item}
                  />
                ))}
              </div>
            </div>

            <SheetClose asChild>
              <Button
                variant="link"
                onClick={navigateToRestaurant}
                className="w-full text-sm!"
              >
                Adicionar mais itens
              </Button>
            </SheetClose>

            <div className="text-sm space-y-2">
              <p className="text-base font-bold">Resumo de valores</p>

              <div className="flex items-center justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPriceNumber(subtotal)}</span>
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <span>Taxa de entrega</span>
                <span>{tax !== 0 ? formatPriceNumber(tax) : "Grátis"}</span>
              </div>

              <div className="flex items-center justify-between font-bold">
                <span>Total</span>
                <span>{formatPriceNumber(total)}</span>
              </div>
            </div>
          </div>

          <SheetFooter className="flex-row items-center justify-between sticky w-full bottom-0 border-t">
            <div>
              <span className="text-xs text-muted-foreground">
                Total com a entrega
              </span>
              <p className="font-bold leading-0.5">
                {formatPriceNumber(total)}
                <span className="text-xs text-muted-foreground font-normal">
                  {" "}
                  / {numberOfItems} item(s)
                </span>
              </p>
            </div>

            <Button className="w-1/2">Continuar</Button>
          </SheetFooter>
        </>
      )}
    </SheetContent>
  )
}
