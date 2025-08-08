import { Link, Navigate } from "react-router"

import { Seo } from "@/components/seo"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart"
import { useCheckout } from "@/hooks/useCheckout"
import { formatPriceNumber } from "@/lib/format-price-number"

import { CheckoutItem } from "./checkout-item"
import { ShippingStep } from "./steps/shipping-step"

export function Checkout() {
  const { items, numberOfItems } = useCart()
  const { subtotal, tax, total } = useCheckout()

  if (numberOfItems === 0) {
    return (
      <Navigate
        to="/restaurantes"
        replace
      />
    )
  }

  return (
    <>
      <Seo title="Checkout" />

      <div className="space-y-3">
        <span className="text-xl lg:text-2xl block font-bold">Checkout</span>

        <div className="flex justify-between gap-4">
          <div className="w-full">
            <ShippingStep />
          </div>

          <div className="bg-accent size-full rounded-lg p-6 space-y-6">
            <p className="text-base font-bold">Resumo do pedido</p>

            <div className="divide-y *:pb-2 *:last:pb-0 space-y-2">
              {items.map((product, i) => (
                <CheckoutItem
                  key={i}
                  product={product}
                />
              ))}
            </div>

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
        </div>
      </div>

      <footer className="mt-auto flex flex-col md:flex-row justify-between gap-2">
        <Button
          asChild
          variant="secondary"
        >
          <Link
            to="/restaurantes"
            className="md:max-w-40 w-full"
          >
            Voltar
          </Link>
        </Button>

        <Button className="md:max-w-40 w-full">Continuar</Button>
      </footer>
    </>
  )
}
