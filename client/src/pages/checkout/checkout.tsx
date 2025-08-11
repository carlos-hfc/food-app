import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { Navigate, useNavigate, useSearchParams } from "react-router"
import { toast } from "sonner"
import z from "zod"

import { Seo } from "@/components/seo"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart"
import { useCheckout } from "@/hooks/useCheckout"
import { createOrder } from "@/http/create-order"
import { formatPriceNumber } from "@/lib/format-price-number"

import { CheckoutItem } from "./checkout-item"
import { PaymentStep } from "./steps/payment-step"
import { ShippingStep } from "./steps/shipping-step"

const checkoutSchema = z.object({
  payment: z.string(),
  addressId: z.uuid(),
})

type CheckoutSchema = z.infer<typeof checkoutSchema>

export function Checkout() {
  const { items, numberOfItems, restaurant, cleanCart } = useCart()
  const { subtotal, tax, total } = useCheckout()

  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const { register, watch, handleSubmit } = useForm<CheckoutSchema>({
    resolver: zodResolver(checkoutSchema),
  })

  const { mutateAsync: createOrderFn, isPending: isCreatingOrder } =
    useMutation({
      mutationFn: createOrder,
      onSuccess() {
        navigate("/pedidos")
        cleanCart()
      },
    })

  if (numberOfItems === 0) {
    return (
      <Navigate
        to="/restaurantes"
        replace
      />
    )
  }

  const step = searchParams.get("step")

  async function handleCreateOrder(data: CheckoutSchema) {
    if (step !== "2") {
      return nextStep()
    }

    try {
      await createOrderFn({
        addressId: data.addressId,
        payment: data.payment,
        products: items,
        restaurantId: restaurant?.id ?? items[0].restaurantId,
      })

      toast.success("Pedido realizado com sucesso!")
    } catch (error) {
      toast.success("Falha ao fazer o pedido, tente novamente")
    }
  }

  function prevStep() {
    setSearchParams(prev => {
      if (step === "1") {
        navigate("/restaurantes")
      } else {
        prev.set("step", String(Number(step) - 1))
      }

      return prev
    })
  }

  function nextStep() {
    setSearchParams(prev => {
      if (step !== "2") {
        prev.set("step", String(Number(step) + 1))
      }

      return prev
    })
  }

  return (
    <form
      className="flex flex-1 flex-col gap-4"
      onSubmit={handleSubmit(handleCreateOrder)}
    >
      <Seo title="Checkout" />

      <div className="space-y-3">
        <span className="text-xl lg:text-2xl block font-bold">Checkout</span>

        <div className="flex justify-between gap-4">
          <div className="w-full">
            {(step === "1" || !step) && (
              <ShippingStep
                name="addressId"
                register={register}
                watch={watch}
              />
            )}

            {step === "2" && (
              <PaymentStep
                name="payment"
                register={register}
                watch={watch}
              />
            )}
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
          type="button"
          variant="secondary"
          className="md:max-w-40 w-full"
          onClick={prevStep}
          disabled={isCreatingOrder}
        >
          Voltar
        </Button>

        <Button
          type="submit"
          className="md:max-w-40 w-full"
          onClick={nextStep}
          disabled={isCreatingOrder}
        >
          {step === "2" ? "Fazer pedido" : "Continuar"}
        </Button>
      </footer>
    </form>
  )
}
